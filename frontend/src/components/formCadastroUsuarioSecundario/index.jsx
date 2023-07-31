import { useRef } from 'react';
import React from 'react';
import './formCadastroUsuarioSecundario.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { apiFactoring } from '../../services/api';

export const FormCadastroUsuarioSecundario = () => {
    const navigate = useNavigate();
    const ref = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const DadosCadUsuario = ref.current;

        let nome = DadosCadUsuario.nome.value;
        let password = DadosCadUsuario.password.value;
        let idFactoring = localStorage.getItem('factoring');

        let passwordConfirma = DadosCadUsuario.passwordConfirma.value;

        if (password === passwordConfirma && password.length > 0) {
            cadastrarUsuario();
        } else {
            toast.error('As senha não conferem!');
        }
    };

    const cadastrarUsuario = async () => {
        const DadosCadUsuario = ref.current;

        const nome = DadosCadUsuario.nome.value;
        const password = DadosCadUsuario.password.value;
        const idFactoring = localStorage.getItem('factoring');

        await apiFactoring
            .post(
                '/cad-usuario-secundario',
                {
                    nome: nome,
                    senha: password,
                    idFactoring: idFactoring,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                toast.success(data);
            })
            .catch(({ data }) => toast.error('Não foi possível gravar!'));
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
                <input type="text" name="nome" placeholder="Digite o Nome" />
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
            </form>
        </>
    );
};
