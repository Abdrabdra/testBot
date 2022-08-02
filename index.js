const TelegramApi = require("node-telegram-bot-api");

const token = "5326219798:AAHtfvb_6bHkiqA9-UMeAEY6dUmg8hAY-1g";
const { gameOptions, againOptions } = require("./options");

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать)"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Мая кто такая" },
    { command: "/game", description: "Сыграть игру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/thumb-animated-128.mp4"
      );
      return bot.sendMessage(chatId, "Dobro pojalovat Dolbaeb)");
    }

    if (text === "/info") {
      await bot.sendMessage(chatId, `Tvoya zvaya ${msg.from.first_name}`);
      return bot.sendMessage(
        chatId,
        `Tvoya familiya zvaya ${msg.from.last_name}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Moya tvoya ne ponimat brat");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Молодец! Ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Ti musr, bot zagadal cifru ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
