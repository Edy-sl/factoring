import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { FormFactoring } from '../../components/formFactoring';
import { FormLogin } from '../../components/formLogin';

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
