import { Client, Message } from "discord.js";
import QOTD from "./qotd";
import bot from "../bot";

type CommandHelp = {
  commandName: string;
  description: string;
  example: string;
};

export abstract class Command {
  deleteMessage: boolean;
  bot: Client;
  abstract helpInformation: CommandHelp;
  register(bot: Client) {
    this.bot = bot;
  }
  abstract call(message: Message);
  help() {
    return this.helpInformation;
  }
}

const commands = [new QOTD()];

commands.forEach((element) => {
  element.register(bot);
});

export { commands };
