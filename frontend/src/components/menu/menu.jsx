import './menu.css';
import { Link } from 'react-router-dom';
export const Menu = () => {
    return (
        <div className="divMenu">
            <Link to="/cadastro-usuario">Cadastro de Usuario</Link>
            <Link to="/login">Login</Link>
            <Link to="/cadastro-cliente">Cadastro Cliente</Link>
            <Link to="/bordero">Cheques</Link>
            <Link to="/emprestimo">Emprestimo</Link>
        </div>
    );
};
