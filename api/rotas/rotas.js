import express from 'express';
import jwt from 'jsonwebtoken';
import {} from 'dotenv/config';
import { loginFactoring } from '../controles/login.js';
import {
    postCadUsuario,
    postCadUsuarioSecundario,
    listaUsuarios,
} from '../controles/cadastroUsuario.js';
import { recuperaSenha } from '../controles/recuperaSenha.js';
import { postFactoring } from '../controles/cadastroEmpresa.js';
import { postSelecionaFactoring } from '../controles/cadastroEmpresa.js';
import { putAtualizaFactoring } from '../controles/cadastroEmpresa.js';
import {
    getPermissoes,
    atualizaPermissao,
    listaGrupoPermissao,
    excluirPermissao,
} from '../controles/permissoes.js';
import {
    buscaEmprestimo,
    buscaEmprestimoId,
    gravarEmprestimo,
    buscaParcelasIdEmprestimo,
    pagamentoParcelaEmprestimo,
    excluirPagamentoParcelaEmprestimo,
    listaPagamentoParcela,
    relatorioEmprestimoVencimento,
    relatorioEmprestimoEmissao,
    relatorioEmprestimoClienteVencimento,
    relatorioEmprestimoClienteEmissao,
    pagamentoVariasParcelasEmprestimo,
} from '../controles/emprestimo.js';
import {
    gravarBordero,
    buscaBordero,
    buscaBorderoId,
    alterarBordero,
    gravarCheques,
    listarCheques,
    exluirCheque,
    relatorioPorVencimento,
    relatorioPorEmissao,
    relatorioPorClienteVencimento,
    relatorioPorClienteEmissao,
    buscaChequeNumero,
    gravarDataDevolucao,
    listaChequesDevolvidos,
    listaChequesDeduzidos,
    gravarDataPagamento,
} from '../controles/bordero.js';

import {
    alterarCliente,
    buscaClienteCnpjCpf,
    buscaClienteId,
    buscaClienteNome,
    postCliente,
    atualizaTaxaCliente,
    listaClientes,
} from '../controles/cadastroCliente.js';

import {
    movimentoChequesPorPagamento,
    movimentoChequesPorVencimento,
    movimentoEmprestimoPagamento,
    movimentoEmprestimoVencimento,
    relatorioMovimentoChequesDeducaoPorEmissao,
    relatorioMovimentoChequesDeducaoPorVencimento,
    relatorioMovimentoChequesPorEmissao,
    relatorioMovimentoEmprestimoEmissao,
} from '../controles/movimento.js';

const SECRET = process.env.SECRET;

const rotaFactoring = express.Router();

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json('Token invalido!').end();
        req.userID = decoded.userID;
        next();
    });
}

function verificaPermissao(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end();
        if (decoded.grupo !== 'admin')
            return res.status(401).json('Usuário sem permissão!').end();
        next();
    });
}

rotaFactoring.post('/cad-usuario', postCadUsuario);
rotaFactoring.post(
    '/cad-usuario-secundario',
    verifyJWT,
    verificaPermissao,
    postCadUsuarioSecundario
);

rotaFactoring.post(
    '/lista-usuarios',
    verifyJWT,
    verificaPermissao,
    listaUsuarios
);
rotaFactoring.post('/login', loginFactoring);

rotaFactoring.get('/recupera-senha', recuperaSenha);

rotaFactoring.post(
    '/cad-factoring',
    verifyJWT,
    verificaPermissao,
    postFactoring
);
rotaFactoring.post('/seleciona-factoring', verifyJWT, postSelecionaFactoring);

rotaFactoring.put(
    '/atualizar-factoring',
    verifyJWT,
    verificaPermissao,
    putAtualizaFactoring
);

rotaFactoring.post('/cad-cliente', verifyJWT, postCliente);
rotaFactoring.post('/alterar-cliente', verifyJWT, alterarCliente);
rotaFactoring.post('/busca-cliente', verifyJWT, buscaClienteCnpjCpf);
rotaFactoring.post('/busca-cliente-nome', verifyJWT, buscaClienteNome);
rotaFactoring.post('/busca-cliente-id', verifyJWT, buscaClienteId);
rotaFactoring.post(
    '/atualiza-taxa-cliente',
    verifyJWT,
    verificaPermissao,
    atualizaTaxaCliente
);
rotaFactoring.post('/lista-clientes', verifyJWT, listaClientes);

