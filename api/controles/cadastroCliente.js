import nodemon from 'nodemon';
import { db } from '../db.js';
import {} from 'dotenv/config';
import { createPool } from 'mysql2';

export const postCliente = (req, res) => {
    const { cnpjCpf } = req.body;
    const { ieRg } = req.body;
    const { nome } = req.body;
    const { cep } = req.body;
    const { rua } = req.body;
    const { numero } = req.body;
    const { bairro } = req.body;
    const { complemento } = req.body;
    const { cidade } = req.body;
    const { uf } = req.body;
    const { telefone } = req.body;
    const { dataNascimento } = req.body;
    const { observacao } = req.body;
    const dataCadastro = new Date()
        .toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');

    const { idFactoring } = req.body;

    const sql =
        'insert into clientes (cnpj_cpf,ie_rg,nome,cep,rua,numero,bairro,complemento,cidade,uf,telefone,data_nascimento,data_cadastro,observacao,idFactoring) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(
        sql,
        [
            cnpjCpf,
            ieRg,
            nome,
            cep,
            rua,
            numero,
            bairro,
            complemento,
            cidade,
            uf,
            telefone,
            dataNascimento,
            dataCadastro,
            observacao,
            idFactoring,
        ],
        (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json('Cliente cadastrado com sucesso!');
        }
    );
};

export const alterarCliente = (req, res) => {
    const { cnpjCpf } = req.body;
    const { ieRg } = req.body;
    const { nome } = req.body;
    const { cep } = req.body;
    const { rua } = req.body;
    const { numero } = req.body;
    const { bairro } = req.body;
    const { complemento } = req.body;
    const { cidade } = req.body;
    const { uf } = req.body;
    const { telefone } = req.body;
    const { dataNascimento } = req.body;
    const { observacao } = req.body;

    const sql =
        'update clientes set ie_rg = ?, nome = ?, cep = ?, rua = ?, numero = ?, bairro = ?, complemento = ?, cidade = ?, uf = ?, telefone = ?, data_nascimento = ?, observacao = ? where cnpj_cpf = ?';
    db.query(
        sql,
        [
            ieRg,
            nome,
            cep,
            rua,
            numero,
            bairro,
            complemento,
            cidade,
            uf,
            telefone,
            dataNascimento,
            observacao,
            cnpjCpf,
        ],
        (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json('Cliente cadastrado com sucesso!');
        }
    );
};

export const buscaClienteCnpjCpf = (req, res) => {
    const { cnpjCpf } = req.body;

    const sql = 'select * from clientes where `cnpj_cpf` = ?';
    db.query(sql, [cnpjCpf], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

export const buscaClienteNome = (req, res) => {
    let { nome } = req.body;
    nome = '%' + nome + '%';

    const sql = 'select * from clientes where `nome` like ? order by `nome`';
    db.query(sql, [nome], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};
