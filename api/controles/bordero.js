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
    const { arrayCheques } = req.body;

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
            gravarCheques(data.insertId, arrayCheques);

            return res.status(200).json({
                insertId: data.insertId,
                msg: 'Operação gravada!',
            });
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
    const { arrayCheques } = req.body;
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
            gravarCheques(idBordero, arrayCheques);
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
    if (status === 'RECEBIDO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? and status = 'RECEBIDO' order by cheques.data_vencimento`;
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
    if (status === 'RECEBIDO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where operacao.data between  ? and ? and cheques.status = 'RECEBIDO' order by cheques.data_vencimento`;
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
    if (status === 'RECEBIDO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? and ` +
            `operacao.idcliente = ? and ` +
            `cheques.status = 'RECEBIDO' order by cheques.data_vencimento`;
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
    if (status === 'RECEBIDO') {
        sql =
            `SELECT * FROM dbfactoring.borderos_lancamentos ` +
            `as cheques inner join dbfactoring.borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where operacao.data between  ? and ? and ` +
            `operacao.idcliente = ? and ` +
            `cheques.status = 'RECEBIDO' order by cheques.data_vencimento`;
    }

    db.query(sql, [dataI, dataF, idCliente], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};
