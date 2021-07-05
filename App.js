// const { Bot } = require('./bot/index');
// const { getMainMenu } = require('./utils/keyboards');

import { Bot } from './bot/index.js'
import { ALL_ACTIVE_TASKS, MY_TASKS, ADD_TASK, CHOOSE_PROJECT, OPEN_TASK_STATUS, CLOSE_TASK, CLOSE_TASK_STATUS } from './constants/index.js'
import { addTask, getTasks, updateTasks } from './services/index.js'
import { getMainMenu, getProjects, getTaskMenu, yesNoKeyboard } from './utils/keyboards.js'
// import { session } from 'telegraf'
import session from '@telegraf/session'
import { ADD_DATE_LIMITATION_ACTION, ADD_EXECUTOR_ACTION, ADD_PROJECT_ACTION, ADD_TASK_ACTION, CLOSE_TASK_ACTION, SAVE_TASK_ACTION, START_SESSION_ACTION, store } from './store/index.js'
const { dispatch, getState } = store;



export const App = () => {

    Bot.use(session())
    
    Bot.start((ctx) => {

        ctx.session.status = START_SESSION_ACTION
        // console.log(ctx.update.message.from, ctx.update.message.chat)
        ctx.session.user = {
            id: ctx.update.message.from.id,
            username: ctx.update.message.username,
            firstName: ctx.update.message.ferst_name,
        }
        ctx.replyWithHTML('Здорова, боярин!\n Чего желаете? \n\n', getMainMenu())
    }) //ответ бота на команду /start

    Bot.hears(MY_TASKS, async ctx => {
        const tasks = await getTasks()
        let result = ''

        const myTasks = tasks.filter(item => item.user.id === ctx.update.message.from.id && item.taskStatus === OPEN_TASK_STATUS)

        if (myTasks.length) {
            myTasks.forEach((item) => {
                result += `[${item.id}] ${item.title || 'Не задано'}\n
                Исполнитель: ${item.executor || 'Не задано'}\n
                Срок: ${item.taskDateLimitation || 'Не задано'}\n
                Проект: ${item.project || 'Не задано'}\n
                Статус: ${item.taskStatus}\n
                ------------------------------\n\n`
            });
            ctx.replyWithHTML(`<b>Список ваших задач:</b>\n\n${result}`)
        } else {
            ctx.replyWithHTML(`<b>Нет задач</b>\n`)
        }
    })

    Bot.hears(ALL_ACTIVE_TASKS, async ctx => {
        const tasks = await getTasks()
        let result = ''

        const activeTasks = tasks.filter(item => item.taskStatus === OPEN_TASK_STATUS)

        if (activeTasks.length > 0) {
            activeTasks.forEach((item) => {
                result += `
                [${item.id}] ${item.title || 'Не задано'}\n
                Исполнитель: ${item.executor || 'Не задано'}\n
                Срок: ${item.taskDateLimitation || 'Не задано'}\n
                Проект: ${item.project || 'Не задано'}\n
                Статус: ${item.taskStatus}\n
                ------------------------------ \n\n`
            });
    
            ctx.replyWithHTML(`<b>Список активных задач:</b>\n\n${result}`)
        } else {
            ctx.replyWithHTML(`<b>Нет активных задач</b>\n`)
        }

    })

    Bot.hears(CLOSE_TASK, async ctx => {
        const tasks = await getTasks()
        let result = ''

        const myTasks = tasks.filter(item => (item.user.id === ctx.update.message.from.id) && item.taskStatus === OPEN_TASK_STATUS)

        if (myTasks.length > 0) {
            myTasks.forEach(item => {
                result += `[${item.id}] ${item.title || 'Не задано'}\n
                ------------------------------\n\n`
            });
            ctx.replyWithHTML(`<b>Список ваших задач:</b>\n\n${result}`)
            ctx.replyWithHTML(`Чтобы быстро закрыть задачу, просто напишите ее id и отправьте боту`)
            ctx.session.status = CLOSE_TASK_ACTION
        } else {
            ctx.replyWithHTML(`<b>Нет задач</b>\n`)
        }
    })

    Bot.hears(ADD_TASK, ctx => {
        ctx.session.status = ADD_TASK_ACTION
        ctx.session.user = {
            id: ctx.update.message.from.id,
            username: ctx.update.message.username,
            firstName: ctx.update.message.ferst_name,
        }
        ctx.reply(
            'Чтобы быстро добавить задачу, просто напишите ее и отправьте боту', 
            // getTaskMenu()
        )
    })

    Bot.on('text', ctx => {

        const status = ctx.session.status

        switch (status) {
            case ADD_TASK_ACTION:
                // console.log(ctx.update.message.from, ctx.update.message.chat)
                ctx.session.taskText = ctx.message.text
        
                ctx.replyWithHTML(
                    `Вы действительно хотите добавить задачу:\n\n`+
                    `<i>${ctx.message.text}</i>`,
                    yesNoKeyboard()
                )
                break;

            case ADD_DATE_LIMITATION_ACTION:
                ctx.session.taskDateLimitation = ctx.message.text

                ctx.replyWithHTML(
                    `Вы действительно хотите добавить к задаче срок:\n\n`+
                    `<i>${ctx.message.text}</i>`,
                    yesNoKeyboard()
                )
                break;

            case ADD_EXECUTOR_ACTION:
                ctx.session.taskExecutor = ctx.message.text

                ctx.replyWithHTML(
                    `Вы действительно хотите добавить к задаче исполнителя:\n\n`+
                    `<i>${ctx.message.text}</i>`,
                    yesNoKeyboard()
                )
                break;

            case ADD_PROJECT_ACTION:
                ctx.session.taskProject = ctx.message.text

                ctx.replyWithHTML(
                    `Вы действительно хотите добавить к задаче проект:\n\n`+
                    `<i>${ctx.message.text}</i>`,
                    yesNoKeyboard()
                )
                break;

            case CLOSE_TASK_ACTION:
                ctx.session.closingTaskId = ctx.message.text

                ctx.replyWithHTML(
                    `Вы действительно хотите закрыть задачу:\n\n`+
                    `<i>${ctx.message.text}</i>`,
                    yesNoKeyboard()
                )
                break;
        
            default:
                ctx.reply(`Что мне с этим делать?`)
                break;
        }


    })

    Bot.action(['yes', 'no'], async ctx => {

        const status = ctx.session.status
        switch (status) {
            case ADD_TASK_ACTION:
                if (ctx.callbackQuery.data === 'yes') {
                    ctx.reply(
                        'Чтобы быстро добавить срок, просто напишите его и отправьте боту', 
                    )
                    ctx.session.status = ADD_DATE_LIMITATION_ACTION
                } else {
                    ctx.reply(
                        'Чтобы быстро добавить задачу, просто напишите ее и отправьте боту', 
                    )
                }
                break;

            case ADD_DATE_LIMITATION_ACTION:
                if (ctx.callbackQuery.data === 'yes') {
                    ctx.reply(
                        'Чтобы быстро добавить исполнителя, просто напишите его и отправьте боту', 
                    )
                    ctx.session.status = ADD_EXECUTOR_ACTION
                } else {
                    ctx.reply(
                        'Чтобы быстро добавить срок, просто напишите его и отправьте боту', 
                    )
                }
                break;

            case ADD_EXECUTOR_ACTION:
                if (ctx.callbackQuery.data === 'yes') {
                    ctx.reply(
                        'Чтобы быстро добавить проект, просто напишите его и отправьте боту', 
                    )
                    ctx.session.status = ADD_PROJECT_ACTION
                } else {
                    ctx.reply(
                        'Чтобы быстро добавить исполнителя, просто напишите его и отправьте боту', 
                    )
                }
                break;

            case ADD_PROJECT_ACTION:
                if (ctx.callbackQuery.data === 'yes') {
                    addTask({
                        id: Date.now(),
                        title: ctx.session.taskText,
                        user: ctx.session.user,
                        project: ctx.session.taskProject,
                        executor: ctx.session.taskExecutor,
                        date: ctx.session.taskDateLimitation,
                        taskStatus: OPEN_TASK_STATUS
                    })
                    ctx.editMessageText('Ваша задача успешно добавлена')
                    ctx.session.status = SAVE_TASK_ACTION
                    // ctx.reply(
                    //     'Чтобы быстро добавить проект, просто напишите его и отправьте боту', 
                    // )
                    // ctx.session.status = SAVE_TASK_ACTION
                } else {
                    ctx.reply(
                        'Чтобы быстро добавить проект, просто напишите его и отправьте боту', 
                    )
                }
                break;  
                
            case CLOSE_TASK_ACTION:
                if (ctx.callbackQuery.data === 'yes') {

                    const tasks = await getTasks()
            
                    const myTask = tasks.find(item => +item.id === +ctx.session.closingTaskId)
                    // console.log(myTask)
                    myTask.taskStatus = CLOSE_TASK_STATUS

                    updateTasks(myTask)

                    ctx.reply(
                        'Задача закрыта', 
                    )
                    ctx.session.status = START_SESSION_ACTION
                } else {
                    ctx.reply(
                        'Не будем закрывать задачу', 
                    )
                    ctx.session.status = START_SESSION_ACTION
                }
                break;

            default:
                break;
        }
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