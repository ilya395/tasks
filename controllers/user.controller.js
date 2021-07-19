import { pool } from '../services/index.js';

class UserController {
  async checkUser(id) {
    const check = await pool.query(`SELECT * FROM users WHERE telegram_id = $1`, [id]);
    // return check.find(item => +item.id === +id)
    return check.rows;
  }
  async addUser(data) {
    const { telegram_id, name } = data;
    const status_id = 2;
    const user = await pool.query(`INSERT INTO users (telegram_id, status_id, name) values ($1, $2, $3) RETURNING *`, [telegram_id, status_id, name]);
    return user.rows;
  }
}

export const userController = new UserController();