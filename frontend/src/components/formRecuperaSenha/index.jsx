import './formRecuperaSenha.css';
import { useRef } from 'react';

export const FormRecuperaSenha = () => {
    const ref = useRef();
    const DadosForm = ref.current;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(DadosForm.email.value);
    };

    return (
        <>
            <form
                className="formRecuperaSenha"
                onSubmit={handleSubmit}
                ref={ref}
            >
                <input type="text" name="email" placeholder="Digite o email" />
                <button type="submit">Recuperar</button>
            </form>
        </>
    );
};
