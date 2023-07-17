import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { apiFactoring } from '../../services/api';
import { useRef, useState } from 'react';
import { FiSearch } from 'react-Icons/fi';
import { ImExit } from 'react-icons/im';
import './BuscaClienteNome.css';
import { FormCliente } from '../formCliente';

export const BuscaClienteNome = ({ setFormBusca, setCpfCnpj }) => {
    const [clientes, setClientes] = useState([]);
    const ref = useRef();
    const dadosCliente = ref.current;

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const buscaClientePorNome = async () => {
        const dadosCliente = ref.current;
        const nome = dadosCliente.nome.value;
        await apiFactoring
            .post(
                '/busca-cliente-nome',
                {
                    nome: nome,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setClientes(data);
                console.log(clientes);
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const handleSel = (cpfCnpj) => {
        setCpfCnpj(cpfCnpj);
        setFormBusca(false);
    };

    return (
        <div className="divBuscaNome">
            <form className="formBusca" onSubmit={handleSubmit} ref={ref}>
                <input
                    type="text"
                    id="inputNome"
                    name="nome"
                    placeholder="Digite o Nome"
                />

                <FiSearch id="iconeLupa" onClick={buscaClientePorNome} />
                <ImExit id="iconeSair" onClick={() => setFormBusca(false)} />
            </form>
            <div className="divResultadoBuscaCliente">
                {clientes.map((cli) => (
                    <div
                        className="divNomes"
                        key={cli.idcliente}
                        onClick={() => handleSel(cli.cnpj_cpf)}
                    >
                        {cli.nome}
                    </div>
                ))}
            </div>
        </div>
    );
};
