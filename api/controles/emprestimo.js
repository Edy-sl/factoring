import { db } from '../db.js';
import {} from 'dotenv/config';

export const gravarEmprestimo = (req, res) => {
    const { dataCadastro } = req.body;
    const { idCliente } = req.body;
    const { cnpjCpfCredor } = req.body;
    const { nomeCredor } = req.body;
    const { cnpjCpfAvalista } = req.body;
    const { nomeAvalista } = req.body;
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

    const { tipoEmprestimo } = req.body;
    const { nomeVeiculo } = req.body;
    const { placaVeiculo } = req.body;

    const sql =
        'insert into emprestimos ' +
        '(data_cadastro, juros_mensal, idcliente, ' +
        'cnpj_cpf_credor, nome_credor, ' +
        'valor_emprestimo, quantidade_parcelas, ' +
        'data_base, intervalo, valor_parcela, ' +
        'valor_juros, valor_total, idfactoring, ' +
        'tipo_emprestimo, nome_veiculo, placa, cnpj_cpf_avalista, nome_avalista)' +
        'values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

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
            tipoEmprestimo,
            nomeVeiculo,
            placaVeiculo,
            cnpjCpfAvalista,
            nomeAvalista,
        ],
        (err, data) => {
            if (err) return res.json(err);
            gravarParcelas(data.insertId, arrayParcelas);

            return res.status(200).json({
                insertId: data.insertId,
                msg: 'Emprestimo gravado!',
            });
        }
    );
};

//excluir emprestimo
export const excluirEmprestimo = (req, res) => {
    const { idEmprestimo } = req.body;

    const sql1 = `SET FOREIGN_KEY_CHECKS = 0 `;

    const sql2 =
        `delete pagamentos_parcelas, parcelas_emprestimo, emprestimos ` +
        `from emprestimos ` +
        `left join parcelas_emprestimo ` +
        `on parcelas_emprestimo.idemprestimo = emprestimos.idemprestimo ` +
        `left join pagamentos_parcelas on ` +
        `pagamentos_parcelas.idparcela = parcelas_emprestimo.idparcela ` +
        `where emprestimos.idemprestimo = ? `;

    const sql3 = `SET FOREIGN_KEY_CHECKS = 1 `;

    db.query(sql1, [idEmprestimo], (err, data) => {});

    db.query(sql2, [idEmprestimo], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Empréstimo excluido!');
    });

    db.query(sql3, [idEmprestimo], (err, data) => {});
};

//alterar valores do emprestimos
export const atualizarEmprestimo = (req, res) => {
    const { valorJuros } = req.body;
    const { valorTotal } = req.body;
    const { idEmprestimo } = req.body;

    const sql =
        'update emprestimos set valor_juros = ?, valor_total=? where idEmprestimo = ?';

    db.query(sql, [valorJuros, valorTotal, idEmprestimo], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Emprestimo Atualizado!');
    });
};

