import { db } from '../db.js';
import {} from 'dotenv/config';

export const gravarLancamentoConta = (req, res) => {
    const { idCliente } = req.body;
    const { data } = req.body;
    const { documento } = req.body;
    const { numero } = req.body;
    const { valor } = req.body;
    const { tipo } = req.body;

    const sql =
        'insert into lancamento_conta ' +
        '(data, tipo, documento, numero, valor, idcliente) ' +
        'value (?,?,?,?,?,?) ';

    db.query(
        sql,
        [data, tipo, documento, numero, valor, idCliente],
        (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json('Lançamento gravado!');
        }
    );
};

export const listaLancamentoConta = (req, res) => {
    const { dataI } = req.body;
    const { dataF } = req.body;
    const { idCliente } = req.body;
    const { tipo } = req.body;

    if (tipo != 'movimento') {
        const sql =
            'select * from lancamento_conta where data between ? and ? and tipo = ? and idcliente = ? ' +
            'order by data, idlancamento desc';

        db.query(sql, [dataI, dataF, tipo, idCliente], (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json(data);
        });
    } else {
        const sql =
            'select * from lancamento_conta where data between ? and ? and idcliente = ? ' +
            'order by data, idlancamento desc';

        db.query(sql, [dataI, dataF, idCliente], (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json(data);
        });
    }
};

export const somaMovimentoConta = (req, res) => {
    const { dataI } = req.body;
    const { dataF } = req.body;
    const { idCliente } = req.body;
    const { tipo } = req.body;

    const sql =
        'select sum(soma.valorSaida) as saida, ' +
        'sum(soma.valorEntrada) as entrada ' +
        'from(select lancamento_conta.idcliente, lancamento_conta.tipo,  ' +
        'case when tipo = "entrada" then sum(valor) ' +
        'end as valorEntrada, ' +
        'case when tipo="saida" then sum(valor) ' +
        'end as valorSaida ' +
        'from lancamento_conta ' +
        'where data between ? and ? ' +
        'and idcliente = ? ' +
        'group by tipo )as soma ';

    db.query(sql, [dataI, dataF, idCliente], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

export const alterarLancamentoConta = (req, res) => {
    const { idLancamento } = req.body;
    const { data } = req.body;
    const { documento } = req.body;
    const { numero } = req.body;
    const { valor } = req.body;

    const sql =
        'update lancamento_conta set data = ?, ' +
        'documento = ?, numero = ?, valor = ? ' +
        'where idlancamento = ? ';

    db.query(
        sql,
        [data, documento, numero, valor, idLancamento],
        (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json('Lançamento Alterado!');
        }
    );
};

export const excluirLancamentoConta = (req, res) => {
    const { idLancamento } = req.body;

    const sql = 'delete from lancamento_conta where idlancamento = ? ';

    db.query(sql, [idLancamento], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Lançamento Excluido!');
    });
};
