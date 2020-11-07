import { Client, TextChannel } from "discord.js";
import { readFile, writeFile } from "fs";
import * as schedule from "node-schedule";

import { incrementQOTD, getNextQOTD, getQOTDChannel } from "../utils/dbutils";

export type Question = {
  question: string;
  number: number;
};

class QOTD {
  twitchWatch: schedule.Job;
  bot: Client;
  constructor(bot: Client) {
    this.bot = bot;
    this.start();
  }

  public start() {
    this.twitchWatch = schedule.scheduleJob("0 0 13 * * *", async () => {
      console.log("Loading data for QOTD");
      getNextQOTD().then(async (qotd) => {
        console.log(qotd);
        const channel = this.bot.channels.cache.get(
          await getQOTDChannel()
        ) as TextChannel;
        channel
          .send(
            `**----------- Question ${qotd.number} -----------**\n${qotd.question}`
          )
          .then((message) => {
            message.pin({ reason: "Question of the day" });
          });
        incrementQOTD();
      });
    });
  }
}

export default QOTD;
