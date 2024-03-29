import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { apiFactoring } from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState();
    const [factoring, setFactoring] = useState(null);

    const navigate = useNavigate();

    const signIn = async (DadosLogin) => {
        console.log(import.meta.env.URL_API);
        const res = await apiFactoring
            .post('/login', {
                nome: DadosLogin.nome.value,
                senha: DadosLogin.password.value,
            })
            .then(({ data }) => {
                setUser(data.token);
                setAuth(data.auth);
                setFactoring(data.factoring);

                toast.success(data);
                if (data.auth == true) {
                    navigate('/');
                    window.location.reload();
                }
            })
            .catch(({ data }) => toast.error(data));
    };

    useEffect(() => {
        const recoverUser = localStorage.getItem('user');
        const recoverAuth = localStorage.getItem('logado');
        const recoverFactoring = localStorage.getItem('factoring');

        if (recoverUser) {
            setUser(recoverUser);
            setAuth(recoverAuth);
            setFactoring(recoverFactoring);
        }
        setLoading(false);
    }, []);

    if (user) {
        localStorage.setItem('user', user);
        localStorage.setItem('logado', auth);
        localStorage.setItem('factoring', factoring);
    }

    const signOut = () => {
        localStorage.removeItem('logado');
        localStorage.removeItem('user');
        localStorage.removeItem('factoring');

        setUser(null);
        setAuth();
        setFactoring('null');

        window.location.reload();
    };

    const loginSemSenha = async () => {
        if (
            localStorage.getItem('user') != null &&
            localStorage.getItem('user') != ''
        ) {
            await apiFactoring
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
                    setUser(data.token);
                    setAuth(data.auth);
                    setFactoring(data.factoring);
                    localStorage.setItem('gravarDoc', 'false');
                })
                .catch((data) => {
                    toast.error(data);
                    localStorage.setItem('user', '');
                    localStorage.setItem('logado', false);
                    console.log('nao logou');
                    window.location.reload();
                });
        }
    };

    useEffect(() => {
        loginSemSenha();
    }, []);

    setInterval(function () {
        if (auth == true) {
            loginSemSenha();
        }
    }, 600000); //600000 = 10 minutos

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                autenticado: !!auth,
                user,
                factoring,
                setFactoring,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
