import { useEffect, useRef, useState } from 'react';
import { apiFactoring } from '../../services/api';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TituloTela } from '../titulosTela/tituloTela';
import './emitentes.css';

export const Emitentes = () => {
    const [listaEmitentes, setListaEmitentes] = useState([]);

    const buscaEmitentes = async () => {
        apiFactoring
            .post(
                '/busca-emitentes',
                {},
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setListaEmitentes(data);
                console.log(data);
            })
            .catch();
    };

    useEffect(() => {
        buscaEmitentes();
    }, []);

    return (
        <>
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />

            <TituloTela tituloTela="Relatório de Emitentes" />
            <div id="divGridEmitentes">
                {listaEmitentes.map((emitentes, index) => (
                    <div id="divNomeEmitente" key={index}>
                        {emitentes.nome_cheque}
                    </div>
                ))}
            </div>
        </>
    );
};
