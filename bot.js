import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

export const bot = new TelegramBot(process.env.TG_BOT_TOKEN, {
  polling: true, // IMPORTANT
});