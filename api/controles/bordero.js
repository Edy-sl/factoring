import { db } from '../db.js';
import {} from 'dotenv/config';

export const gravarBordero = (req, res) => {
    const data = new Date();
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();

    const dataCadastro = ano + '-' + mes + '-' + dia;

    const { idcliente } = req.body;
    const { dataBase } = req.body;
    const { taxaTed } = req.body;
    const { juros } = req.body;
    const { jurosDiario } = req.body;
    const { idFactoring } = req.body;

    const sql =
        'insert into borderos (data, idcliente, data_base, taxa_ted, juros, Juros_diario, idfactoring) values (?,?,?,?,?,?,?)';

    db.query(
        sql,
        [
            dataCadastro,
            idcliente,
            dataBase,
            taxaTed,
            juros,
            jurosDiario,
            idFactoring,
        ],
        (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json(data);
        }
    );
};

export const alterarBordero = (req, res) => {
    const data = new Date();
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();

    const dataCadastro = ano + '-' + mes + '-' + dia;

    const { idcliente } = req.body;
    const { dataBase } = req.body;
    const { taxaTed } = req.body;
    const { juros } = req.body;
    const { jurosDiario } = req.body;
    const { idFactoring } = req.body;
    const { idBordero } = req.body;

    const sql =
        'update borderos set data = ?, idcliente = ?, data_base = ?, taxa_ted = ?, juros = ?, Juros_diario = ?, idfactoring = ? where idbordero = ?';

    db.query(
        sql,
        [
            dataCadastro,
            idcliente,
            dataBase,
            taxaTed,
            juros,
            jurosDiario,
            idFactoring,
            idBordero,
        ],
        (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json('Atualizado!');
        }
    );
};

export const buscaBordero = (req, res) => {
    const { dataI } = req.body;
    const { dataF } = req.body;

    const sql =
        'select * from borderos, clientes where borderos.idcliente = clientes.idcliente and borderos.data between ? and ? order by `idbordero` desc';
    db.query(sql, [dataI, dataF], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

export const buscaBorderoId = (req, res) => {
    const { operacao } = req.body;

    const sql =
        'select * from borderos, clientes where borderos.idcliente = clientes.idcliente and idbordero = ?';
    db.query(sql, [operacao], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};
