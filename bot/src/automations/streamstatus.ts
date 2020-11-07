import { ApiClient, HelixStream } from "twitch";
import { ClientCredentialsAuthProvider } from "twitch-auth";
import * as schedule from "node-schedule";
import client from "bot";
import { Client } from "discord.js";

const clientID = "62ljxdknhfm0bwh2k5yla8i79prvpb";
const clientSecret = process.env.TWITCH_SECRET;

const streamName = "TropicalMoisture";

/**
 * Every 15 seconds, tests the status of TropicalMoisture's
 * twitch channel to see if she's live. Updates bot status.
 */
class StreamWatch {
  client: ApiClient;
  bot: Client;

  constructor(bot: Client) {
    const authProvider = new ClientCredentialsAuthProvider(
      clientID,
      clientSecret
    );
    this.client = new ApiClient({ authProvider });
    this.bot = bot;
    this.updateStatus();
    this.start();
  }

  twitchWatch: schedule.Job;

  private async isLive() {
    const user = await this.client.helix.users.getUserByName(streamName);
    if (!user) {
      return false;
    }
    return await this.client.helix.streams.getStreamByUserId(user.id);
  }

  private async updateStatus() {
    const live = await this.isLive();
    if (live !== null && live !== false) {
      const stream = live as HelixStream;
      this.bot.user.setPresence({
        activity: {
          type: "STREAMING",
          name: stream.title + " for " + stream.viewers + " viewers",
          url: "https://twitch.tv/" + streamName,
        },
      });
    } else {
      this.bot.user.setPresence({
        activity: {
          type: "LISTENING",
          name: "Crab Rave",
        },
      });
    }
  }

  public start() {
    this.twitchWatch = schedule.scheduleJob("*/15 * * * * *", () => {
      this.updateStatus();
    });
  }
}

export default StreamWatch;
