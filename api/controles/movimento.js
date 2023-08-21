import { db } from '../db.js';
import {} from 'dotenv/config';

////movimento remprestimo por data de vencimento
export const movimentoEmprestimoVencimento = (req, res) => {
    var { dataI } = req.body;
    var { dataF } = req.body;
    var { tipoRel } = req.body;

    /*por data de vencimento - nao pagar*/
    if (tipoRel == 'PAGAR') {
        var sql =
            'select ' +
            'tmp_emp.idemprestimo, ' +
            'tmp_emp.valor_pago, ' +
            'tmp_emp.vencimento, ' +
            'tmp_emp.parcela, ' +
            'tmp_emp.idparcela, ' +
            'tmp_emp.idcliente, ' +
            'tmp_emp.data_cadastro, ' +
            'tmp_emp.quantidade_parcelas, ' +
            'tmp_emp.valor, ' +
            'tmp_emp.valor_total, ' +
            'cli.nome ' +
            'from ' +
            '(select tmp_parcelas.idemprestimo, ' +
            'tmp_parcelas.valor_pago, ' +
            'tmp_parcelas.vencimento, ' +
            'tmp_parcelas.parcela, ' +
            'tmp_parcelas.idparcela, ' +
            'tmp_parcelas.valor, ' +
            'emp.idcliente, ' +
            'emp.valor_total, ' +
            'emp.quantidade_parcelas, ' +
            'data_cadastro ' +
            'from  ' +
            '(select ' +
            'pe.idemprestimo, ' +
            'pe.idparcela, ' +
            'pe.parcela, ' +
            'pe.valor, ' +
            'pe.vencimento, ' +
            'ifnull(pp.data_pagamento,0) as data_pagamento, ' +
            'ifnull(sum(pp.valor_pago),0) as valor_pago ' +
            'from ' +
            'parcelas_emprestimo as pe ' +
            'left join pagamentos_parcelas as pp ' +
            'on pp.idparcela = pe.idparcela ' +
            'where pe.vencimento ' +
            'between ? and ? ' +
            'group by  pp.idparcela, pp.data_pagamento,  ' +
            'pe.idemprestimo, pe.vencimento, ' +
            'pe.parcela, pe.valor, pe.idparcela) as tmp_parcelas ' +
            'left join emprestimos as emp  ' +
            'on emp.idemprestimo = tmp_parcelas.idemprestimo ' +
            'where tmp_parcelas.valor > tmp_parcelas.valor_pago) as tmp_emp ' +
            'left join clientes as cli ' +
            'on cli.idcliente = tmp_emp.idcliente ' +
            'order by idemprestimo, parcela ';
    }

    /*por data de vencimento - pagas */
    if (tipoRel == 'PAGAS') {
        var sql =
            'select ' +
            'tmp_emp.idemprestimo, ' +
            'tmp_emp.valor_pago, ' +
            'tmp_emp.vencimento, ' +
            'tmp_emp.parcela, ' +
            'tmp_emp.idparcela, ' +
            'tmp_emp.idcliente, ' +
            'tmp_emp.data_cadastro, ' +
            'tmp_emp.quantidade_parcelas, ' +
            'tmp_emp.valor, ' +
            'tmp_emp.valor_total, ' +
            'cli.nome ' +
            'from ' +
            '(select tmp_parcelas.idemprestimo, ' +
            'tmp_parcelas.valor_pago, ' +
            'tmp_parcelas.vencimento, ' +
            'tmp_parcelas.parcela, ' +
            'tmp_parcelas.idparcela, ' +
            'tmp_parcelas.valor, ' +
            'emp.idcliente, ' +
            'emp.valor_total, ' +
            'emp.quantidade_parcelas, ' +
            'data_cadastro ' +
            'from  ' +
            '(select ' +
            'pe.idemprestimo, ' +
            'pe.idparcela, ' +
            'pe.parcela, ' +
            'pe.valor, ' +
            'pe.vencimento, ' +
            'ifnull(pp.data_pagamento,0) as data_pagamento, ' +
            'ifnull(sum(pp.valor_pago),0) as valor_pago ' +
            'from ' +
            'parcelas_emprestimo as pe ' +
            'left join pagamentos_parcelas as pp ' +
            'on pp.idparcela = pe.idparcela ' +
            'where pe.vencimento ' +
            'between ? and ? ' +
            'group by  pp.idparcela, pp.data_pagamento,  ' +
            'pe.idemprestimo, pe.vencimento, ' +
            'pe.parcela, pe.valor, pe.idparcela) as tmp_parcelas ' +
            'left join emprestimos as emp  ' +
            'on emp.idemprestimo = tmp_parcelas.idemprestimo ' +
            'where tmp_parcelas.valor_pago > 0) as tmp_emp ' +
            'left join clientes as cli ' +
            'on cli.idcliente = tmp_emp.idcliente ' +
            'order by idemprestimo, parcela ';
    }

    /*rel. emprestimo movimento  / por data de vencimento - Geral*/
    if (tipoRel == 'GERAL') {
        var sql =
            'select ' +
            'tmp_emp.idemprestimo, ' +
            'tmp_emp.valor_pago, ' +
            'tmp_emp.vencimento, ' +
            'tmp_emp.parcela, ' +
            'tmp_emp.idparcela, ' +
            'tmp_emp.idcliente, ' +
            'tmp_emp.data_cadastro, ' +
            'tmp_emp.quantidade_parcelas, ' +
            'tmp_emp.valor, ' +
            'tmp_emp.valor_juros, ' +
            'tmp_emp.valor_total, ' +
            'cli.nome ' +
            'from ' +
            '(select tmp_parcelas.idemprestimo, ' +
            'tmp_parcelas.valor_pago, ' +
            'tmp_parcelas.vencimento, ' +
            'tmp_parcelas.parcela, ' +
            'tmp_parcelas.idparcela, ' +
            'tmp_parcelas.valor, ' +
            'emp.idcliente, ' +
            'emp.valor_total, ' +
            'emp.valor_juros, ' +
            'emp.quantidade_parcelas, ' +
            'data_cadastro ' +
            'from ' +
            '(select ' +
            'pe.idemprestimo, ' +
            'pe.idparcela, ' +
            'pe.parcela, ' +
            'pe.valor, ' +
            'pe.vencimento, ' +
            'ifnull(pp.data_pagamento,0) as data_pagamento, ' +
            'ifnull(sum(pp.valor_pago),0) as valor_pago ' +
            'from ' +
            'parcelas_emprestimo as pe ' +
            'left join pagamentos_parcelas as pp ' +
            'on pp.idparcela = pe.idparcela ' +
            'where pe.vencimento ' +
            'between ? and ? ' +
            'group by  pp.idparcela, pp.data_pagamento, ' +
            'pe.idemprestimo, pe.vencimento, ' +
            'pe.parcela, pe.valor, pe.idparcela) as tmp_parcelas ' +
            'left join emprestimos as emp  ' +
            'on emp.idemprestimo = tmp_parcelas.idemprestimo) as tmp_emp ' +
            'left join clientes as cli ' +
            'on cli.idcliente = tmp_emp.idcliente ' +
            'order by idemprestimo, parcela ';
    }

    db.query(sql, [dataI, dataF], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

/////relatorios moviemto de cheque por data de vencimento
export const movimentoChequesPorVencimento = (req, res) => {
    const { dataI } = req.body;
    const { dataF } = req.body;
    const { status } = req.body;

    let sql = '';
    if (status === 'GERAL') {
        sql =
            `SELECT * FROM borderos_lancamentos ` +
            `as cheques inner join borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? order by cheques.data_vencimento`;
    }
    if (status === 'DEVOLVIDO') {
        sql =
            `SELECT * FROM borderos_lancamentos ` +
            `as cheques inner join borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? and status = 'DEVOLVIDO' order by cheques.data_vencimento`;
    }
    if (status === 'RECEBIDO') {
        sql =
            `SELECT * FROM borderos_lancamentos ` +
            `as cheques inner join borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where cheques.data_vencimento between  ? and ? and status = 'RECEBIDO' order by cheques.data_vencimento`;
    }

    db.query(sql, [dataI, dataF], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

/****** */
////Movimento emprestimos por data de emissao
export const relatorioMovimentoEmprestimoEmissao = (req, res) => {
    var { dataI } = req.body;
    var { dataF } = req.body;
    var { tipoRel } = req.body;

    /*por data de emissao - nao pagar*/
    if (tipoRel == 'PAGAR') {
        var sql =
            'select ' +
            'tmp_emp.idemprestimo, ' +
            'tmp_emp.valor_pago, ' +
            'tmp_emp.vencimento, ' +
            'tmp_emp.parcela, ' +
            'tmp_emp.idparcela, ' +
            'tmp_emp.idcliente, ' +
            'tmp_emp.data_cadastro, ' +
            'tmp_emp.quantidade_parcelas, ' +
            'tmp_emp.valor, ' +
            'tmp_emp.valor_juros, ' +
            'tmp_emp.valor_total, ' +
            'cli.nome ' +
            'from ' +
            '(select tmp_parcelas.idemprestimo, ' +
            'tmp_parcelas.valor_pago, ' +
            'tmp_parcelas.vencimento, ' +
            'tmp_parcelas.parcela, ' +
            'tmp_parcelas.idparcela, ' +
            'tmp_parcelas.valor, ' +
            'emp.idcliente, ' +
            'emp.valor_total, ' +
            'emp.quantidade_parcelas, ' +
            'data_cadastro ' +
            'from  ' +
            '(select ' +
            'pe.idemprestimo, ' +
            'pe.idparcela, ' +
            'pe.parcela, ' +
            'pe.valor, ' +
            'pe.vencimento, ' +
            'ifnull(pp.data_pagamento,0) as data_pagamento, ' +
            'ifnull(sum(pp.valor_pago),0) as valor_pago ' +
            'from ' +
            'parcelas_emprestimo as pe ' +
            'left join pagamentos_parcelas as pp ' +
            'on pp.idparcela = pe.idparcela ' +
            'group by  pp.idparcela, pp.data_pagamento,  ' +
            'pe.idemprestimo, pe.vencimento, ' +
            'pe.parcela, pe.valor, pe.idparcela) as tmp_parcelas ' +
            'left join emprestimos as emp  ' +
            'on emp.idemprestimo = tmp_parcelas.idemprestimo ' +
            'where tmp_parcelas.valor > tmp_parcelas.valor_pago) as tmp_emp ' +
            'left join clientes as cli ' +
            'on cli.idcliente = tmp_emp.idcliente ' +
            'where tmp_emp.data_cadastro between ? and ? ' +
            'order by idemprestimo, parcela ';
    }

    /*por data de vencimento - pagas */
    if (tipoRel == 'PAGAS') {
        var sql =
            'select ' +
            'tmp_emp.idemprestimo, ' +
            'tmp_emp.valor_pago, ' +
            'tmp_emp.vencimento, ' +
            'tmp_emp.parcela, ' +
            'tmp_emp.idparcela, ' +
            'tmp_emp.idcliente, ' +
            'tmp_emp.data_cadastro, ' +
            'tmp_emp.quantidade_parcelas, ' +
            'tmp_emp.valor, ' +
            'tmp_emp.valor_juros, ' +
            'tmp_emp.valor_total, ' +
            'cli.nome ' +
            'from ' +
            '(select tmp_parcelas.idemprestimo, ' +
            'tmp_parcelas.valor_pago, ' +
            'tmp_parcelas.vencimento, ' +
            'tmp_parcelas.parcela, ' +
            'tmp_parcelas.idparcela, ' +
            'tmp_parcelas.valor, ' +
            'emp.idcliente, ' +
            'emp.valor_total, ' +
            'emp.quantidade_parcelas, ' +
            'data_cadastro ' +
            'from  ' +
            '(select ' +
            'pe.idemprestimo, ' +
            'pe.idparcela, ' +
            'pe.parcela, ' +
            'pe.valor, ' +
            'pe.vencimento, ' +
            'ifnull(pp.data_pagamento,0) as data_pagamento, ' +
            'ifnull(sum(pp.valor_pago),0) as valor_pago ' +
            'from ' +
            'parcelas_emprestimo as pe ' +
            'left join pagamentos_parcelas as pp ' +
            'on pp.idparcela = pe.idparcela ' +
            'group by  pp.idparcela, pp.data_pagamento,  ' +
            'pe.idemprestimo, pe.vencimento, ' +
            'pe.parcela, pe.valor, pe.idparcela) as tmp_parcelas ' +
            'left join emprestimos as emp  ' +
            'on emp.idemprestimo = tmp_parcelas.idemprestimo ' +
            'where tmp_parcelas.valor_pago > 0) as tmp_emp ' +
            'left join clientes as cli ' +
            'on cli.idcliente = tmp_emp.idcliente ' +
            'where tmp_emp.data_cadastro between ? and ? ' +
            'order by idemprestimo, parcela ';
    }

    /*por data de vencimento - Geral*/
    if (tipoRel == 'GERAL') {
        var sql =
            'select ' +
            'tmp_emp.idemprestimo, ' +
            'tmp_emp.valor_pago, ' +
            'tmp_emp.vencimento, ' +
            'tmp_emp.parcela, ' +
            'tmp_emp.idparcela, ' +
            'tmp_emp.idcliente, ' +
            'tmp_emp.data_cadastro, ' +
            'tmp_emp.quantidade_parcelas, ' +
            'tmp_emp.valor, ' +
            'tmp_emp.valor_juros, ' +
            'tmp_emp.valor_total, ' +
            'cli.nome ' +
            'from ' +
            '(select tmp_parcelas.idemprestimo, ' +
            'tmp_parcelas.valor_pago, ' +
            'tmp_parcelas.vencimento, ' +
            'tmp_parcelas.parcela, ' +
            'tmp_parcelas.idparcela, ' +
            'tmp_parcelas.valor, ' +
            'emp.idcliente, ' +
            'emp.valor_total, ' +
            'emp.valor_juros, ' +
            'emp.quantidade_parcelas, ' +
            'data_cadastro ' +
            'from ' +
            '(select ' +
            'pe.idemprestimo, ' +
            'pe.idparcela, ' +
            'pe.parcela, ' +
            'pe.valor, ' +
            'pe.vencimento, ' +
            'ifnull(pp.data_pagamento,0) as data_pagamento, ' +
            'ifnull(sum(pp.valor_pago),0) as valor_pago ' +
            'from ' +
            'parcelas_emprestimo as pe ' +
            'left join pagamentos_parcelas as pp ' +
            'on pp.idparcela = pe.idparcela ' +
            'group by  pp.idparcela, pp.data_pagamento, ' +
            'pe.idemprestimo, pe.vencimento, ' +
            'pe.parcela, pe.valor, pe.idparcela) as tmp_parcelas ' +
            'left join emprestimos as emp  ' +
            'on emp.idemprestimo = tmp_parcelas.idemprestimo) as tmp_emp ' +
            'left join clientes as cli ' +
            'on cli.idcliente = tmp_emp.idcliente ' +
            'where tmp_emp.data_cadastro between ? and ? ' +
            'order by idemprestimo, parcela ';
    }

    db.query(sql, [dataI, dataF], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

/////Movimento de Cheques por data da emissao da operação
export const relatorioMovimentoChequesPorEmissao = (req, res) => {
    const { dataI } = req.body;
    const { dataF } = req.body;
    const { status } = req.body;

    let sql = '';
    if (status === 'GERAL') {
        sql =
            `SELECT * FROM borderos_lancamentos ` +
            `as cheques inner join borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where operacao.data between  ? and ? order by cheques.data_vencimento`;
    }
    if (status === 'DEVOLVIDO') {
        sql =
            `SELECT * FROM borderos_lancamentos ` +
            `as cheques inner join borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where operacao.data between  ? and ? and cheques.status = 'DEVOLVIDO' order by cheques.data_vencimento`;
    }
    if (status === 'RECEBIDO') {
        sql =
            `SELECT * FROM borderos_lancamentos ` +
            `as cheques inner join borderos as operacao ` +
            `on cheques.idbordero = operacao.idbordero ` +
            `inner join clientes as cli on operacao.idcliente = cli.idcliente ` +
            `where operacao.data between  ? and ? and cheques.status = 'RECEBIDO' order by cheques.data_vencimento`;
    }

    db.query(sql, [dataI, dataF], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};
