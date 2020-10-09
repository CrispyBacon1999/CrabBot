import client from "./bot";
import bot from "./bot";
import app from "./server";

const PORT = 5080;

bot.on("ready", () => {
  console.log("Connected to discord bot");
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
