import { useEffect, useState } from 'react';
import { inverteData } from '../../biblitoteca';

import { apiFactoring } from '../../services/api';
import './relatorioClientes.css';
import { Link } from 'react-router-dom';
import { ImExit } from 'react-icons/im';
import { TituloTela } from '../titulosTela/tituloTela';

export const RelatorioClientes = () => {
    const [listaClientes, setListaClientes] = useState([]);

    useEffect(() => {
        listaCliente();
    }, []);

    const listaCliente = async () => {
        await apiFactoring
            .post(
                '/lista-clientes',
                {},
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setListaClientes(data);
            })
            .catch();
    };

    return (
        <form>
            <TituloTela tituloTela="Relatório de Clientes" />
            <div className="gridTituloListaClientes">
                <div>Código</div>
                <div>Nome</div>
                <div className="alignCenter">Data Cadastro</div>
                <div className="alignCenter">Taxa</div>
                <div className="alignCenter">Especial</div>
                <div className="alignCenter">Telefone</div>
            </div>
            <div className="gridContainerListaCientes">
                {listaClientes.map((lista, index) => (
                    <div key={lista.index} className="gridListaClientes">
                        <div>{lista.idcliente}</div>
                        <div>{lista.nome}</div>
                        <div className="alignCenter">{lista.data_cadastro}</div>
                        <div className="alignCenter">{lista.taxa_juros}</div>
                        <div className="alignCenter">{lista.especial}</div>
                        <div className="alignCenter">{lista.telefone}</div>
                    </div>
                ))}
            </div>
        </form>
    );
};
