import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { apiFactoring } from '../../services/api';
import { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { ImExit } from 'react-icons/im';

import { FormCliente } from '../formCliente';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { keyDown } from '../../biblitoteca';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';

export const BuscaEmitente = (props) => {
    const { signOut } = useContext(AuthContext);
    const [emitente, setEmitente] = useState([]);
    const ref = useRef();
    const dadosCliente = ref.current;

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleSel = (nomeSelecionado) => {
        let arrayEmitente = [];

        if (props.listaEmitente) {
            if (props.listaEmitente) {
                props.listaEmitente.map((E) => {
                    arrayEmitente = [
                        ...arrayEmitente,
                        {
                            emitente: E.emitente,
                        },
                    ];
                });
            }
            arrayEmitente = [...arrayEmitente, { emitente: nomeSelecionado }];
            props.setListaEmitente(arrayEmitente);
        }

        props.setNomeEmitente(nomeSelecionado);

        props.setFormBusca(false);

        //setFormBusca(false);
    };

    return (
        <div className="divBuscaNomeDireto">
            <label id="labelInfo">
                Utilize
                <FaLongArrowAltUp />
                <FaLongArrowAltDown />
                para navegar e ENTER para selecionar
            </label>
            <div className="divResultadoBuscaEmitente">
                {props.emitenteFiltrado.map((emitente, index) => (
                    <div
                        className="divNomes"
                        key={index}
                        onClick={() => handleSel(emitente.nome_cheque)}
                    >
                        <input
                            type="text"
                            id={`inputEmitente` + index}
                            $index
                            value={emitente.nome_cheque}
                            spellCheck="false"
                            onChange={(e) =>
                                e.target.value(emitente.nome_cheque)
                            }
                            onKeyDown={(e) => {
                                keyDown(
                                    e,
                                    'inputNomeC',
                                    'emitente',
                                    `inputEmitente` + (index + 1),
                                    `inputEmitente` + (index - 1)
                                );

                                if (e.key === 'Enter') {
                                    handleSel(emitente.nome_cheque);
                                    props.setFormBusca(false);
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
