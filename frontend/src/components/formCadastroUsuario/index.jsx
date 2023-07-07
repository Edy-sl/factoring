import React from 'react';
import './formCadastroUsuario.css';
export const FormCadastroUsuario = () => {
    return (
        <>
            <form className="formCadastroUsuario">
                <input type="text" name="email" placeholder="Digite o e-mail" />
                <input
                    type="password"
                    name="password"
                    placeholder="Digite a senha"
                />
                <input
                    type="password"
                    name="confirma_password"
                    placeholder="Confirme a senha"
                />
                <button type="submit">Salvar</button>
            </form>
        </>
    );
};
