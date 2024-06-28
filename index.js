const {Bot, InlineKeyboard} = require("grammy"); 

//Store bot screaming status
let screaming = false;

require('dotenv').config();
//Create a new bot
const bot = new Bot(process.env.TEST_BOT_API_KEY);

//This function handles the /scream command
bot.command("scream", () => {
   screaming = true;
 });

//This function handles /whisper command
bot.command("whisper", () => {
   screaming = false;
 });

//Pre-assign menu text
const firstMenu = "<b>Menu 1</b>\n\nThis is menu 1.";
const secondMenu = "<b>Menu 2</b>\n\nThis is menu 2.";

//Pre-assign button text
const nextButton = "Next";
const backButton = "Back";
const tutorialButton = "Tutorials";

//Build keyboards
const firstMenuMarkup = new InlineKeyboard().text(nextButton, nextButton);
 
const secondMenuMarkup = new InlineKeyboard().text(backButton, backButton).text(tutorialButton, "https://core.telegram.org/bots/games");


//sends a menu with the inline buttons pre-assigned above
bot.command("menu", async (ctx) => {
  await ctx.reply(firstMenu, {
    parse_mode: "HTML",
    reply_markup: firstMenuMarkup,
  });
});

//processes back button on the menu
bot.callbackQuery(backButton, async (ctx) => {
  //Update message content with corresponding menu section
  await ctx.editMessageText(firstMenu, {
    reply_markup: firstMenuMarkup,
    parse_mode: "HTML",
   });
 });

 //handle the /play command and get the next parameter after the slash as requested game
 //
 bot.command("play", async (ctx) => {
  const game = ctx.match; 
  console.log(`${ctx.from.first_name} would like to play ${game}`);
  await ctx.reply((`Starting ${game}`)); 
  console.log(`${ctx.from.language_code} is ${ctx.from.first_name}'s language code`);
 });

//Handler processes next button on the menu
bot.callbackQuery(nextButton, async (ctx) => {
  //Update message content with corresponding menu section
  await ctx.editMessageText(secondMenu, {
    reply_markup: secondMenuMarkup,
    parse_mode: "HTML",
   });
 });
 
//Async handler for messages coming from the Bot API
bot.on("message", async (ctx) => {
  //Print to console
  console.log(
    `${ctx.from.first_name} wrote ${
      "text" in ctx.message ? ctx.message.text : ""
    }`,
  );

  if (screaming && ctx.message.text) {
    //Scream the message
    await ctx.reply(ctx.message.text.toUpperCase(), {
      entities: ctx.message.entities,
    });
  } else {
    //forward the massage sent 
    await ctx.copyMessage(ctx.message.chat.id);
  }
});

//Start the Bot
bot.start();
