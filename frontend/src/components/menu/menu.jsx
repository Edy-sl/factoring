import './menu.css';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';
import { ImExit } from 'react-icons/im';

export const Menu = () => {
    const { signOut } = useContext(AuthContext);

    const sair = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('factoring');
        localStorage.removeItem('logado');
    };

    return (
        <div className="">
            <ul id="nav">
                <li>
                    <a href="#">Clientes</a>
                    <ul>
                        <Link to="/cadastro-cliente">Cadastro</Link>
                        <Link to="/taxa-cliente">Taxas</Link>
                    </ul>
                </li>

                <li>
                    <a href="#">Empréstimos</a>
                    <ul>
                        <Link to="/emprestimo">Lançamento</Link>
                        <label>-------------------</label>
                        <Link to="/relatorio-emprestimo-vencimento">
                            Relatório por Vencimento
                        </Link>

                        <Link to="/relatorio-emprestimo-emissao">
                            Relatório por Emissão
                        </Link>
                        <label>-------------------</label>
                        <Link to="/relatorio-emprestimo-cliente-vencimento">
                            Relatório por Cliente / Vencimento
                        </Link>
                        <Link to="/relatorio-emprestimo-cliente-emissao">
                            Relatório por Cliente / Emissão
                        </Link>
                    </ul>
                </li>

                <li>
                    <a href="#">Cheques</a>
                    <ul>
                        <Link to="/bordero">Lançamento</Link>
                        <a href="#">Relatório</a>
                    </ul>
                </li>

                <li>
                    <a href="#">Empresa</a>
                    <ul>
                        <Link to="/empresa">
                            <label>Empresa</label>
                        </Link>
                        <Link to="/permissoes">Permissões</Link>
                        <Link to="/cadastro-usuario-secundario">
                            Cadastro de Usuários
                        </Link>
                    </ul>
                </li>

                <li>
                    <a id="sair" onClick={signOut}>
                        Sair
                    </a>
                </li>
            </ul>
        </div>
    );
};
