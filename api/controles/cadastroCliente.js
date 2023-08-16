import nodemon from 'nodemon';
import { db } from '../db.js';
import {} from 'dotenv/config';

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
    const { taxaJuros } = req.body;
    const { especial } = req.body;

    const data = new Date();
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();

    const dataCadastro = ano + '-' + mes + '-' + dia;

    const { idFactoring } = req.body;

    const sql =
        'insert into clientes ' +
        '(cnpj_cpf, ie_rg, nome, cep, rua, numero, ' +
        'bairro, complemento, cidade, uf, telefone, data_nascimento, ' +
        'data_cadastro, observacao, idFactoring, taxa_juros, especial) ' +
        'values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
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
            taxaJuros,
            especial,
        ],
        (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json('Cliente cadastrado!');
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

    const { taxaJuros } = req.body;
    const { especial } = req.body;

    const sql =
        'update clientes set ie_rg = ?, nome = ?, cep = ?, rua = ?, numero = ?, bairro = ?, complemento = ?, cidade = ?, uf = ?, telefone = ?, data_nascimento = ?, observacao = ?, taxa_juros = ?, especial = ? where cnpj_cpf = ?';
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
            taxaJuros,
            especial,
            cnpjCpf,
        ],
        (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json('Cliente cadastrado!');
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

export const buscaClienteId = (req, res) => {
    const { idCliente } = req.body;

    const sql = 'select * from clientes where `idcliente` = ?';
    db.query(sql, [idCliente], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

//atualiza taxa
export const atualizaTaxaCliente = (req, res) => {
    const { idCliente } = req.body;
    const { taxaJuros } = req.body;
    const { especial } = req.body;

    const sql =
        'update clientes set taxa_juros = ?, especial = ? where idcliente = ?';
    db.query(sql, [taxaJuros, especial, idCliente], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Taxa atualizada!');
    });
};
