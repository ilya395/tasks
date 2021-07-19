import { Markup } from 'telegraf'
import { ADD_TASK, ALL_ACTIVE_TASKS, CHOOSE_END_DATE, CHOOSE_EXECUTOR, CHOOSE_PROJECT, CLOSE_TASK, MY_TASKS } from '../constants/index.js'
import { projectController } from '../controllers/project.controller.js';
// const Markup = require('telegraf/markup.js')

export function getMainMenu() {
    return Markup.keyboard([ // строки кнопок
        // [ALL_ACTIVE_TASKS],
        [MY_TASKS, ADD_TASK],
        [ALL_ACTIVE_TASKS, CLOSE_TASK],
    ])
        .resize() // размерность кнопок
        // .extra() // отобразить клаву
}

export function yesNoKeyboard() {
    const array = [
        Markup.button.callback('Да', 'yes'),
        Markup.button.callback('Нет', 'no')
    ]
    return Markup.inlineKeyboard(array, {columns: 2});
}

export function getTaskMenu() {
    return Markup.keyboard([
        [CHOOSE_PROJECT],
        [CHOOSE_EXECUTOR],
        [CHOOSE_END_DATE]
    ])
}

export function getProjects() {
    return Markup.keyboard([
        ['НС', 'БА'],
        ['СК', 'ТН'],
        ['Назад'],

    ])
}

export async function projectKeybord() {
  const projects = await projectController.getProjects();
  // const array = await projects.map(item => {
  //   return Markup.button.callback(item.name, String(item.id))
  // })
  return Markup.inlineKeyboard(projects.map(item => {
    return Markup.button.callback(item.name, `project/${item.id}`)
  }), {columns: 2});
}