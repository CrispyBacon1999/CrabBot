import { Message } from "discord.js";
import { Command } from ".";

export default class QOTD extends Command {
  helpInformation = {
    commandName: "Question Of The Day",
    description: "Register a question of the day",
    example: "!qotd Waffles or Pancakes?",
  };
  call(message: Message) {
    message.reply(message.content);
  }
}
