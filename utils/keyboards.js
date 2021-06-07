import { Markup } from 'telegraf'
import { ALL_ACTIVE_TASKS, MY_TASKS } from '../constants/index.js'
// const Markup = require('telegraf/markup.js')

export function getMainMenu() {
    return Markup.keyboard([ // строки кнопок
        [ALL_ACTIVE_TASKS],
        [MY_TASKS, ADD_TASKS],
    ])
        .resize() // размерность кнопок
        // .extra() // отобразить клаву
}

// export function getTaskMenu() {
//     return Markup.keyboard([

//     ])
// }