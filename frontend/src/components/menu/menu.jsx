import './menu.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { Link, Navigate } from 'react-router-dom';
import { FiMonitor } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FormLogin } from '../formLogin';
import { toast } from 'react-toastify';
import { apiFactoring } from '../../services/api';

export const Menu = () => {
    const navigate = useNavigate();

    const [calc, setCalc] = useState(false);

    const loginSemSenha = () => {
        apiFactoring
            .post(
                '/login-sem-senha',
                {},
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                localStorage.setItem('user', data.token);
            })
            .catch((err) => signOut());
    };

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

    const calculadora = () => {
        setCalc(!calc);
    };

    useEffect(() => {
        fullScreen();
    }, [telaCheia]);

    setInterval(function () {
        loginSemSenha();
    }, 550000);

    const verificarPendencia = (pagina) => {
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
                                verificarPendencia('/cadastro-cliente')
                            }
                        >
                            Cadastro
                        </Link>

                        <Link
                            to="#"
                            onClick={(e) => verificarPendencia('/taxa-cliente')}
                        >
                            Taxa e Limite
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia('/relatorio-clientes')
                            }
                        >
                            Relatório de Clientes
                        </Link>
                    </ul>
                </li>
                <li>
                    <a>Emitentes</a>
                    <ul>
                        <Link
                            to="#"
                            onClick={(e) => verificarPendencia('/emitentes')}
                        >
                            Relatório de Emitentes
                        </Link>
                    </ul>
                </li>

                <li>
                    <a>Conta</a>
                    <ul>
                        <Link
                            to="#"
                            onClick={(e) => verificarPendencia('/conta')}
                        >
                            Lançamento
                        </Link>
                    </ul>
                </li>

                <li>
                    <a>Empréstimos</a>
                    <ul>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia('/emprestimo/dinheiro')
                            }
                        >
                            Lançamento
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-emprestimo-vencimento/dinheiro'
                                )
                            }
                        >
                            Relatório por Vencimento
                        </Link>

                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-emprestimo-emissao/dinheiro'
                                )
                            }
                        >
                            Relatório por Emissão
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-emprestimo-cliente-vencimento/dinheiro'
                                )
                            }
                        >
                            Relatório por Cliente / Vencimento
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-emprestimo-cliente-emissao/dinheiro'
                                )
                            }
                        >
                            Relatório por Cliente / Emissão
                        </Link>
                    </ul>
                </li>

                <li>
                    <a>Veículos</a>
                    <ul>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia('/financiamento/veiculo')
                            }
                        >
                            Lançamento
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-emprestimo-emissao/veiculo'
                                )
                            }
                        >
                            Relatório por Emissão
                        </Link>

                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-emprestimo-vencimento/veiculo'
                                )
                            }
                        >
                            Relatório por Vencimento
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-emprestimo-cliente-vencimento/veiculo'
                                )
                            }
                        >
                            Relatório por Cliente / Vencimento
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-emprestimo-cliente-emissao/veiculo'
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
                            onClick={(e) => verificarPendencia('/bordero')}
                        >
                            Lançamento
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) => verificarPendencia('/devolucao')}
                        >
                            Devolução
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) => verificarPendencia('/pagamento')}
                        >
                            Pagamento
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-cheque-vencimento'
                                )
                            }
                        >
                            Relatório por Vencimento
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia('/relatorio-cheque-emissao')
                            }
                        >
                            Relatório por Emissao Op.
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-cheque-cliente-vencimento'
                                )
                            }
                        >
                            Relatório por Cliente / Vencimento
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-cheque-cliente-emissao'
                                )
                            }
                        >
                            Relatório por Cliente / Emissão op.
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-cheque-emitente-vencimento'
                                )
                            }
                        >
                            Relatório por Emitente
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
                                verificarPendencia(
                                    '/relatorio-movimento-vencimento'
                                )
                            }
                        >
                            Relatório por Vencimento
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-movimento-emissao'
                                )
                            }
                        >
                            Relatório por Emissao
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-movimento-pagamento'
                                )
                            }
                        >
                            Relatório por Pagamento
                        </Link>
                        <label>-------------------</label>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/relatorio-movimento-cliente-vencimento'
                                )
                            }
                        >
                            Relatório por Cliente / Vencimento
                        </Link>
                    </ul>
                </li>

                <li>
                    <a>Empresa</a>
                    <ul>
                        <Link
                            to="#"
                            onClick={(e) => verificarPendencia('/empresa')}
                        >
                            Cadastro da Empresa
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) => verificarPendencia('/permissoes')}
                        >
                            Permissões
                        </Link>
                        <Link
                            to="#"
                            onClick={(e) =>
                                verificarPendencia(
                                    '/cadastro-usuario-secundario'
                                )
                            }
                        >
                            Cadastro de Usuários
                        </Link>
                    </ul>
                </li>

                <li>
                    <a id="sair" onClick={(e) => verificarPendencia('sair')}>
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
