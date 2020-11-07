import QOTD from "./automations/qotd";
import * as Discord from "discord.js";
import StreamStatus from "./automations/streamstatus";

const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

new StreamStatus(client);
new QOTD(client);

export default client;
