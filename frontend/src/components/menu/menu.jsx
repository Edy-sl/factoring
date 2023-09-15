import './menu.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { Link, Navigate } from 'react-router-dom';
import { FiMonitor } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FormLogin } from '../formLogin';

export const Menu = () => {
    const navigate = useNavigate();

    const [telaCheia, setTelaCheia] = useState(false);

    const { signOut } = useContext(AuthContext);

    const fullScreen = () => {
        if (telaCheia) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.fullscreenElement != null) {
                document.exitFullscreen();
            }
        }
    };

    const fullScr = () => {
        setTelaCheia(!telaCheia);
    };

    useEffect(() => {
        fullScreen();
    }, [telaCheia]);

    return (
        <div className="">
            <ul id="nav">
                <li>
                    <a href="#">Clientes</a>
                    <ul>
                        <Link to="/cadastro-cliente">Cadastro</Link>
                        <Link to="/taxa-cliente">Taxas</Link>
                        <label>-------------------</label>
                        <Link to="/relatorio-clientes">
                            Relatório de Clientes
                        </Link>
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
                        <Link to="/devolucao">Devolução</Link>
                        <Link to="/pagamento">Pagamento</Link>
                        <label>-------------------</label>
                        <Link to="/relatorio-cheque-vencimento">
                            Relatório por Vencimento
                        </Link>
                        <Link to="/relatorio-cheque-emissao">
                            Relatório por Emissao Op.
                        </Link>
                        <label>-------------------</label>
                        <Link to="/relatorio-cheque-cliente-vencimento">
                            Relatório por Cliente / Vencimento
                        </Link>
                        <Link to="/relatorio-cheque-cliente-emissao">
                            Relatório por Cliente / Emissão op.
                        </Link>
                    </ul>
                </li>
                <li>
                    {' '}
                    <a href="#">Movimentação</a>
                    <ul>
                        <Link to="/relatorio-movimento-vencimento">
                            Relatório por Vencimento
                        </Link>
                        <Link to="/relatorio-movimento-emissao">
                            Relatório por Emissao
                        </Link>
                        <Link to="/relatorio-movimento-pagamento">
                            Relatório por Pagamento
                        </Link>
                    </ul>
                </li>

                <li>
                    <a href="#">Empresa</a>
                    <ul>
                        <Link to="/empresa">Cadastro da Empresa</Link>
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
                <li>
                    <a>
                        <FiMonitor id="fullScreen" onClick={fullScr} />
                    </a>
                </li>
            </ul>
        </div>
    );
};
