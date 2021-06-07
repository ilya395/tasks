// const { Bot } = require('./bot/index');
// const { getMainMenu } = require('./utils/keyboards');

import { Bot } from './bot/index.js'
import { ALL_ACTIVE_TASKS, MY_TASKS, ADD_TASKS } from './constants/index.js'
import { getMainMenu } from './utils/keyboards.js'

export const App = () => {
    const bigTask = {}
    
    Bot.start((ctx) => {
        ctx.replyWithHTML('Welcome!\n\n', getMainMenu())
    }) //ответ бота на команду /start

    Bot.hears(ALL_ACTIVE_TASKS, ctx => {
        ctx.reply(ALL_ACTIVE_TASKS)
    })

    Bot.hears(MY_TASKS, ctx => {
        ctx.reply(MY_TASKS)
    })

    Bot.hears(ADD_TASKS, ctx => {
        ctx.reply('Чтобы быстро добавить задачу, просто напишите ее и отправьте боту')
    })

    Bot.help((ctx) => ctx.reply('Send me a sticker')) //ответ бота на команду /help
    Bot.on('sticker', (ctx) => ctx.reply('')) //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер, можно использовать обработчик текста или голосового сообщения
    Bot.hears('hi', (ctx) => ctx.reply('Hey there')) // bot.hears это обработчик конкретного текста, данном случае это - "hi"
    
    Bot.launch() // запуск бота
}

// module.exports = { App }