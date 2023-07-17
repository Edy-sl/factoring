import React from 'react';
import { useRef, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';
import './formlogin.css';
export const FormLogin = () => {
    const { signIn, autenticado, loading } = useContext(AuthContext);

    const ref = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const DadosLogin = ref.current;

        let email = DadosLogin.email.value;

        function isValidEmail(email) {
            return /\S+@\S+\.\S+/.test(email);
        }
        if (isValidEmail(email)) {
            // postLogin(DadosLogin)
            signIn(DadosLogin);
            console.log('tudo ok');
        } else {
            toast.error('Digite um e-mail válido!');
        }
    };

    return (
        <>
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            <form className="formLogin" onSubmit={handleSubmit} ref={ref}>
                <input type="text" name="email" placeholder="Digite o e-mail" />
                <input
                    type="password"
                    name="password"
                    placeholder="Digite a senha"
                />

                <button type="submit">Entrar</button>

                <Link id="linkCadastro" to="/recupera-senha">
                    Esqueci a senha!
                </Link>

                <Link id="linkCadastro" to="/cadastro-usuario">
                    Cadastrar uma conta de usuário!
                </Link>
            </form>
        </>
    );
};
