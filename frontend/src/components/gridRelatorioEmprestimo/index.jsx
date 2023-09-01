import { useState, useEffect } from 'react';
import {
    converteFloatMoeda,
    inverteData,
    tamanhoMaximo,
} from '../../biblitoteca.jsx';
import { FiSearch, FiDollarSign } from 'react-icons/fi';
import { FormPagamentoEmprestimo } from '../pagamentoEmprestimo/index.jsx';
import './gridRelatorioEmprestimo.css';
export const GridRelatorioEmprestimo = ({ listagem = [] }) => {
    let totalValor = 0;
    let totalRecebido = 0;
    let totalReceber = 0;
    let totalJuros = 0;

    const [idParcela, setIdParcela] = useState(0);
    const [parcelaN, setParcelaN] = useState(0);
    const [atualizaParcelas, setAtualizaParcelas] = useState(false);

    const [totalValorR, setTotalValorR] = useState();
    const [totalValorRecebido, setTotalValorRecebido] = useState();
    const [totalValorReceber, setTotalValorReceber] = useState();
    const [totalValorJuros, setTotalValorJurosE] = useState();

    useEffect(() => {
        listagem.map((somaTotais) => {
            totalValor = totalValor + parseFloat(somaTotais.valor);
            totalRecebido = totalRecebido + parseFloat(somaTotais.valor_pago);
            totalReceber = totalValor - totalRecebido;

            totalJuros =
                totalJuros +
                parseFloat(
                    somaTotais.valor_juros / somaTotais.quantidade_parcelas
                );
        });

        setTotalValorR(totalValor);
        setTotalValorRecebido(totalRecebido);
        setTotalValorReceber(totalReceber);
        setTotalValorJurosE(totalJuros);
    }, [listagem]);
    return (
        <>
            {' '}
            {idParcela != 0 && (
                <FormPagamentoEmprestimo
                    parcelaN={parcelaN}
                    idParcela={idParcela}
                    setIdParcela={setIdParcela}
                    setAtualizaParcelas={setAtualizaParcelas}
                    atualizaParcelas={atualizaParcelas}
                />
            )}
            <div className="boxCol" id="divContainerLista">
                <div className="divListaTitulo">
                    <div className="alignLeft">Operação</div>
                    <div className="alignLeft">Cliente</div>
                    <div className="alignRight">Parcela</div>
                    <div className="alignCenter">Data</div>
                    <div className="alignRight">Vencimento</div>
                    <div className="alignRight">Valor Total</div>
                    <div className="alignRight">Vl. Parcela</div>
                    <div className="alignRight">Vl. Juros</div>
                    <div className="alignRight">Recebido</div>
                    <div className="alignRight">A Receber</div>
                    <div className="alignRight"></div>
                </div>
                <div className="divListaRContainer">
                    {' '}
                    {listagem.map((lista, i) => (
                        <div key={i} className="divListaR">
                            <div className="alignLet">{lista.idemprestimo}</div>
                            <div className="alignLeft">
                                {tamanhoMaximo(lista.nome, 19)}
                            </div>
                            <div className="alignRight">
                                {lista.parcela}/{lista.quantidade_parcelas}
                            </div>
                            <div className="alignRight">
                                {inverteData(lista.data_cadastro)}
                            </div>
                            <div className="alignRight">
                                {inverteData(lista.vencimento)}
                            </div>
                            <div className="alignRight">
                                {(lista.valor_total * 1).toLocaleString(
                                    'pt-BR',
                                    {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                    }
                                )}
                            </div>
                            <div className="alignRight">
                                {(lista.valor * 1).toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                })}
                            </div>

                            <div className="alignRight">
                                {(
                                    (lista.valor_juros /
                                        lista.quantidade_parcelas) *
                                    1
                                ).toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                })}
                            </div>

                            <div className="alignRight">
                                {(lista.valor_pago * 1).toLocaleString(
                                    'pt-BR',
                                    {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                    }
                                )}
                            </div>
                            <div className="alignRight">
                                {(
                                    (lista.valor - lista.valor_pago) *
                                    1
                                ).toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                })}
                            </div>
                            <div className="alignRight">
                                <FiDollarSign
                                    id="iconeDollarPagar"
                                    onClick={(e) => {
                                        setIdParcela(lista.idparcela);
                                        setParcelaN(lista.parcela);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="divListaR" id="divListaRtotais">
                    <div className="alignLet"></div>
                    <div className="alignLeft"></div>
                    <div className="alignRight"></div>
                    <div className="alignRight"></div>
                    <div className="alignRight"></div>
                    <div className="alignRight"></div>
                    <div className="alignRight">
                        {(totalValorR * 1).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        })}
                    </div>

                    <div className="alignRight">
                        {(totalValorJuros * 1).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        })}
                    </div>

                    <div className="alignRight">
                        {(totalValorRecebido * 1).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        })}
                    </div>
                    <div className="alignRight">
                        {(totalValorReceber * 1).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};
