import React from 'react';
import './formLogin.css';
export const FormLogin = () => {
    return (
        <>
            <form className="formLogin">
                <input type="text" name="email" placeholder="Digite o e-mail" />
                <input
                    type="password"
                    name="password"
                    placeholder="Digite a senha"
                />

                <button type="submit">Entrar</button>
            </form>
        </>
    );
};
