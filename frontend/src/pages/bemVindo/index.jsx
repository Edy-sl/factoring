import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authContext';
import { FormFactoring } from '../../components/formFactoring';
import { FormLogin } from '../../components/formLogin';
import { apiFactoring } from '../../services/api';
import { Calculadora } from '../../components/calculadora/calculadora';

import {
    FaCar,
    FaRegMoneyBillAlt,
    FaMoneyCheck,
    FaAddressBook,
} from 'react-icons/fa';
import { FaChartColumn } from 'react-icons/fa6';
import './bemVindo.css';
import { Link } from 'react-router-dom';

export const BemVindo = () => {
    const { autenticado, factoring } = useContext(AuthContext);

    return (
        <>
            {!autenticado && <FormLogin />}

            {factoring !== 'null' && autenticado == true && (
                <div id="divBemVindo">
                    <div id="divBotoesI">
                        <Link to="cadastro-cliente">
                            <div id="divBtnI">
                                <FaRegMoneyBillAlt size="30" />
                                Clientes
                            </div>
                        </Link>
                        <Link to="emprestimo/dinheiro">
                            <div id="divBtnI">
                                <FaRegMoneyBillAlt size="30" />
                                Empréstimo
                            </div>
                        </Link>
                        <Link to="emprestimo/veiculo">
                            <div id="divBtnI">
                                <FaCar size="30" />
                                Veículos
                            </div>
                        </Link>
                        <Link to="/bordero">
                            <div id="divBtnI">
                                <FaMoneyCheck size="30" />
                                Cheques
                            </div>
                        </Link>
                        <Link to="/relatorio-movimento-emissao">
                            <div id="divBtnI">
                                <FaChartColumn size="30" />
                                Movimentação
                            </div>
                        </Link>
                    </div>

                    <div id="divAtalhos">
                        Atalhos<br></br>
                        F11 Tela Cheia <br></br>
                        Ctrl+ aumentar zoom <br></br>Ctrl- diminuir zoom
                    </div>
                </div>
            )}

            {factoring == 'null' && autenticado && <FormFactoring />}
        </>
    );
};
