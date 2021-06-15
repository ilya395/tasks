export const START_SESSION_ACTION = "START_SESSION_ACTION"
export const ADD_TASK_ACTION = "ADD_TASK_ACTION"
export const GET_TASKS_ACTION = "GET_TASKS_ACTION"
export const ADD_EXECUTOR_ACTION = "ADD_EXECUTOR_ACTION"
export const ADD_DATE_LIMITATION_ACTION = "ADD_DATE_LIMITATION_ACTION"
export const ADD_PROJECT_ACTION = "ADD_PROJECT_ACTION"
export const CANCEL_TASK_ACTION = "CANCEL_TASK_ACTION"
// export const CONFIRMATION_TASK_ACTION = "CONFIRMATION_TASK_ACTION"
export const SAVE_TASK_ACTION = "SAVE_TASK_ACTION"
export const CLOSE_TASK_ACTION = "CLOSE_TASK_ACTION"

function createStore(reducer, initialState) {
    let state = initialState;
    return {
        getState: () => state,
        dispatch: action => { state = reducer(state, action) }
    }
}

function defaultReducer(state, action) {
    switch (action.type) {
        case START_SESSION_ACTION:
            return {
                status: START_SESSION_ACTION,
            }
        case ADD_TASK_ACTION:
            return {
                status: ADD_TASK_ACTION,
            }
        case GET_TASKS_ACTION:
            return {
                status: GET_TASKS_ACTION,
            }
        case ADD_EXECUTOR_ACTION:
            return {
                status: ADD_EXECUTOR_ACTION,
            }
        case ADD_DATE_LIMITATION_ACTION:
            return {
                status: ADD_DATE_LIMITATION_ACTION,
            }
        case ADD_PROJECT_ACTION:
            return {
                status: ADD_PROJECT_ACTION,
            }            
    
        default:
            return {...state}
    }
}

const initialState = {
    status: START_SESSION_ACTION
}

export const store = createStore(defaultReducer, initialState)