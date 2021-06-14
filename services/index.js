export let taskList = [{title: 'wwww'}, {title: 'eeee'}]

export function addTask(object) {
    taskList.push({...object})
}

export function getTasks() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(taskList)
        }, 500)
    })
}