import './menu.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';

export const Menu = () => {
    const { signOut } = useContext(AuthContext);

    const sair = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('factoring');
        localStorage.removeItem('logado');
    };

    return (
        <div className="divMenu">
            <Link to="/cadastro-cliente">Cliente</Link>
            <Link to="/bordero">Cheques</Link>
            <Link to="/devolucao">Devolução</Link>
            <Link to="/emprestimo">Emprestimo</Link>
            <h1>-------</h1>
            <Link to="/empresa">Empresa</Link>
            <Link to="/permissoes">Permissões</Link>
            <button id="btnSair" onClick={signOut}>
                sair
            </button>
        </div>
    );
};
