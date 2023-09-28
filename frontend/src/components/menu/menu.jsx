import './menu.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { Link, Navigate } from 'react-router-dom';
import { FiMonitor } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FormLogin } from '../formLogin';
import { toast } from 'react-toastify';

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

    const vefificarPendencia = (pagina) => {
        console.log(pagina);

        if (pagina == 'sair' && localStorage.getItem('gravarDoc') != 'true') {
            signOut();
        } else {
            if (localStorage.getItem('gravarDoc') != 'true') {
                navigate(pagina);
            } else {
                // alert('Grave ou Feche a operação!');
                toast.error('Grave ou Feche a operação!');
            }
        }
    };

    return (
        <div className="">
            <ul id="nav">
                <li>
                    <a>Clientes</a>
                    <ul>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia('/cadastro-cliente')
                            }
                        >
                            Cadastro
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) => vefificarPendencia('/taxa-cliente')}
                        >
                            Taxas
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia('/relatorio-clientes')
                            }
                        >
                            Relatório de Clientes
                        </Link>
                    </ul>
                </li>

                <li>
                    <a>Conta</a>
                    <ul>
                        <Link
                            to="#"
                            onClick={(e) => vefificarPendencia('/conta')}
                        >
                            Lançamento
                        </Link>

                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia('/relatorio-lancamento')
                            }
                        >
                            Relatório por Cliente
                        </Link>
                    </ul>
                </li>

                <li>
                    <a>Empréstimos</a>
                    <ul>
                        <Link
                            to="#"
                            onClick={(e) => vefificarPendencia('/emprestimo')}
                        >
                            Lançamento
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia(
                                    '/relatorio-emprestimo-vencimento'
                                )
                            }
                        >
                            Relatório por Vencimento
                        </Link>

                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia(
                                    '/relatorio-emprestimo-emissao'
                                )
                            }
                        >
                            Relatório por Emissão
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia(
                                    '/relatorio-emprestimo-cliente-vencimento'
                                )
                            }
                        >
                            Relatório por Cliente / Vencimento
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia(
                                    '/relatorio-emprestimo-cliente-emissao'
                                )
                            }
                        >
                            Relatório por Cliente / Emissão
                        </Link>
                    </ul>
                </li>

                <li>
                    <a>Cheques</a>
                    <ul>
                        <Link
                            to="#"
                            onClick={(e) => vefificarPendencia('/bordero')}
                        >
                            Lançamento
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) => vefificarPendencia('/devolucao')}
                        >
                            Devolução
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) => vefificarPendencia('/pagamento')}
                        >
                            Pagamento
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia(
                                    '/relatorio-cheque-vencimento'
                                )
                            }
                        >
                            Relatório por Vencimento
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia('/relatorio-cheque-emissao')
                            }
                        >
                            Relatório por Emissao Op.
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia(
                                    '/relatorio-cheque-cliente-vencimento'
                                )
                            }
                        >
                            Relatório por Cliente / Vencimento
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia(
                                    '/relatorio-cheque-cliente-emissao'
                                )
                            }
                        >
                            Relatório por Cliente / Emissão op.
                        </Link>
                    </ul>
                </li>
                <li>
                    {' '}
                    <a>Movimentação</a>
                    <ul>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia(
                                    '/relatorio-movimento-vencimento'
                                )
                            }
                        >
                            Relatório por Vencimento
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia(
                                    '/relatorio-movimento-emissao'
                                )
                            }
                        >
                            Relatório por Emissao
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia(
                                    '/relatorio-movimento-pagamento'
                                )
                            }
                        >
                            Relatório por Pagamento
                        </Link>
                    </ul>
                </li>

                <li>
                    <a>Empresa</a>
                    <ul>
                        <Link
                            to="#"
                            onClick={(e) => vefificarPendencia('/empresa')}
                        >
                            Cadastro da Empresa
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) => vefificarPendencia('/permissoes')}
                        >
                            Permissões
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                vefificarPendencia(
                                    '/cadastro-usuario-secundario'
                                )
                            }
                        >
                            Cadastro de Usuários
                        </Link>
                    </ul>
                </li>

                <li>
                    <a id="sair" onClick={(e) => vefificarPendencia('sair')}>
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
