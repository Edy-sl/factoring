import express from 'express';
import jwt from 'jsonwebtoken';
import { loginFactoring } from '../controles/login.js';
import {
    postCadUsuario,
    postCadUsuarioSecundario,
} from '../controles/cadastroUsuario.js';
import { recuperaSenha } from '../controles/recuperaSenha.js';
import { postFactoring } from '../controles/cadastroEmpresa.js';
import { postSelecionaFactoring } from '../controles/cadastroEmpresa.js';
import { putAtualizaFactoring } from '../controles/cadastroEmpresa.js';
import { getPermissoes } from '../controles/permissoes.js';
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
} from '../controles/emprestimo.js';
import {
    gravarBordero,
    buscaBordero,
    buscaBorderoId,
    alterarBordero,
} from '../controles/bordero.js';
import {
    gravarLancamento,
    listarLancamento,
} from '../controles/borderoLancamento.js';

import {
    alterarCliente,
    buscaClienteCnpjCpf,
    buscaClienteId,
    buscaClienteNome,
    postCliente,
    atualizaTaxaCliente,
} from '../controles/cadastroCliente.js';

const SECRET = process.env.SECRET;

const rotaFactoring = express.Router();

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end();
        req.userID = decoded.userID;
        next();
    });
}

function verificaPermissao(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end();
        if (decoded.grupo !== 'admin')
            return res.status(200).json('Usuário sem permissão').end();
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

rotaFactoring.post('/gravar-bordero', verifyJWT, gravarBordero);
rotaFactoring.post('/alterar-bordero', verifyJWT, alterarBordero);
rotaFactoring.post('/busca-bordero', verifyJWT, buscaBordero);
rotaFactoring.post('/busca-bordero-id', verifyJWT, buscaBorderoId);
rotaFactoring.post('/gravar-lancamento', verifyJWT, gravarLancamento);
rotaFactoring.post('/listar-lancamento', verifyJWT, listarLancamento);

rotaFactoring.post('/gravar-emprestimo', verifyJWT, gravarEmprestimo);
rotaFactoring.post('/busca-emprestimo', verifyJWT, buscaEmprestimo);
rotaFactoring.post('/busca-emprestimo-id', verifyJWT, buscaEmprestimoId);

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

rotaFactoring.get('/permissoes', verifyJWT, getPermissoes);

export default rotaFactoring;
