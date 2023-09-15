import { useState, useEffect } from 'react';
import {
    converteFloatMoeda,
    inverteData,
    tamanhoMaximo,
} from '../../biblitoteca.jsx';

export const GridChequeRelatorio = ({ listagem = [] }) => {
    var totalValorCheques = 0;
    var totalValorLiquido = 0;
    var totalValorJuros = 0;

    const [totalValCheques, setTotalValorCheques] = useState(0);
    const [totalValLiquido, setTotalValorLiquido] = useState(0);
    const [totalValJuros, setTotalValorJuros] = useState(0);

    useEffect(() => {
        listagem.map((somaTotais) => {
            totalValorCheques =
                totalValorCheques + parseFloat(somaTotais.valor_cheque);
            totalValorLiquido =
                totalValorLiquido + parseFloat(somaTotais.valor_liquido);
            totalValorJuros =
                totalValorJuros + parseFloat(somaTotais.valor_juros);
        });
        setTotalValorCheques(totalValorCheques);
        setTotalValorLiquido(totalValorLiquido);
        setTotalValorJuros(totalValorJuros);
    }, [listagem]);

    return (
        <>
            <div className="divListaRContainerCheque" id="relCheques">
                <div className="gridChequeRelatorio">
                    <div>Banco</div>
                    <div className="alignCenter">N. Cheque</div>
                    <div>Emitente</div>
                    <div>Cliente</div>
                    <div className="alignCenter">Operação</div>
                    <div className="alignCenter">Data Op.</div>
                    <div className="alignCenter">Vencimento</div>
                    <div className="alignRight">Valor</div>
                    <div className="alignRight">Juros</div>
                </div>

                <div className="divListaRcheques">
                    {listagem.map((item, index) => (
                        <div className="gridLinhaChequeRelatorio" key={index}>
                            <div>{item.numero_banco}</div>

                            <div className="alignCenter">
                                {item.numero_cheque}
                            </div>
                            <div id="maximo_200px">
                                {tamanhoMaximo(item.nome_cheque, 19)}
                            </div>
                            <div id="maximo_200px">
                                {tamanhoMaximo(item.nome, 19)}
                            </div>

                            <div className="alignCenter">{item.idbordero}</div>
                            <div id="maximo_200px">
                                {inverteData(item.data)}
                            </div>

                            <div className="alignCenter ">
                                {inverteData(item.data_vencimento)}
                            </div>

                            <div className="alignRight">
                                {(item.valor_cheque * 1).toLocaleString(
                                    'pt-BR',
                                    {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                    }
                                )}
                            </div>

                            {item.idbordero_deducao > 0 ? (
                                <div className="jurosDeducao">
                                    {(item.valor_juros * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                            ) : (
                                <div className="alignRight">
                                    {(item.valor_juros * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="divTotaisRcheques" id="divListaRtotais">
                    <div></div>
                    <div className="alignCenter"></div>
                    <div></div>
                    <div></div>
                    <div className=""></div>
                    <div className="alignRight"></div>
                    <div></div>

                    <div className="alignRight">
                        {(totalValCheques * 1).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        })}
                    </div>

                    <div className="alignRight">
                        {(totalValJuros * 1).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};
