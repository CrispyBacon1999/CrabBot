import { Client, TextChannel } from "discord.js";
import { readFile, writeFile } from "fs";
import * as schedule from "node-schedule";

type QOTDFile = {
  currentQuestion: string;
  serverid: string;
  channelid: string;
  questions: {
    [key: string]: Question;
  };
};

type Question = {
  question: string;
};

class QOTD {
  static filePath: string = "./qotd.json";
  twitchWatch: schedule.Job;
  bot: Client;
  constructor(bot: Client) {
    this.bot = bot;
    this.start();
  }

  public start() {
    this.twitchWatch = schedule.scheduleJob("0 0 13 * * *", async () => {
      console.log("Loading data for QOTD");
      const data = await this.dataFile();
      this.loadQotd(data).then((qotd) => {
        const channel = this.bot.channels.cache.get(
          data.channelid
        ) as TextChannel;
        channel
          .send(
            `**----------- Question ${qotd.number} -----------**\n${qotd.question.question}`
          )
          .then((message) => {
            message.pin({ reason: "Question of the day" });
          });
        this.updateQOTDDay();
      });
    });
  }

  private async updateQOTDDay() {
    const file = await this.dataFile();
    file.currentQuestion = (parseInt(file.currentQuestion) + 1).toString();
    writeFile(QOTD.filePath, JSON.stringify(file), () => {});
  }

  private async loadQotd(
    data: QOTDFile
  ): Promise<{ number: number; question: Question }> {
    data.currentQuestion = (parseInt(data.currentQuestion) + 1).toString();
    if (data.currentQuestion in data.questions) {
      return {
        number: parseInt(data.currentQuestion),
        question: data.questions[data.currentQuestion],
      };
    }
    return null;
  }

  private async dataFile(): Promise<QOTDFile> {
    const data = await this.readDataFile();
    const parsedData = JSON.parse(data.toString()) as QOTDFile;
    return parsedData;
  }

  private async readDataFile(): Promise<Buffer> {
    return new Promise((res, rej) => {
      readFile(QOTD.filePath, (err, data) => {
        if (err) {
          rej(err);
        } else {
          res(data);
        }
      });
    });
  }
}

export default QOTD;
