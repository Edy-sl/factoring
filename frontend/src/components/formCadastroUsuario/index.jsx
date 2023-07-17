import { useRef } from 'react';
import React from 'react';
import './formCadastroUsuario.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { apiFactoring } from '../../services/api';

export const FormCadastroUsuario = () => {
    const navigate = useNavigate();
    const ref = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const DadosCadUsuario = ref.current;

        let email = DadosCadUsuario.email.value;
        let password = DadosCadUsuario.password.value;
        let passwordConfirma = DadosCadUsuario.passwordConfirma.value;

        function isValidEmail(email) {
            return /\S+@\S+\.\S+/.test(email);
        }
        if (isValidEmail(email)) {
            if (password === passwordConfirma && password.length > 0) {
                cadastrarUsuario(email, password);
            } else {
                toast.error('As senha não conferem!');
            }
        } else {
            toast.error('Digite um e-mail válido!');
        }
    };

    const cadastrarUsuario = async (email, password) => {
        await apiFactoring
            .post('/cad-usuario', {
                email: email,
                senha: password,
            })
            .then(({ data }) => {
                if (data.code) {
                    toast.error('Não foi possivel cadastrar este e-mail!');
                }
                if (!data.code) {
                    navigate('/login');
                }
            })
            .catch(({ data }) => toast.error(data));
    };

    return (
        <>
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />

            <form
                className="formCadastroUsuario"
                onSubmit={handleSubmit}
                ref={ref}
            >
                <input type="text" name="email" placeholder="Digite o e-mail" />
                <input
                    type="password"
                    name="password"
                    placeholder="Digite a senha"
                />
                <input
                    type="password"
                    name="passwordConfirma"
                    placeholder="Confirme a senha"
                />
                <button type="submit">Salvar</button>
                <Link id="linkCadastro" to="/login">
                    Já tenho cadastro - Ir para o Login
                </Link>
            </form>
        </>
    );
};
