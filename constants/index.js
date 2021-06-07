import dotenv from 'dotenv'
dotenv.config()

export const BOT_TOKEN = process.env.BOT_TOKEN

export const ALL_ACTIVE_TASKS = "Все активные задачи"
export const MY_TASKS = "Мои задачи"
export const ADD_TASKS = "Добавить задачу"

export const CHOOSE_EXECUTOR = "Выбрать исполнителя"
export const CHOOSE_PROJECT = "Выбрать проект"
export const CHOOSE_END_DATE = "Выбрать срок окончания"