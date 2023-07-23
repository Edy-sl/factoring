import { db } from '../db.js';
import {} from 'dotenv/config';

export const gravarLancamento = (req, res) => {
    const { dataVencimento } = req.body;
    const { numeroBanco } = req.body;
    const { nomeBanco } = req.body;

    const { numeroCheque } = req.body;
    const { nomeCheque } = req.body;
    const { valorCheque } = req.body;
    const { dias } = req.body;
    const { valorJuros } = req.body;
    const { valorLiquido } = req.body;
    const { idBordero } = req.body;

    const sql =
        'insert into borderos_lancamentos (numero_banco,nome_banco,numero_cheque,nome_cheque,data_vencimento,valor_cheque,dias,valor_juros,valor_liquido,idbordero) values (?,?,?,?,?,?,?,?,?,?)';
    db.query(
        sql,
        [
            numeroBanco,
            nomeBanco,
            numeroCheque,
            nomeCheque,
            dataVencimento,
            valorCheque,
            dias,
            valorJuros,
            valorLiquido,
            idBordero,
        ],
        (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json('Lançamento incluido!');
        }
    );
};

export const listarLancamento = (req, res) => {
    const { operacao } = req.body;
    console.log(operacao);
    const sql = 'select * from borderos_lancamentos where `idbordero` = ?';
    db.query(sql, [operacao], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};
