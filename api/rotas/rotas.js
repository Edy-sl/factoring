import express from 'express';
import jwt from 'jsonwebtoken';
import { loginFactoring } from '../controles/login.js';
import { postCadUsuario } from '../controles/cadastroUsuario.js';
import { recuperaSenha } from '../controles/recuperaSenha.js';
import { postFactoring } from '../controles/cadastroEmpresa.js';
import { postSelecionaFactoring } from '../controles/cadastroEmpresa.js';
import { putAtualizaFactoring } from '../controles/cadastroEmpresa.js';
import { getPermissoes } from '../controles/permissoes.js';

import { rotaTeste } from '../controles/teste.js';
import {
    alterarCliente,
    buscaClienteCnpjCpf,
    buscaClienteNome,
    postCliente,
} from '../controles/cadastroCliente.js';

const SECRET = process.env.SECRET;

const rotaFactoring = express.Router();

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end();
        req.userID = decoded.userID;
        next();
    });
}

function verificaPermissao(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end();
        if (decoded.grupo !== 'admin')
            return res.status(200).json('bloqueado').end();
        next();
    });
}

rotaFactoring.post('/cad-usuario', postCadUsuario);

rotaFactoring.post('/login', loginFactoring);

rotaFactoring.get('/recupera-senha', recuperaSenha);

rotaFactoring.post(
    '/cad-factoring',
    verifyJWT,
    verificaPermissao,
    postFactoring
);
rotaFactoring.post('/seleciona-factoring', verifyJWT, postSelecionaFactoring);

rotaFactoring.put(
    '/atualizar-factoring',
    verifyJWT,
    verificaPermissao,
    putAtualizaFactoring
);

rotaFactoring.post('/cad-cliente', verifyJWT, postCliente);
rotaFactoring.post('/alterar-cliente', verifyJWT, alterarCliente);
rotaFactoring.post('/busca-cliente', verifyJWT, buscaClienteCnpjCpf);
rotaFactoring.post('/busca-cliente-nome', verifyJWT, buscaClienteNome);

rotaFactoring.get('/teste', rotaTeste);

rotaFactoring.get('/permissoes', verifyJWT, getPermissoes);

export default rotaFactoring;
