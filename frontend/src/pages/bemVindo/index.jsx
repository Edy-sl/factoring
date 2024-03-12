import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authContext';
import { FormFactoring } from '../../components/formFactoring';
import { FormLogin } from '../../components/formLogin';
import { apiFactoring } from '../../services/api';
import { Calculadora } from '../../components/calculadora/calculadora';
import './bemVindo.css';

export const BemVindo = () => {
    const { autenticado, factoring } = useContext(AuthContext);

    return (
        <>
            {!autenticado && <FormLogin />}

            {factoring !== 'null' && autenticado == true && (
                <div id="divBemVindo">
                    <h1>Seja bem vindo!</h1>
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
