// require('dotenv').config();
import { BOT_TOKEN } from '../constants/index.js';

// const { Telegraf } = require('telegraf')
import { Telegraf } from 'telegraf';
import session from '@telegraf/session';
export const Bot = new Telegraf(BOT_TOKEN); //сюда помещается токен, который дал botFather

// module.exports = { Bot }

import { ALL_ACTIVE_TASKS, MY_TASKS, ADD_TASK, CHOOSE_PROJECT, CLOSE_TASK } from '../constants/index.js'
import { getMainMenu, projectKeybord, yesNoKeyboard } from '../utils/keyboards.js'
import { ADD_CHOOSED_PROJECT_ACTION, ADD_DATE_LIMITATION_ACTION, ADD_EXECUTOR_ACTION, ADD_PROJECT_ACTION, ADD_TASK_ACTION, CLOSE_TASK_ACTION, SAVE_TASK_ACTION, START_SESSION_ACTION } from '../store/index.js'
import { projectController, tasksController, userController } from '../controllers/index.js';

export const BotModule = () => {

  Bot.use(session())

  Bot.start(async (ctx) => {

      ctx.session.status = START_SESSION_ACTION

      ctx.session.user = {
          telegram_id: ctx.update.message.from.id,
          username: ctx.update.message.from.username,
          firstName: ctx.update.message.from.first_name,
          lastName: ctx.update.message.from.last_name
      }
      const user = await userController.checkUser(ctx.update.message.from.id);

      if (user.length > 0) {
        ctx.session.user.id = user[0].id;
        ctx.replyWithHTML(`Привет, ${user[0].name || 'тот у кого пока нет имени'}!\n Чего желаете? \n\n`, getMainMenu())
      } else {
        const addedUser = await userController.addUser({
          telegram_id: ctx.update.message.from.id,
          name: ctx.update.message.from.first_name,
        })
        const saveInSession = () => {
          ctx.session.user.id = addedUser[0].id
        }
        await saveInSession();
        ctx.replyWithHTML('Здорова, боярин!\n Чего желаете? \n\n', getMainMenu())
      }
  }) //ответ бота на команду /start

  Bot.hears(MY_TASKS, async ctx => {
      let result = ''

      const myTasks = await tasksController.getTasks();
      const statuses = await tasksController.getTaskStatuses();

      if (myTasks.length) {
          myTasks.forEach((item) => {
              result += `[${item.id}] ${item.description || 'Не задано'}\n
              Исполнитель: ${item.executor || 'Не задано'}\n
              Срок: ${item.date || 'Не задано'}\n
              Проект: ${item.project || 'Не задано'}\n
              Статус: ${statuses.find(elem => +elem.id === item.status_id).name_ru}\n
              ------------------------------\n\n`
          });
          ctx.replyWithHTML(`<b>Список ваших задач:</b>\n\n${result}`)
      } else {
          ctx.replyWithHTML(`<b>Нет задач</b>\n`)
      }
  })

  Bot.hears(ALL_ACTIVE_TASKS, async ctx => {
      let result = ''

      const activeTasks = await tasksController.getAllActiveTasks();
      const statuses = await tasksController.getTaskStatuses();

      if (activeTasks.length > 0) {
          activeTasks.forEach((item) => {
              result += `
              [${item.id}] ${item.description || 'Не задано'}\n
              Исполнитель: ${item.executor || 'Не задано'}\n
              Срок: ${item.date || 'Не задано'}\n
              Проект: ${item.project || 'Не задано'}\n
              Статус: ${statuses.find(elem => +elem.id === item.status_id).name_ru}\n
              ------------------------------ \n\n`
          });

          ctx.replyWithHTML(`<b>Список активных задач:</b>\n\n${result}`)
      } else {
          ctx.replyWithHTML(`<b>Нет активных задач</b>\n`)
      }

  })

  Bot.hears(CLOSE_TASK, async ctx => {
      let result = ''

      const myTasks = await tasksController.getAllActiveTasks();

      if (myTasks.length > 0) {
          myTasks.forEach(item => {
              result += `[${item.id}] ${item.description || 'Не задано'}\n
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
      ctx.reply(
          'Чтобы быстро добавить задачу, просто напишите ее и отправьте боту',
      )
  })

  Bot.on('text', ctx => {

      const status = ctx.session.status

      switch (status) {
          case ADD_TASK_ACTION:
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
              ctx.session.taskProjectId = Date().now();

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
              const projects = await projectController.getProjects();
              if (projects.length > 0) {
                const data = await projectKeybord();
                await ctx.reply('Выбери проект: \n', data);
                ctx.session.status = ADD_CHOOSED_PROJECT_ACTION
              } else {
                ctx.reply(
                  'Чтобы быстро добавить проект, просто напишите его и отправьте боту',
                )
                ctx.session.status = ADD_PROJECT_ACTION
              }
            } else {
                ctx.reply(
                    'Чтобы быстро добавить исполнителя, просто напишите его и отправьте боту',
                )
            }
            break;

        case ADD_PROJECT_ACTION:
          if (ctx.callbackQuery.data === 'yes') {
            const data = {
              title: ctx.session.taskText,
              user: ctx.session.user.id,
              project: ctx.session.taskProjectId,
              executor: ctx.session.taskExecutor,
              date: ctx.session.taskDateLimitation,
              taskStatus: 2, // OPEN_TASK_STATUS
            }
            const res = tasksController.addTask({
              ...data,
            })
            ctx.editMessageText('Ваша задача успешно добавлена')
            ctx.session.status = SAVE_TASK_ACTION
          } else {
            ctx.reply(
              'Чтобы быстро добавить проект, просто напишите его и отправьте боту',
            )
          }
          break;

        case ADD_CHOOSED_PROJECT_ACTION:
            if (ctx.callbackQuery.data === 'yes') {
                const data = {
                    title: ctx.session.taskText,
                    user: ctx.session.user.id,
                    project: ctx.session.taskProjectId,
                    executor: ctx.session.taskExecutor,
                    date: ctx.session.taskDateLimitation,
                    taskStatus: 2, // OPEN_TASK_STATUS
                }

                const res = tasksController.addTask({
                  ...data,
                })

                ctx.editMessageText('Ваша задача успешно добавлена')
                ctx.session.status = SAVE_TASK_ACTION
            } else {
                ctx.reply(
                    'Чтобы быстро добавить проект, просто выбирите его',
                )
            }
            break;

        case CLOSE_TASK_ACTION:
            if (ctx.callbackQuery.data === 'yes') {

                tasksController.closeTask(+ctx.session.closingTaskId)

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

  Bot.action(async () => {
    const projects = await projectController.getProjects();
    return projects.map(item => `project/${item.id}`)
  }, async ctx => {
    const status = ctx.session.status;

    switch (status) {
      case ADD_CHOOSED_PROJECT_ACTION:
        const string = ctx.callbackQuery.data;
        const subStringArray = string.split('/');
        ctx.session.taskProjectId = +subStringArray[1];

        const projects = await projectController.getProjects()
        ctx.session.taskProject = projects.find(item => +item.id === +ctx.session.taskProjectId).name;

        ctx.replyWithHTML(
            `Вы действительно хотите добавить к задаче проект:\n\n`+
            `<i>${ctx.session.taskProject}</i>`,
            yesNoKeyboard()
        )
        break;

      default:
        ctx.reply(`Что это за проект?`)
        break;
    }
  });

  Bot.hears(CHOOSE_PROJECT, ctx => {
      ctx.reply('Выбери проект: \n', projectKeybord())
  })

  // Bot.help((ctx) => ctx.reply('Send me a sticker')) //ответ бота на команду /help
  // Bot.on('sticker', (ctx) => ctx.reply('')) //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер, можно использовать обработчик текста или голосового сообщения
  // Bot.hears('hi', (ctx) => ctx.reply('Hey there')) // bot.hears это обработчик конкретного текста, данном случае это - "hi"

  Bot.launch() // запуск бота
}

// module.exports = { BotModule }