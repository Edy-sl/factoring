import { db } from '../db.js';
import {} from 'dotenv/config';
import jwt from 'jsonwebtoken';
const SECRET = process.env.SECRET;

export const rotaTeste = (req, res) => {
    return res.status(200).json('rota teste');
};
