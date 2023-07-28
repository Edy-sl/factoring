import { useState, useRef, useEffect } from 'react';
import './pagamentoEmprestimo.css';
import { toFormData } from 'axios';
import { converteMoedaFloat, retornaDataAtual } from '../../biblitoteca';
import { FiSearch, FiDollarSign } from 'react-Icons/fi';
import { ImExit } from 'react-icons/im';
import axios from 'axios';
import { apiFactoring } from '../../services/api';
import { toast } from 'react-toastify';
export const FormPagamentoEmprestimo = ({
    idParcela,
    setIdParcela,
    parcelaN,
    setAtualizaParcelas,
    atualizaParcelas,
}) => {
    const ref = useRef();

    const [listaPagamento, setlistaPagamento] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const gravarPagamentoParcela = async () => {
        const dadosPagamento = ref.current;
        await apiFactoring
            .post(
                '/gravar-pagamento-parcela',
                {
                    idParcela: idParcela,
                    valorPago: converteMoedaFloat(
                        dadosPagamento.valorPago.value
                    ),
                    dataPagamento: dadosPagamento.dataPagamento.value,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                toast.success(data);
                listaPagamentos();
                setAtualizaParcelas(!atualizaParcelas);
            })
            .catch((data) => {
                toast.error(data);
            });
    };

    const listaPagamentos = async () => {
        await apiFactoring
            .post(
                'lista-pagamento-parcela',
                { idParcela: idParcela },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                var arrayPagamento = [];

                setlistaPagamento(data);
            })
            .catch();
    };

    useEffect(() => {
        const dadosPagamento = ref.current;
        dadosPagamento.dataPagamento.value = retornaDataAtual();
        listaPagamentos();
    }, [idParcela]);

    return (
        <div className="divPagamentoEmprestimo">
            <div className="boxRow" id="divParcela">
                <div>
                    <label>Parcela Nº: {parcelaN}</label>
                </div>
                <div>
                    <ImExit
                        className="icone"
                        onClick={(e) => setIdParcela(0)}
                    />
                </div>
            </div>
            <form name="formPagamentos" onSubmit={handleSubmit} ref={ref}>
                <div className="boxRow">
                    <div className="boxCol">
                        <label>Data</label>
                        <input
                            type="date"
                            className="inputData"
                            id="inputDataPagamento"
                            name="dataPagamento"
                        />
                    </div>{' '}
                    <div className="boxCol">
                        <label>Valor</label>
                        <div className="boxRow">
                            <input
                                type="text"
                                id="inputValorPago"
                                name="valorPago"
                            />

                            <FiDollarSign
                                className="icone"
                                onClick={gravarPagamentoParcela}
                            />
                        </div>
                    </div>
                </div>
                <div className="boxCol" id="divListaPagamentoParcela">
                    {listaPagamento.map((pagamento) => (
                        <div key={pagamento.idpagamento}>
                            <label>{pagamento.data_pagamento}</label>
                            <label>{pagamento.valor_pago}</label>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
};
