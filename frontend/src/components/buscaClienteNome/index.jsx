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

export const BuscaClienteNomeDireto = ({
    setFormBuscaDireto,
    setIdCliente,
    clienteFiltrado,
}) => {
    const { signOut } = useContext(AuthContext);

    const ref = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleSel = (idCli) => {
        setIdCliente(idCli);
        setFormBuscaDireto(false);
    };

    return (
        <div className="divBuscaNomeDireto">
            <div className="divResultadoBuscaCliente">
                {clienteFiltrado.map((cli, index) => (
                    <div
                        className="divNomes"
                        key={index}
                        onClick={() => handleSel(cli.idcliente)}
                    >
                        <input
                            type="text"
                            id={`inputCliente` + index}
                            value={cli.nome}
                            spellCheck="false"
                            onChange={(e) => e.target.value(cli.nome)}
                            onKeyDown={(e) => {
                                keyDown(
                                    e,
                                    'inputCliente',
                                    'cliente',
                                    `inputCliente` + (index + 1),
                                    `inputCliente` + (index - 1)
                                );

                                if (e.key === 'Enter') {
                                    handleSel(cli.idcliente);
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
