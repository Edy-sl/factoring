import { FiSearch, FiCheck } from 'react-icons/fi';
import './pagamentoCheque.css';
import { useState, useRef } from 'react';
import { apiFactoring } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GravaPagamento } from '../gravaPagamento/inde';

export const PagamentoCheque = () => {
    const ref = useRef();
    const [cheques, setCheques] = useState([]);

    const buscaCheque = async () => {
        const dadosCheques = ref.current;

        await apiFactoring
            .post(
                '/busca-cheque-numero',
                { numero: dadosCheques.cheque.value },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setCheques(data);
                console.log(data);
            })
            .catch();
    };

    const handleNumeroCheuque = (e) => {
        const dadosCheque = ref.current;
        dadosCheque.cheque.value = formataCheque(e);
        console.log(e);
    };

    const formataCheque = (value) => {
        if (!value) return '';
        value = value.replace(/\D/g, '');
        value = value
            .replace(/(\d{6})(\d)/, '$1-$2')
            .replace(/(-\d{1})\d+?$/, '$1');
        return value;
    };

    return (
        <>
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />

            <div>
                <div id="divTituloPagamento">
                    <label>PAGAMENTO</label>
                </div>
                <form className="form" ref={ref}>
                    <div>
                        <label>Nº do Cheque</label>
                        <input
                            type="text"
                            name="cheque"
                            onKeyUp={(e) => handleNumeroCheuque(e.target.value)}
                        />
                        <FiSearch className="icone2" onClick={buscaCheque} />
                    </div>
                </form>
            </div>
            <div className="gridTituloChequePagamento">
                <div>Banco</div>
                <div>Cheque</div>
                <div>Valor</div>
                <div>Emitente</div>
                <div>Cliente</div>
                <div>Operação</div>
                <div className="alignCenter">Pagamento</div>
            </div>
            <div id="divGeralPagamentos">
                {cheques.map((cheq, index) => (
                    <div className="gridChequePagamento" key={index}>
                        <div>{cheq.nome_banco}</div>
                        <div>{cheq.numero_cheque}</div>
                        <div>{cheq.valor_cheque}</div>
                        <div>{cheq.nome_cheque}</div>
                        <div>{cheq.nome}</div>
                        <div className="alignCenter">{cheq.idbordero}</div>
                        <div className="alignCenter">
                            <GravaPagamento
                                key={cheq.index}
                                idlancamento={cheq.idlancamento}
                                dataPagamento={cheq.data_pagamento}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
