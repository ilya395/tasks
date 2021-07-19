import { pool } from '../services/index.js';

class ProjectController {
  async getProjects() {
    const projects = await pool.query(`SELECT * FROM projects`);
    return projects.rows;
  }
}

export const projectController = new ProjectController();