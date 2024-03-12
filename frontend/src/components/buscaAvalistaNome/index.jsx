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
import { FaLongArrowAltUp, FaLongArrowAltDown } from 'react-icons/fa';

export const BuscaAvalistaNome = ({
    setBuscaAvalista,
    setCnpjCpfAvalista,
    avalistaFiltrado,
}) => {
    const { signOut } = useContext(AuthContext);
    const [clientes, setClientes] = useState(avalistaFiltrado);
    const ref = useRef();
    const dadosCliente = ref.current;

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleSel = (cnpjAvalista) => {
        setCnpjCpfAvalista(cnpjAvalista);
        setBuscaAvalista(false);
    };

    return (
        <div className="divBuscaAvalistaNome">
            <label id="labelInfo">
                Utilize
                <FaLongArrowAltUp />
                <FaLongArrowAltDown />
                para navegar e ENTER para selecionar
            </label>
            <div className="divResultadoBuscaCliente">
                {avalistaFiltrado.map((cli, index) => (
                    <div
                        className="divNomes"
                        key={cli.idcliente}
                        onClick={() => handleSel(cli.cnpj_cpf)}
                    >
                        <input
                            type="text"
                            id={`inputAvalista` + index}
                            value={cli.nome}
                            spellCheck="false"
                            onChange={(e) => e.target.value(cli.nome)}
                            onKeyDown={(e) => {
                                keyDown(
                                    e,
                                    'inputAvalista',
                                    'avalista',
                                    `inputAvalista` + (index + 1),
                                    `inputAvalista` + (index - 1)
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
