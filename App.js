// const { Bot } = require('./bot/index');
// const { getMainMenu } = require('./utils/keyboards');

import { Bot } from './bot/index.js'
import { ALL_ACTIVE_TASKS, MY_TASKS, ADD_TASK, CHOOSE_PROJECT } from './constants/index.js'
import { addTask } from './services/index.js'
import { getMainMenu, getProjects, getTaskMenu, yesNoKeyboard } from './utils/keyboards.js'
import { session } from 'telegraf'

export const App = () => {
    const bigTask = {}

    Bot.use(session())
    
    Bot.start((ctx) => {
        ctx.replyWithHTML('Здорова, боярин!\n Чего желаете? \n\n', getMainMenu())
    }) //ответ бота на команду /start

    Bot.hears(ALL_ACTIVE_TASKS, ctx => {
        ctx.reply(ALL_ACTIVE_TASKS)
    })

    Bot.hears(ADD_TASK, ctx => {
        ctx.reply('Чтобы быстро добавить задачу, просто напишите ее и отправьте боту', getTaskMenu())
    })

    Bot.on('text', ctx => {
        ctx.session.taskText = ctx.message.text

        ctx.replyWithHTML(
            `Вы действительно хотите добавить задачу:\n\n`+
            `<i>${ctx.message.text}</i>`,
            yesNoKeyboard()
        )
    })

    Bot.action(['yes', 'no'], ctx => {
        if (ctx.callbackQuery.data === 'yes') {
            addTask(ctx.session.taskText)
            ctx.editMessageText('Ваша задача успешно добавлена')
        } else {
            ctx.deleteMessage()
        }
    })

    Bot.hears(MY_TASKS, ctx => {
        ctx.reply(MY_TASKS)
    })

    Bot.hears(CHOOSE_PROJECT, ctx => {
        ctx.reply('Выбери проект: \n', getProjects())
    })

    Bot.help((ctx) => ctx.reply('Send me a sticker')) //ответ бота на команду /help
    Bot.on('sticker', (ctx) => ctx.reply('')) //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер, можно использовать обработчик текста или голосового сообщения
    Bot.hears('hi', (ctx) => ctx.reply('Hey there')) // bot.hears это обработчик конкретного текста, данном случае это - "hi"
    
    Bot.launch() // запуск бота
}

// module.exports = { App }