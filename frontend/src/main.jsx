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

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        //3 - pagina de erro
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <FormLogin />,
            },
            {
                path: '/login',
                element: <FormLogin />,
            },
            {
                path: '/bordero',
                element: <FormOperacaoCheque />,
            },
            {
                path: '/cadastro-usuario',
                element: <FormCadastroUsuario />,
            },

            {
                path: '/cadastro-cliente',
                element: <FormCliente />,
            },
            {
                path: '/emprestimo',
                element: <FormOperacionalEmprestimo />,
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
