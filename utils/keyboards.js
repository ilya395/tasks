import { Markup } from 'telegraf'
import { ADD_TASK, ALL_ACTIVE_TASKS, CHOOSE_END_DATE, CHOOSE_EXECUTOR, CHOOSE_PROJECT, MY_TASKS } from '../constants/index.js'
// const Markup = require('telegraf/markup.js')

export function getMainMenu() {
    return Markup.keyboard([ // строки кнопок
        // [ALL_ACTIVE_TASKS],
        [MY_TASKS, ADD_TASK],
    ])
        .resize() // размерность кнопок
        // .extra() // отобразить клаву
}

export function yesNoKeyboard() {
    return Markup.inlineKeyboard([
        Markup.button.callback('Да', 'yes'),
        Markup.button.callback('Нет', 'no')
    ], {columns: 2});
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