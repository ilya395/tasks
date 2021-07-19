import { CLOSE_TASK_STATUS, OPEN_TASK_STATUS } from "../constants/index.js"

import pge from "pg";
const Pool = pge.Pool;
export const pool = new Pool({
  user: "postgres",
  password: "root_root",
  host: "localhost",
  port: 5432,
  database: "tasks_bd"
});

export let taskList = [
    {title: 'wwww', taskStatus: OPEN_TASK_STATUS, user: {id: 15}, id: 87},
    {title: 'eeee', taskStatus: CLOSE_TASK_STATUS, user: {id: 15}, id: 88},
    {title: 'qqqq', taskStatus: OPEN_TASK_STATUS, user: {id: 15}, id: 89},
    {title: 'zzzz', taskStatus: OPEN_TASK_STATUS, user: {id: 425998872}, id: 90},
]

export function addTask(object) {
    taskList.push({...object})
}

export function getTasks() {
    return new Promise(resolve => {
        setTimeout(() => {
            // const tasks = taskList.filter(item => item.taskStatus === OPEN_TASK_STATUS)
            resolve(taskList)
        }, 500)
    })
}

export function updateTasks(object) {
    taskList = [
        ...taskList,
        object
    ];
}