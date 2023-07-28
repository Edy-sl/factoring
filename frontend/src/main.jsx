import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { Home } from './pages/home.jsx';
import { ErrorPage } from './pages/errorPage.jsx';

// 1 - configurando router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FormLogin } from './components/formLogin/index.jsx';
import { FormOperacaoCheque } from './components/operacaoCheque/index.jsx';
import { FormCadastroUsuario } from './components/formCadastroUsuario/index.jsx';
import { FormCliente } from './components/formCliente/index.jsx';
import { GridCheque } from './components/gridCheque/index.jsx';
import { FormOperacionalEmprestimo } from './components/operacaoEmprestimo/index.jsx';
import { PrivateRouter } from './pages/rotaPrivada/rotaPrivada.jsx';
import { AuthProvider } from './context/authContext.jsx';
import { FormRecuperaSenha } from './components/formRecuperaSenha/index.jsx';
import { BemVindo } from './pages/bemVindo/index.jsx';
import { FormFactoring } from './components/formFactoring/index.jsx';
import { Permissoes } from './components/permissoes/permissoes.jsx';
import { RelatorioEmprestimoPorData } from './components/relatorioEmprestimoData/index.jsx';

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
                path: '/emprestimo',
                element: (
                    <PrivateRouter>
                        <FormOperacionalEmprestimo />
                    </PrivateRouter>
                ),
            },
            {
                path: '/relatorio-emprestimo-data',
                element: (
                    <PrivateRouter>
                        <RelatorioEmprestimoPorData />
                    </PrivateRouter>
                ),
            },

            {
                path: '/recupera-senha',
                element: <FormRecuperaSenha />,
            },

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
