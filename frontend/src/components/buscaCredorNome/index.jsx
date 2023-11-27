import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { apiFactoring } from '../../services/api';
import { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { ImExit } from 'react-icons/im';
import './buscaClienteDireto.css';
import { FormCliente } from '../formCliente';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { keyDown } from '../../biblitoteca';

export const BuscaCredorNome = ({
    setBuscaCredor,
    setCnpjCpfCredor,
    credorFiltrado,
}) => {
    const { signOut } = useContext(AuthContext);
    const [clientes, setClientes] = useState(credorFiltrado);
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
            })
            .catch((error) => {
                toast.error(error.response.status);
                signOut();
            });
    };

    const handleSel = (cnpjCredor) => {
        setCnpjCpfCredor(cnpjCredor);
        setBuscaCredor(false);
    };

    useEffect(() => {}, [credorFiltrado]);

    return (
        <div className="divBuscaCredorNome">
            <div className="divResultadoBuscaCliente">
                {credorFiltrado.map((cli, index) => (
                    <div
                        className="divNomes"
                        key={cli.idcliente}
                        onClick={() => handleSel(cli.cnpj_cpf)}
                    >
                        <input
                            type="text"
                            id={`inputCredor` + index}
                            value={cli.nome}
                            spellCheck="false"
                            onChange={(e) => e.target.value(cli.nome)}
                            onKeyDown={(e) => {
                                keyDown(
                                    e,
                                    'inputCredor',
                                    'credor',
                                    `inputCredor` + (index + 1),
                                    `inputCredor` + (index - 1)
                                );

                                if (e.key === 'Enter') {
                                    handleSel(cli.cnpj_cpf);
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