rotaFactoring.post('/gravar-bordero', verifyJWT, gravarBordero);
rotaFactoring.post(
    '/alterar-bordero',
    verifyJWT,
    verificaPermissao,
    alterarBordero
);
rotaFactoring.post('/busca-bordero', verifyJWT, buscaBordero);
rotaFactoring.post('/busca-bordero-id', verifyJWT, buscaBorderoId);
rotaFactoring.post('/gravar-lancamento', verifyJWT, gravarCheques);
rotaFactoring.post('/listar-lancamento', verifyJWT, listarCheques);
rotaFactoring.post('/gravar-emprestimo', verifyJWT, gravarEmprestimo);
rotaFactoring.post('/busca-emprestimo', verifyJWT, buscaEmprestimo);
rotaFactoring.post('/busca-emprestimo-id', verifyJWT, buscaEmprestimoId);
rotaFactoring.post(
    '/excluir-cheque',
    verifyJWT,
    verificaPermissao,
    exluirCheque
);
rotaFactoring.post('/busca-cheque-numero', verifyJWT, buscaChequeNumero);
rotaFactoring.post('/gravar-data-devolucao', verifyJWT, gravarDataDevolucao);
rotaFactoring.post(
    '/lista-cheques-devolvidos',
    verifyJWT,
    listaChequesDevolvidos
);

rotaFactoring.post('/gravar-data-pagamento', verifyJWT, gravarDataPagamento);

rotaFactoring.post(
    '/lista-cheques-deduzidos',
    verifyJWT,
    listaChequesDeduzidos
);

//relatorio de cheques por vencimento
rotaFactoring.post(
    '/relatorio-cheque-vencimento',
    verifyJWT,
    relatorioPorVencimento
);

//relatorio de cheques por dt. emissao operacao
rotaFactoring.post('/relatorio-cheque-emissao', verifyJWT, relatorioPorEmissao);

//relatorio de cheques por cliente e dt de vencimento
rotaFactoring.post(
    '/relatorio-cheque-cliente-vencimento',
    verifyJWT,
    relatorioPorClienteVencimento
);

//relatorio de cheques por cliente e dt de emissao da op.
rotaFactoring.post(
    '/relatorio-cheque-cliente-emissao',
    verifyJWT,
    relatorioPorClienteEmissao
);

//relatorio
rotaFactoring.post(
    '/relatorio-emprestimo-vencimento',
    verifyJWT,
    relatorioEmprestimoVencimento
);

//relatorio
rotaFactoring.post(
    '/relatorio-emprestimo-emissao',
    verifyJWT,
    relatorioEmprestimoEmissao
);

//relatorio
rotaFactoring.post(
    '/relatorio-emprestimo-cliente-vencimento',
    verifyJWT,
    relatorioEmprestimoClienteVencimento
);

//relatorio
rotaFactoring.post(
    '/relatorio-emprestimo-cliente-emissao',
    verifyJWT,
    relatorioEmprestimoClienteEmissao
);

rotaFactoring.post(
    '/gravar-pagamento-parcela',
    verifyJWT,
    verificaPermissao,
    pagamentoParcelaEmprestimo
);

rotaFactoring.post(
    '/gravar-pagamento-varias-parcelas',
    verifyJWT,
    verificaPermissao,
    pagamentoVariasParcelasEmprestimo
);

rotaFactoring.post(
    '/excluir-pagamento-emprestimo',
    verifyJWT,
    verificaPermissao,
    excluirPagamentoParcelaEmprestimo
);

rotaFactoring.post(
    '/lista-pagamento-parcela',
    verifyJWT,
    listaPagamentoParcela
);

rotaFactoring.post(
    '/busca-parcelas-idemprestimo',
    verifyJWT,
    buscaParcelasIdEmprestimo
);

rotaFactoring.post('/permissoes', verifyJWT, getPermissoes);

rotaFactoring.post(
    '/aplicar-permissao',
    verifyJWT,
    verificaPermissao,
    atualizaPermissao
);

rotaFactoring.post(
    '/lista-grupos-permissao',
    verifyJWT,
    verificaPermissao,
    listaGrupoPermissao
);

rotaFactoring.post(
    '/excluir-permissao',
    verifyJWT,
    verificaPermissao,
    excluirPermissao
);

//relatorio de cheques/emprestimos por dt de vencimento
rotaFactoring.post(
    '/relatorio-movimento-cheque-vencimento',
    verifyJWT,
    movimentoChequesPorVencimento
);

rotaFactoring.post(
    '/relatorio-movimento-emprestimo-vencimento',
    verifyJWT,
    movimentoEmprestimoVencimento
);

//relatorio de cheques/dedução/emprestimos por dt de Emissao
rotaFactoring.post(
    '/relatorio-movimento-cheque-emissao',
    verifyJWT,
    relatorioMovimentoChequesPorEmissao
);

rotaFactoring.post(
    '/relatorio-movimento-cheque-pagamento',
    verifyJWT,
    movimentoChequesPorPagamento
);

rotaFactoring.post(
    '/relatorio-movimento-emprestimo-emissao',
    verifyJWT,
    relatorioMovimentoEmprestimoEmissao
);

rotaFactoring.post(
    '/relatorio-movimento-emprestimo-pagamento',
    verifyJWT,
    movimentoEmprestimoPagamento
);

rotaFactoring.post(
    '/relatorio-movimento-deducao-emissao',
    verifyJWT,
    relatorioMovimentoChequesDeducaoPorEmissao
);

rotaFactoring.post(
    '/relatorio-movimento-deducao-vencimento',
    verifyJWT,
    relatorioMovimentoChequesDeducaoPorVencimento
);

export default rotaFactoring;