//alterar veiculo
export const atualizarVeiculoEmprestimo = (req, res) => {
    const { nomeVeiculo } = req.body;
    const { placaVeiculo } = req.body;
    const { idEmprestimo } = req.body;

    const sql =
        'update emprestimos set nome_veiculo = ?, placa = ? where idEmprestimo = ?';

    db.query(sql, [nomeVeiculo, placaVeiculo, idEmprestimo], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Veículo Atualizado!');
    });
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
    const { tipoEmprestimo } = req.body;

    const sql =
        'select emprestimos.idemprestimo,emprestimos.data_cadastro, ' +
        'clientes.idcliente, clientes.nome ' +
        'from emprestimos, clientes  ' +
        'where emprestimos.idcliente = clientes.idcliente ' +
        'and emprestimos.data_cadastro between  ? and ? ' +
        'and tipo_emprestimo = ? order by `idemprestimo` desc';
    db.query(sql, [dataI, dataF, tipoEmprestimo], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

export const buscaEmprestimoId = (req, res) => {
    const { emprestimo } = req.body;

    const sql =
        'select emprestimos.idemprestimo, ' +
        'emprestimos.data_cadastro, emprestimos.idcliente, ' +
        'emprestimos.nome_credor, emprestimos.cnpj_cpf_credor, ' +
        'emprestimos.data_base, emprestimos.juros_mensal, ' +
        'emprestimos.valor_emprestimo, emprestimos.quantidade_parcelas, ' +
        'emprestimos.intervalo, emprestimos.valor_parcela, emprestimos.valor_total, ' +
        'emprestimos.valor_juros, clientes.idcliente, ' +
        'emprestimos.tipo_emprestimo, placa, nome_veiculo, ' +
        'emprestimos.cnpj_cpf_avalista, emprestimos.nome_avalista, ' +
        'clientes.nome from emprestimos, clientes  ' +
        'where emprestimos.idcliente = clientes.idcliente and emprestimos.idemprestimo = ? ';
    db.query(sql, [emprestimo], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

export const buscaParcelasIdEmprestimo = (req, res) => {
    const { idEmprestimo } = req.body;
    const sql =
        'SELECT parcelas_emprestimo.idparcela,parcelas_emprestimo.parcela,' +
        'parcelas_emprestimo.vencimento, parcelas_emprestimo.valor,' +
        'round(ifnull(sum(pagamentos_parcelas.valor_pago), 0), 2) ' +
        'as valor_pago FROM parcelas_emprestimo left join  pagamentos_parcelas ' +
        'on pagamentos_parcelas.idparcela = parcelas_emprestimo.idparcela ' +
        'where  parcelas_emprestimo.idemprestimo =? group by parcelas_emprestimo.idparcela';
    db.query(sql, [idEmprestimo], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

//gravar pagamento da parcela
export const pagamentoParcelaEmprestimo = (req, res) => {
    const { idParcela } = req.body;
    const { valorPago } = req.body;
    const { dataPagamento } = req.body;
    const sql =
        'insert into pagamentos_parcelas (idparcela,valor_pago,data_pagamento) values (?,?,?)';
    db.query(sql, [idParcela, valorPago, dataPagamento], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Pagammento registrado!');
    });
};

//gravar varios pagamentos de parcelas
export const pagamentoVariasParcelasEmprestimo = (req, res) => {
    const { arrayParcela } = req.body;

    const data = new Date();
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();

    const dataPagamento = ano + '-' + mes + '-' + dia;

    arrayParcela.map((P) => {
        const sql =
            'insert into pagamentos_parcelas (idparcela,valor_pago,data_pagamento) values (?,?,?)';
        db.query(sql, [P.idParcela, P.valor, dataPagamento], (err, data) => {});
    });
};

//excluir pagamento da parcela
export const excluirPagamentoParcelaEmprestimo = (req, res) => {
    const { idPagamento } = req.body;
    const sql = 'delete from pagamentos_parcelas where idpagamento = ? ';
    db.query(sql, [idPagamento], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Pagammento excluido!');
    });
};

export const listaPagamentoParcela = (req, res) => {
    const { idParcela } = req.body;

    const sql = 'select * from pagamentos_parcelas where idparcela = ?';
    db.query(sql, [idParcela], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

////relatorios por data de vencimento
export const relatorioEmprestimoVencimento = (req, res) => {
    var { dataI } = req.body;
    var { dataF } = req.body;
    var { tipoRel } = req.body;
    const { tipoEmprestimo } = req.body;

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
            'tmp_emp.valor_juros, ' +
            'tmp_emp.valor_total, ' +
            'tmp_emp.tipo_emprestimo, ' +
            'cli.nome ' +
            'from ' +
            '(select tmp_parcelas.idemprestimo, ' +
            'tmp_parcelas.valor_pago, ' +
            'tmp_parcelas.vencimento, ' +
            'tmp_parcelas.parcela, ' +
            'tmp_parcelas.idparcela, ' +
            'tmp_parcelas.valor, ' +
            'emp.tipo_emprestimo, ' +
            'emp.idcliente, ' +
            'emp.valor_total, ' +
            'emp.valor_juros, ' +
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
            'on cli.idcliente = tmp_emp.idcliente where  tmp_emp.tipo_emprestimo = ? ' +
            'order by idemprestimo, vencimento';
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
            'tmp_emp.tipo_emprestimo, ' +
            'cli.nome ' +
            'from ' +
            '(select tmp_parcelas.idemprestimo, ' +
            'tmp_parcelas.valor_pago, ' +
            'tmp_parcelas.vencimento, ' +
            'tmp_parcelas.parcela, ' +
            'tmp_parcelas.idparcela, ' +
            'tmp_parcelas.valor, ' +
            'emp.tipo_emprestimo, ' +
            'emp.idcliente, ' +
            'emp.valor_total, ' +
            'emp.valor_juros, ' +
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
            'on cli.idcliente = tmp_emp.idcliente where  tmp_emp.tipo_emprestimo = ? ' +
            'order by idemprestimo, vencimento ';
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
            'tmp_emp.tipo_emprestimo, ' +
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
            'emp.tipo_emprestimo, ' +
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
            'on cli.idcliente = tmp_emp.idcliente where  tmp_emp.tipo_emprestimo = ? ' +
            'order by idemprestimo, vencimento ';
    }

    db.query(sql, [dataI, dataF, tipoEmprestimo], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

////relatorios por data de emissao
export const relatorioEmprestimoEmissao = (req, res) => {
    var { dataI } = req.body;
    var { dataF } = req.body;
    var { tipoRel } = req.body;
    const { tipoEmprestimo } = req.body;

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
            'tmp_emp.tipo_emprestimo, ' +
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
            'emp.tipo_emprestimo, ' +
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
            'and tmp_emp.tipo_emprestimo = ?';
        ('order by idemprestimo, vencimento ');
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
            'tmp_emp.tipo_emprestimo, ' +
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
            'emp.tipo_emprestimo, ' +
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
            'and tmp_emp.tipo_emprestimo = ? ' +
            'order by idemprestimo, vencimento ';
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
            'tmp_emp.valor_parcela,' +
            'tmp_emp.valor_juros, ' +
            'tmp_emp.valor_total, ' +
            'tmp_emp.tipo_emprestimo, ' +
            'tmp_emp.nome_veiculo, ' +
            'tmp_emp.placa, ' +
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
            'emp.valor_parcela, ' +
            'emp.quantidade_parcelas, ' +
            'emp.tipo_emprestimo, ' +
            'emp.nome_veiculo, ' +
            'emp.placa, ' +
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
            'where tmp_emp.data_cadastro between ? and ? and tmp_emp.tipo_emprestimo = ? ' +
            'order by idemprestimo, vencimento ';
    }

    /*por data de vencimento - Geral*/
    if (tipoRel == 'AGRUPADO') {
        var sql =
            'SELECT emp.idemprestimo, (emp.valor_total*0)  as valor_pago,' +
            'emp.data_base as vencimento, emp.quantidade_parcelas as parcela,' +
            'emp.data_cadastro, emp.quantidade_parcelas, emp.valor_parcela,' +
            'emp.valor_juros,emp.valor_total,' +
            'emp.tipo_emprestimo,' +
            'emp.nome_veiculo, ' +
            'emp.placa, ' +
            'cli.nome ' +
            'FROM emprestimos as emp ' +
            'left join clientes as cli on cli.idcliente = emp.idcliente ' +
            'left join parcelas_emprestimo as pe on pe.idemprestimo = emp.idemprestimo ' +
            'where ' +
            'emp.data_cadastro between ? and ? ' +
            'and emp.tipo_emprestimo = ? group by idemprestimo';
    }

    db.query(sql, [dataI, dataF, tipoEmprestimo], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

//relatorio emprestimos por cliente e data de vencimento
////relatorios por data de vencimento
export const relatorioEmprestimoClienteVencimento = (req, res) => {
    var { dataI } = req.body;
    var { dataF } = req.body;
    var { tipoRel } = req.body;
    var { idCliente } = req.body;
    const { tipoEmprestimo } = req.body;

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
            'tmp_emp.tipo_emprestimo, ' +
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
            'emp.tipo_emprestimo, ' +
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
            'where tmp_emp.idcliente = ? and tmp_emp.tipo_emprestimo = ? ' +
            'order by idemprestimo, vencimento ';
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
            'tmp_emp.tipo_emprestimo, ' +
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
            'emp.tipo_emprestimo, ' +
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
            'where tmp_emp.idcliente = ? and tmp_emp.tipo_emprestimo = ? ' +
            'order by idemprestimo, vencimento ';
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
            'tmp_emp.tipo_emprestimo, ' +
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
            'emp.tipo_emprestimo, ' +
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
            'where tmp_emp.idcliente = ? and tmp_emp.tipo_emprestimo = ?' +
            'order by idemprestimo, vencimento ';
    }

    db.query(sql, [dataI, dataF, idCliente, tipoEmprestimo], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

////relatorios por cliente e data de emissao
export const relatorioEmprestimoClienteEmissao = (req, res) => {
    var { dataI } = req.body;
    var { dataF } = req.body;
    var { tipoRel } = req.body;
    var { idCliente } = req.body;
    const { tipoEmprestimo } = req.body;

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
            'tmp_emp.tipo_emprestimo, ' +
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
            'emp.tipo_emprestimo, ' +
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
            'and tmp_emp.idcliente = ? and tmp_emp.tipo_emprestimo = ? ' +
            'order by idemprestimo, vencimento ';
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
            'tmp_emp.tipo_emprestimo, ' +
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
            'emp.tipo_emprestimo, ' +
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
            'and tmp_emp.idcliente = ? and tmp_emp.tipo_emprestimo = ? ' +
            'order by idemprestimo, vencimento ';
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
            'tmp_emp.tipo_emprestimo, ' +
            'cli.nome ' +
            'from ' +
            '(select tmp_parcelas.idemprestimo, ' +
            'tmp_parcelas.valor_pago, ' +
            'tmp_parcelas.vencimento, ' +
            'tmp_parcelas.parcela, ' +
            'tmp_parcelas.idparcela, ' +
            'tmp_parcelas.valor, ' +
            'emp.idcliente, ' +
            'emp.tipo_emprestimo, ' +
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
            'and tmp_emp.idcliente = ? and tmp_emp.tipo_emprestimo = ? ' +
            'order by idemprestimo, vencimento ';
    }

    db.query(sql, [dataI, dataF, idCliente, tipoEmprestimo], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

export const alterarValorParcela = (req, res) => {
    const { parcela } = req.body;
    const { valor } = req.body;
    const { numeroParcela } = req.body;

    const sql =
        'update parcelas_emprestimo set parcela = ? , valor = ? where idparcela = ?';
    db.query(sql, [numeroParcela, valor, parcela], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Valor alterado!');
    });
};
