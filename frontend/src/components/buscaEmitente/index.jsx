import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { apiFactoring } from '../../services/api';
import { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { ImExit } from 'react-icons/im';
import '../buscaCliente/buscaClienteNome.css';
import { FormCliente } from '../formCliente';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

export const BuscaEmitente = ({ setFormBusca, setNomeEmitente }) => {
    const { signOut } = useContext(AuthContext);
    const [emitente, setEmitente] = useState([]);
    const ref = useRef();
    const dadosCliente = ref.current;

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const buscaEmitente = async () => {
        const dadosCliente = ref.current;
        const nome = dadosCliente.nome.value;
        await apiFactoring
            .post(
                '/lista-emitentes',
                { emitente: nome },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setEmitente(data);
            })
            .catch((error) => {
                toast.error(error.response.status);
                console.log(error.response.status);

                signOut();
            });
    };

    const handleSel = (nomeEmitente) => {
        setNomeEmitente(nomeEmitente);
        setFormBusca(false);
    };

    return (
        <div className="divBuscaNome">
            <form className="formBusca" onSubmit={handleSubmit} ref={ref}>
                <input
                    type="text"
                    id="inputNome"
                    name="nome"
                    placeholder="Digite o Nome do Emitente"
                />

                <FiSearch className="icone" onClick={buscaEmitente} />
                <ImExit className="icone" onClick={() => setFormBusca(false)} />
            </form>

            <div className="divResultadoBuscaCliente">
                {emitente.map((emitente, index) => (
                    <div
                        className="divNomes"
                        key={index}
                        onClick={() => handleSel(emitente.nome_cheque)}
                    >
                        <label id="labelNomeCli">{emitente.nome_cheque}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};
