import e, { json } from 'express';
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

    const { juros } = req.body;
    const { jurosDiario } = req.body;
    const { idFactoring } = req.body;
    const { arrayCheques } = req.body;
    const { arrayDeducao } = req.body;
    const { observacao_operacao } = req.body;

    const sql =
        'insert into borderos (data, idcliente, data_base, juros, Juros_diario, idfactoring, observacao_operacao) values (?,?,?,?,?,?,?)';

    db.query(
        sql,
        [
            dataCadastro,
            idcliente,
            dataBase,
            juros,
            jurosDiario,
            idFactoring,
            observacao_operacao,
        ],
        (err, data) => {
            if (err) return res.json(err);
            gravarCheques(data.insertId, arrayCheques);

            gravarDeducao(data.insertId, arrayDeducao, dataCadastro);

            return res.status(200).json({
                insertId: data.insertId,
                msg: 'Operação gravada!',
            });
        }
    );
};

const gravarDeducao = (idBordero, arrayDeducao, dataDeducao) => {
    const sql =
        `update borderos_lancamentos set idbordero_deducao = ? , ` +
        `data_deducao = ?, status='PAGO', ` +
        `data_pagamento = ?, ` +
        `juros_devolucao = ? where idlancamento = ?`;
    if (arrayDeducao.length > 0) {
        arrayDeducao.map((deducao) => {
            db.query(
                sql,
                [
                    idBordero,
                    dataDeducao,
                    dataDeducao,
                    deducao.juros_devolucao,
                    deducao.idlancamento,
                ],
                (err, data) => {}
            );
        });
    }
};

export const alterarBordero = (req, res) => {
    const { dataCadastro } = req.body;
    const { idcliente } = req.body;
    const { dataBase } = req.body;
    const { juros } = req.body;
    const { jurosDiario } = req.body;
    const { idFactoring } = req.body;
    const { arrayCheques } = req.body;
    const { idBordero } = req.body;
    const { observacao_operacao } = req.body;

    const { arrayDeducao } = req.body;

    const sql =
        'update borderos set data = ?, idcliente = ?, data_base = ?, juros = ?, Juros_diario = ?, idfactoring = ?, observacao_operacao = ? where idbordero = ?';

    db.query(
        sql,
        [
            dataCadastro,
            idcliente,
            dataBase,
            juros,
            jurosDiario,
            idFactoring,
            observacao_operacao,
            idBordero,
        ],
        (err, data) => {
            if (err) return res.json(err);
            gravarCheques(idBordero, arrayCheques);
            gravarDeducao(idBordero, arrayDeducao, dataCadastro);
            return res.status(200).json('Operação atualizada!');
        }
    );
};

export const gravarCheques = (idBordero, arrayCheques) => {
    let sql = '';

    arrayCheques.map((item, index) => {
        if (item.idlancamento > 0) {
            sql =
                'update borderos_lancamentos set numero_banco = ?, ' +
                'nome_banco = ?, numero_cheque = ?, ' +
                'nome_cheque = ?, data_vencimento = ?, ' +
                'valor_cheque = ? , dias = ?, ' +
                'taxa_ted = ?, ' +
                'valor_juros = ?, valor_liquido = ?, ' +
                'status = ? ' +
                'where idlancamento = ? ';
            db.query(
                sql,
                [
                    item.numero_banco,
                    item.nome_banco,
                    item.numero_cheque,
                    item.nome_cheque,
                    item.data_vencimento,
                    item.valor_cheque,
                    item.dias,
                    item.taxa_ted,
                    item.valor_juros,
                    item.valor_liquido,
                    item.status,
                    item.idlancamento,
                ],
                (err, data) => {}
            );
        } else if (item.idlancamento < 1) {
            sql =
                'insert into borderos_lancamentos ' +
                '(numero_banco, nome_banco, numero_cheque, ' +
                'nome_cheque, data_vencimento, valor_cheque, ' +
                'dias, taxa_ted, valor_juros, valor_liquido, status, idbordero) ' +
                'values (?,?,?,?,?,?,?,?,?,?,?,?)';

            db.query(
                sql,
                [
                    item.numero_banco,
                    item.nome_banco,
                    item.numero_cheque,
                    item.nome_cheque,
                    item.data_vencimento,
                    item.valor_cheque,
                    item.dias,
                    item.taxa_ted,
                    item.valor_juros,
                    item.valor_liquido,
                    item.status,
                    idBordero,
                ],
                (err, data) => {}
            );
        }
    });
};

