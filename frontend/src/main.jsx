import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { Home } from './pages/home.jsx';
import { ErrorPage } from './pages/errorPage.jsx';

// 1 - configurando router
import {
    BrowserRouter,
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import { FormLogin } from './components/formLogin/index.jsx';
import { FormOperacaoCheque } from './components/operacaoCheque/index.jsx';
import { FormCadastroUsuario } from './components/formCadastroUsuario/index.jsx';
import { FormCadastroUsuarioSecundario } from './components/formCadastroUsuarioSecundario/index.jsx';
import { FormCliente } from './components/formCliente/index.jsx';
import { TaxaCliente } from './components/taxaCliente/taxaCliente.jsx';
import { FormOperacionalEmprestimo } from './components/operacaoEmprestimo/index.jsx';
import { PrivateRouter } from './pages/rotaPrivada/rotaPrivada.jsx';
import { AuthProvider } from './context/authContext.jsx';
import { FormRecuperaSenha } from './components/formRecuperaSenha/index.jsx';
import { BemVindo } from './pages/bemVindo/index.jsx';
import { FormFactoring } from './components/formFactoring/index.jsx';
import { Permissoes } from './components/permissoes/permissoes.jsx';
import { RelatorioEmprestimoPorVencimento } from './components/relatorioEmprestimoVencimento/index.jsx';
import { RelatorioEmprestimoPorEmissao } from './components/relatorioEmprestimoEmissao/index.jsx';
import { RelatorioEmprestimoPorClienteVencimento } from './components/relatorioEmprestimoClienteVencimento/index.jsx';
import { RelatorioEmprestimoPorClienteEmissao } from './components/relatorioEmprestimoClienteEmissao/index.jsx';
import { RelatorioChequePorVencimento } from './components/relatorioChequeVencimento/index.jsx';
import { RelatorioChequePorEmissao } from './components/relatorioChequeEmissao/index.jsx';
import { RelatorioChequePorClienteVencimento } from './components/relatorioChequeClienteVencimento/index.jsx';
import { RelatorioChequePorClienteEmissao } from './components/relatorioChequeClienteEmissao/index.jsx';
import { RelatorioMovimentoPorVencimento } from './components/relatorioMovimentoVencimento/index.jsx';
import { RelatorioMovimentoPorEmissao } from './components/relatorioMovimentoEmissao/index.jsx';
import { RelatorioClientes } from './components/relatorioClientes/index.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <AuthProvider>
                <App />
            </AuthProvider>
        ),
        //3 - pagina de erro
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <BemVindo />,
            },
            {
                path: '/login',
                element: <FormLogin />,
            },
            {
                path: '/empresa',
                element: (
                    <PrivateRouter>
                        <FormFactoring />
                    </PrivateRouter>
                ),
            },
            {
                path: '/cadastro-usuario-secundario',
                element: (
                    <PrivateRouter>
                        <FormCadastroUsuarioSecundario />
                    </PrivateRouter>
                ),
            },
            {
                path: '/permissoes',
                element: (
                    <PrivateRouter>
                        <Permissoes />
                    </PrivateRouter>
                ),
            },
            {
                path: '/bordero',
                element: (
                    <PrivateRouter>
                        <FormOperacaoCheque />
                    </PrivateRouter>
                ),
            },

            {
                path: '/relatorio-emprestimo-vencimento',
                element: (
                    <PrivateRouter>
                        <RelatorioEmprestimoPorVencimento />
                    </PrivateRouter>
                ),
            },
            {
                path: '/relatorio-cheque-cliente-vencimento',
                element: (
                    <PrivateRouter>
                        <RelatorioChequePorClienteVencimento />
                    </PrivateRouter>
                ),
            },
            {
                path: '/relatorio-cheque-cliente-emissao',
                element: (
                    <PrivateRouter>
                        <RelatorioChequePorClienteEmissao />
                    </PrivateRouter>
                ),
            },
            {
                path: '/cadastro-usuario',
                element: <FormCadastroUsuario />,
            },

            {
                path: '/cadastro-cliente',
                element: (
                    <PrivateRouter>
                        <FormCliente />
                    </PrivateRouter>
                ),
            },
            {
                path: '/taxa-cliente',
                element: (
                    <PrivateRouter>
                        <TaxaCliente />
                    </PrivateRouter>
                ),
            },
            {
                path: '/relatorio-clientes',
                element: (
                    <PrivateRouter>
                        <RelatorioClientes />
                    </PrivateRouter>
                ),
            },
            {
                path: '/emprestimo',
                element: (
                    <PrivateRouter>
                        <FormOperacionalEmprestimo />
                    </PrivateRouter>
                ),
            },
            {
                path: '/relatorio-cheque-vencimento',
                element: (
                    <PrivateRouter>
                        <RelatorioChequePorVencimento />
                    </PrivateRouter>
                ),
            },
            {
                path: '/relatorio-cheque-emissao',
                element: (
                    <PrivateRouter>
                        <RelatorioChequePorEmissao />
                    </PrivateRouter>
                ),
            },
            {
                path: '/relatorio-emprestimo-emissao',
                element: (
                    <PrivateRouter>
                        <RelatorioEmprestimoPorEmissao />
                    </PrivateRouter>
                ),
            },
            {
                path: '/relatorio-emprestimo-cliente-vencimento',
                element: (
                    <PrivateRouter>
                        <RelatorioEmprestimoPorClienteVencimento />
                    </PrivateRouter>
                ),
            },
            {
                path: '/relatorio-emprestimo-cliente-emissao',
                element: (
                    <PrivateRouter>
                        <RelatorioEmprestimoPorClienteEmissao />
                    </PrivateRouter>
                ),
            },

            {
                path: '/relatorio-movimento-vencimento',
                element: (
                    <PrivateRouter>
                        <RelatorioMovimentoPorVencimento />
                    </PrivateRouter>
                ),
            },
            {
                path: '/relatorio-movimento-emissao',
                element: (
                    <PrivateRouter>
                        <RelatorioMovimentoPorEmissao />
                    </PrivateRouter>
                ),
            },
            {
                path: '/recupera-senha',
                element: <FormRecuperaSenha />,
            },

            { basename: '/' },

            /* {
      path: "/contact",
      element:  
        <PrivateRouter >
          <Contact />
        </PrivateRouter>
    },/*/
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
