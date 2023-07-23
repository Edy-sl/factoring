import { db } from '../db.js';
import {} from 'dotenv/config';

export const gravarEmprestimo = (req, res) => {
    const { dataCadastro } = req.body;
    const { idCliente } = req.body;
    const { cnpjCpfCredor } = req.body;
    const { nomeCredor } = req.body;

    const { jurosMensal } = req.body;
    const { valorEmprestimo } = req.body;
    const { quatidadeParcelas } = req.body;
    const { dataBase } = req.body;
    const { intervalo } = req.body;
    const { valorParcela } = req.body;
    const { valorJuros } = req.body;
    const { valorTotal } = req.body;
    const { idFactoring } = req.body;
    const { arrayParcelas } = req.body;

    const sql =
        'insert into emprestimos (data_cadastro,juros_mensal,idcliente,cnpj_cpf_credor,nome_credor,valor_emprestimo,quantidade_parcelas,data_base,intervalo,valor_parcela,valor_juros,valor_total,idfactoring) values (?,?,?,?,?,?,?,?,?,?,?,?,?)';

    db.query(
        sql,
        [
            dataCadastro,
            jurosMensal,
            idCliente,
            cnpjCpfCredor,
            nomeCredor,
            valorEmprestimo,
            quatidadeParcelas,
            dataBase,
            intervalo,
            valorParcela,
            valorJuros,
            valorTotal,
            idFactoring,
        ],
        (err, data) => {
            if (err) return res.json(err);
            gravarParcelas(data.insertId, arrayParcelas);

            return res.status(200).json({
                insertId: data.insertId,
                msg: 'Emprestimo gravado com sucesso!',
            });
        }
    );
};

export const gravarParcelas = (idemprestimo, arrayParcelas) => {
    arrayParcelas.map((item) => {
        const sql2 =
            'insert into parcelas_emprestimo (parcela,vencimento,valor,idemprestimo) value (?,?,?,?)';
        db.query(
            sql2,
            [item.p, item.data_vencimento, item.valorPrestacao, idemprestimo],
            (err, data) => {}
        );
    });
};

export const buscaEmprestimo = (req, res) => {
    const { dataI } = req.body;
    const { dataF } = req.body;

    const sql =
        'select emprestimos.idemprestimo,emprestimos.data_cadastro, clientes.idcliente, clientes.nome from emprestimos, clientes  where emprestimos.idcliente = clientes.idcliente and emprestimos.data_cadastro between ? and ? order by `idemprestimo` desc';
    db.query(sql, [dataI, dataF], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

export const buscaEmprestimoId = (req, res) => {
    const { emprestimo } = req.body;

    const sql =
        'select emprestimos.idemprestimo, emprestimos.data_cadastro,emprestimos.idcliente,emprestimos.nome_credor,emprestimos.cnpj_cpf_credor,emprestimos.data_base,emprestimos.juros_mensal,emprestimos.valor_emprestimo,emprestimos.quantidade_parcelas,emprestimos.intervalo,emprestimos.valor_parcela,emprestimos.valor_total,emprestimos.valor_juros, clientes.idcliente, clientes.nome from emprestimos, clientes  where emprestimos.idcliente = clientes.idcliente and emprestimos.idemprestimo = ?';
    db.query(sql, [emprestimo], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

export const buscaParcelasIdEmprestimo = (req, res) => {
    const { idEmprestimo } = req.body;
    const sql = 'select * from parcelas_emprestimo where idemprestimo = ?';
    db.query(sql, [idEmprestimo], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};
