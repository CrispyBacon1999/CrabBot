import bot from "./bot";
import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

bot.on("ready", () => {
  console.log("Connected to discord bot");
});
