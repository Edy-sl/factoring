import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authContext';
import { FormFactoring } from '../../components/formFactoring';
import { FormLogin } from '../../components/formLogin';
import { apiFactoring } from '../../services/api';
import { Calculadora } from '../../components/calculadora/calculadora';

export const BemVindo = () => {
    const { autenticado, factoring } = useContext(AuthContext);

    return (
        <>
            {!autenticado && <FormLogin />}

            {factoring !== 'null' && autenticado == true && (
                <h1>Seja bem vindo!</h1>
            )}

            {factoring == 'null' && autenticado && <FormFactoring />}
        </>
    );
};
