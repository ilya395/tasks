import { pool } from '../services/index.js';

class TasksController {
  async getAllActiveTasks() {
    const tasks = await pool.query(`SELECT * FROM tasks WHERE status_id = $1 OR status_id = $2`, [2, 3]);
    return tasks.rows
  }
  async getTasks() {
    const tasks = await pool.query(`SELECT * FROM tasks`);
    return tasks.rows
  }
  async addTask(data) {
    const { user: user_id, date, project: project_id, taskStatus: status_id, executor, title: description } = data;
    const task = await pool.query(`INSERT INTO tasks (user_id, date, project_id, status_id, executor, description) values ($1, $2, $3, $4, $5, $6) RETURNING *`, [user_id, date, project_id, status_id, executor, description]);
    return task;
  }
  async closeTask(id) {
    const task = await pool.query(`UPDATE tasks SET status_id = $1 WHERE id = $2`, [1, id]);
    return task;
  }
  async getTaskStatuses() {
    const statuses = await pool.query(`SELECT * FROM task_status`);
    return statuses.rows;
  }
}
export const tasksController = new TasksController();