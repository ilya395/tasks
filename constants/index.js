import dotenv from 'dotenv'
dotenv.config()

export const BOT_TOKEN = process.env.BOT_TOKEN

export const ALL_ACTIVE_TASKS = "Все активные задачи"
export const MY_TASKS = "Мои задачи"
export const ADD_TASK = "Добавить задачу"
export const CLOSE_TASK = "Закрыть задачу"

export const CHOOSE_EXECUTOR = "Выбрать исполнителя"
export const CHOOSE_PROJECT = "Выбрать проект"
export const CHOOSE_END_DATE = "Выбрать срок окончания"

export const OPEN_TASK_STATUS = "Открыто"
export const CLOSE_TASK_STATUS = "Закрыто"

export const BD_USER = process.env.BD_USER
export const BD_PASSWORD = process.env.BD_PASSWORD
export const BD_HOST = process.env.BD_HOST
export const BD_PORT = process.env.BD_PORT
export const BD_NAME = process.env.BD_NAM