export const excluirOperacaoCheques = (req, res) => {
    const { idOperacao } = req.body;

    const sql1 = 'delete from borderos_lancamentos where idbordero = ? ';

    db.query(sql1, [idOperacao], (err, data) => {
        if (err) return res.json(err);
    });

    const sql2 = 'delete from borderos  where idbordero = ? ';
    db.query(sql2, [idOperacao], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Operacão excluída!');
    });
};

export const exluirCheque = (req, res) => {
    const { idlancamento } = req.body;

    const sql = 'delete from borderos_lancamentos where idlancamento = ?';

    db.query(sql, [idlancamento], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Cheque excluido!');
    });
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

export const listarCheques = (req, res) => {
    const { operacao } = req.body;

    const sql = 'select * from borderos_lancamentos where `idbordero` = ?';
    db.query(sql, [operacao], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

/////relatorios de cheque por data de vencimento
export const relatorioPorVencimento = (req, res) => {
    const { dataI } = req.body;
    const { dataF } = req.body;
    const { status } = req.body;

    let sql = '';
    if (status === 'GERAL') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? order by cheques.data_vencimento`;
    }
    if (status === 'DEVOLVIDO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? and status = 'DEVOLVIDO' order by cheques.data_vencimento`;
    }
    if (status === 'PAGO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? and status = 'PAGO' order by cheques.data_vencimento`;
    }

    db.query(sql, [dataI, dataF], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

/////relatorio por data da emissao da operação
export const relatorioPorEmissao = (req, res) => {
    const { dataI } = req.body;
    const { dataF } = req.body;
    const { status } = req.body;

    let sql = '';
    if (status === 'GERAL') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where operacao.data between  ? and ? order by cheques.data_vencimento`;
    }
    if (status === 'DEVOLVIDO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where operacao.data between  ? and ? and cheques.status = 'DEVOLVIDO' order by cheques.data_vencimento`;
    }
    if (status === 'PAGO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where operacao.data between  ? and ? and cheques.status = 'PAGO' order by cheques.data_vencimento`;
    }

    db.query(sql, [dataI, dataF], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

/////relatorios de cheque por cliente e data de vencimento
export const relatorioPorClienteVencimento = (req, res) => {
    const { dataI } = req.body;
    const { dataF } = req.body;
    const { status } = req.body;
    const { idCliente } = req.body;

    let sql = '';

    if (status === 'GERAL') {
        sql =
            'SELECT * FROM dbfactoring.borderos_lancamentos ' +
            'as cheques inner join dbfactoring.borderos as operacao ' +
            'on cheques.idbordero = operacao.idbordero ' +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            'where cheques.data_vencimento between  ? and ? and ' +
            'operacao.idcliente = ? order by cheques.data_vencimento';
    }
    if (status === 'DEVOLVIDO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? and ` +
            `operacao.idcliente = ? and ` +
            `cheques.status = 'DEVOLVIDO' order by cheques.data_vencimento`;
    }
    if (status === 'PAGO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? and ` +
            `operacao.idcliente = ? and ` +
            `cheques.status = 'PAGO' order by cheques.data_vencimento`;
    }

    db.query(sql, [dataI, dataF, idCliente], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};

/////relatorios de cheque por cliente e data de emissao da op.
export const relatorioPorClienteEmissao = (req, res) => {
    const { dataI } = req.body;
    const { dataF } = req.body;
    const { status } = req.body;
    const { idCliente } = req.body;

    let sql = '';

    if (status === 'GERAL') {
        sql =
            'SELECT * FROM dbfactoring.borderos_lancamentos ' +
            'as cheques inner join dbfactoring.borderos as operacao ' +
            'on cheques.idbordero = operacao.idbordero ' +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            'where operacao.data between  ? and ? and ' +
            'operacao.idcliente = ? order by cheques.data_vencimento';
    }
    if (status === 'DEVOLVIDO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where operacao.data between  ? and ? and ` +
            `operacao.idcliente = ? and ` +
            `cheques.status = 'DEVOLVIDO' order by cheques.data_vencimento`;
    }
    if (status === 'PAGO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where operacao.data between  ? and ? and ` +
            `operacao.idcliente = ? and ` +
            `cheques.status = 'PAGO' order by cheques.data_vencimento`;
    }

    db.query(sql, [dataI, dataF, idCliente], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};

export const buscaChequeNumero = (req, res) => {
    const { numero } = req.body;
    const sql =
        `SELECT * FROM borderos_lancamentos as ch inner join ` +
        `borderos as op on ` +
        `ch.idbordero = op.idbordero ` +
        `inner join clientes as cli ` +
        `on cli.idcliente = op.idcliente ` +
        `where numero_cheque = ? ` +
        `order by numero_cheque `;
    db.query(sql, [numero], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

export const gravarDataDevolucao = (req, res) => {
    const { idlancamento } = req.body;
    const { dataDev } = req.body;
    const sql =
        `update borderos_lancamentos set data_devolucao = ? ,` +
        `status = 'DEVOLVIDO' ` +
        `where idlancamento = ? `;
    db.query(sql, [dataDev, idlancamento], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Devolução gravada!');
    });
};

export const gravarDataPagamento = (req, res) => {
    const { idlancamento } = req.body;
    const { dataPag } = req.body;
    const sql =
        `update borderos_lancamentos set data_pagamento = ? ,` +
        `status = 'PAGO' ` +
        `where idlancamento = ? `;
    db.query(sql, [dataPag, idlancamento], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Pagamento gravado!');
    });
};

export const listaChequesDevolvidos = (req, res) => {
    const { idCliente } = req.body;
    const sql =
        `SELECT * FROM borderos_lancamentos as ch inner join ` +
        `borderos as op on ` +
        `ch.idbordero = op.idbordero ` +
        `inner join clientes as cli ` +
        `on cli.idcliente = op.idcliente ` +
        `where cli.idcliente = ? and data_devolucao > "" ` +
        `and idbordero_deducao is null or idbordero_deducao < '1' ` +
        `order by numero_cheque `;

    db.query(sql, [idCliente], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

export const listaChequesDeduzidos = (req, res) => {
    const { idBordero } = req.body;

    const sql =
        `SELECT * FROM borderos_lancamentos as ch inner join ` +
        `borderos as op on ` +
        `ch.idbordero = op.idbordero ` +
        `inner join clientes as cli ` +
        `on cli.idcliente = op.idcliente ` +
        `where ` +
        `idbordero_deducao = ? ` +
        `order by numero_cheque `;

    db.query(sql, [idBordero], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};

//busca emitentes
export const listaEmitentes = (req, res) => {
    let { emitente } = req.body;
    emitente = '%' + emitente + '%';

    const sql =
        'SELECT nome_cheque FROM borderos_lancamentos ' +
        'where nome_cheque like ? ' +
        'group by nome_cheque order by nome_cheque';
    db.query(sql, [emitente], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

/////relatorios de cheque por EMITENTE e data de vencimento
export const relatorioChequePorEmitenteVencimento = (req, res) => {
    const { dataI } = req.body;
    const { dataF } = req.body;
    const { status } = req.body;
    let { emitente } = req.body;
    let nomeEmitente = `'xxxxxxxxxxxxxxxxxxxxxxx',`;

    if (emitente.length > 0) {
        emitente.map((E, index) => {
            nomeEmitente = nomeEmitente + `'` + E.emitente + `'`;
            if (index + 1 < emitente.length) {
                nomeEmitente = nomeEmitente + ',';
            }
        });
    }

    let sql = '';

    if (status === 'GERAL') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? ` +
            `and cheques.nome_cheque in (` +
            nomeEmitente +
            `) ` +
            `order by cheques.data_vencimento`;
    }
    if (status === 'DEVOLVIDO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? ` +
            `and cheques.nome_cheque  in (` +
            nomeEmitente +
            `)  ` +
            `cheques.status = 'DEVOLVIDO' order by cheques.data_vencimento`;
    }
    if (status === 'PAGO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? ` +
            `and cheques.nome_cheque  in (` +
            nomeEmitente +
            `)  ` +
            `cheques.status = 'PAGO' order by cheques.data_vencimento`;
    }

    db.query(sql, [dataI, dataF, nomeEmitente], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
        //return res.status(200).json(data);
    });
};

export const buscaEmitentes = (req, res) => {
    const sql =
        'SELECT nome_cheque FROM borderos_lancamentos group by nome_cheque order by nome_cheque';

    db.query(sql, [], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};
