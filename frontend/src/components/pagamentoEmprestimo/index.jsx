import { useState, useRef, useEffect } from 'react';
import './pagamentoEmprestimo.css';
import { toFormData } from 'axios';
import {
    converteMoedaFloat,
    inverteData,
    retornaDataAtual,
} from '../../biblitoteca';
import { FiSearch, FiDollarSign } from 'react-icons/fi';
import { ImExit, ImBin } from 'react-icons/im';
import axios from 'axios';
import { apiFactoring } from '../../services/api';
import { toast } from 'react-toastify';
export const FormPagamentoEmprestimo = ({
    idParcela,
    setIdParcela,
    parcelaN,
    setAtualizaParcelas,
    atualizaParcelas,
    setPagamentoParcela,
}) => {
    const [idPagamento, setIdPagamento] = useState(0);

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
            .catch((error) => {
                toast.error(error.response.data);
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
                console.log(data);
            })
            .catch();
    };

    const excluirPagamento = async () => {
        await apiFactoring
            .post(
                '/excluir-pagamento-emprestimo',
                { idPagamento: idPagamento },
                { headers: { 'x-access-token': localStorage.getItem('user') } }
            )
            .then(({ data }) => toast.success(data))
            .catch((error) => {
                toast.error(error.response.data);
            });
        setIdPagamento(0);
    };

    useEffect(() => {
        const dadosPagamento = ref.current;
        dadosPagamento.dataPagamento.value = retornaDataAtual();
        listaPagamentos();
    }, [idParcela]);

    return (
        <div className="divPagamentoEmprestimo">
            {idPagamento != 0 && (
                <div>
                    <button id="btnConfirmaExclusao" onClick={excluirPagamento}>
                        Confirmar exclusão do Pagamento?
                    </button>
                </div>
            )}
            <div className="boxRow" id="divParcela">
                <div>Parcela Nº: {parcelaN}</div>
                <div>
                    <ImExit
                        className="icone"
                        onClick={(e) => {
                            setIdParcela(0);
                            setPagamentoParcela(false);
                        }}
                    />
                </div>
            </div>
            <form name="formPagamentos" onSubmit={handleSubmit} ref={ref}>
                <div className="boxRow">
                    <div className="boxCol">
                        &nbsp;Data
                        <input
                            type="date"
                            className="inputData"
                            id="inputDataPagamento"
                            name="dataPagamento"
                        />
                    </div>{' '}
                    <div className="boxCol">
                        &nbsp;Valor
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
                        <div
                            key={pagamento.idpagamento}
                            id="divItemPgtoEmprestimo"
                            className="boxRow"
                        >
                            <div className="alignLeft">
                                {inverteData(pagamento.data_pagamento)}
                            </div>

                            <div className="alignRight">
                                {(pagamento.valor_pago * 1).toLocaleString(
                                    'pt-BR',
                                    {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                    }
                                )}
                            </div>
                            <div className="alignRight">
                                <ImBin
                                    id="iconeDollarPagar"
                                    onClick={(e) => {
                                        setIdPagamento(pagamento.idpagamento);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
};
