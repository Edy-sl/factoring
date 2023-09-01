import React, { useEffect } from 'react';
import { useRef, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';
import './formLogin.css';

export const FormLogin = (sair) => {
    const { signIn, signOut } = useContext(AuthContext);
    const [logoff, setLogoff] = useState();

    console.log(sair);

    const ref = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const DadosLogin = ref.current;

        let nome = DadosLogin.nome.value;

        signIn(DadosLogin);

        /*  function isValidEmail(email) {
            return /\S+@\S+\.\S+/.test(email);
        }
        if (isValidEmail(email)) {
            // postLogin(DadosLogin)
            signIn(DadosLogin);
            console.log('tudo ok');
        } else {
            toast.error('Digite um e-mail válido!');
        }*/
    };

    return (
        <>
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            <form className="formLogin" onSubmit={handleSubmit} ref={ref}>
                <input type="text" name="nome" placeholder="Digite o Usuário" />
                <input
                    type="password"
                    name="password"
                    placeholder="Digite a senha"
                />

                <button type="submit">Entrar</button>

                <Link id="linkCadastro" to="/cadastro-usuario">
                    Cadastrar usuário Admin
                </Link>
            </form>
        </>
    );
};
