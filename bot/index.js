// require('dotenv').config();
import { BOT_TOKEN } from '../constants/index.js';

// const { Telegraf } = require('telegraf')
import { Telegraf } from 'telegraf'
export const Bot = new Telegraf(BOT_TOKEN) //сюда помещается токен, который дал botFather

// module.exports = { Bot }