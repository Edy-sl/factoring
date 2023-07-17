import express from 'express';
import {} from 'dotenv/config';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import rotaFactory from './rotas/rotas.js';

const SECRET = process.env.SECRET;

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', rotaFactory);

app.listen(8000, () => console.log('servdor rodando!'));
