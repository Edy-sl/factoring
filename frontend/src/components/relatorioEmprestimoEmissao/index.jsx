import { FiSearch, FiDollarSign, FiPrinter } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { apiFactoring } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckboxPersonalizado } from '../checkbox/checkboxPersonalizado';
import {
    converteFloatMoeda,
    inverteData,
    retornaDataAtual,
} from '../../biblitoteca.jsx';
import { FormPagamentoEmprestimo } from '../pagamentoEmprestimo';
import { GridRelatorioEmprestimo } from '../gridRelatorioEmprestimo';
import { impressaoRelEmprestimo } from '../functions/impressaoRelEmprestimo';
import { TituloTela } from '../titulosTela/tituloTela.jsx';
import { useParams } from 'react-router-dom';
export const RelatorioEmprestimoPorEmissao = () => {
    const ref = useRef();

    const { tipo } = useParams();

    const [listagem, setListagem] = useState([]);

    const [checkRel, setCheckRel] = useState();

    const [dataIni, setDataIni] = useState(retornaDataAtual());
    const [dataFim, setDataFim] = useState(retornaDataAtual());

    let totalValor = 0;
    let totalRecebido = 0;
    let totalReceber = 0;
    let totalJuros = 0;

    const [totalValorR, setTotalValorR] = useState(0);
    const [totalValorRecebido, setTotalValorRecebido] = useState(0);
    const [totalValorReceber, setTotalValorReceber] = useState(0);
    const [totalValorJuros, setTotalValorJurosE] = useState();

    const [idParcela, setIdParcela] = useState(0);
    const [parcelaN, setParcelaN] = useState(0);

    const [atualizaParcelas, setAtualizaParcelas] = useState(false);

    const [nomeRelatorio, setNomeRelatorio] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const relatorioPorData = async () => {
        const dadosRelatorio = ref.current;
        var dataI = dadosRelatorio.dataI.value;
        var dataF = dadosRelatorio.dataF.value;

        await apiFactoring
            .post(
                '/relatorio-emprestimo-emissao',
                {
                    dataI: dataI,
                    dataF: dataF,
                    tipoRel: checkRel,
                    tipoEmprestimo: tipo,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                console.log(data);
                setListagem(data);
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    useEffect(() => {
        listagem.map((somaTotais) => {
            if (checkRel != 'AGRUPADO') {
                totalValor =
                    totalValor +
                    parseFloat(
                        (somaTotais.valor_total * 1) /
                            somaTotais.quantidade_parcelas
                    );

                totalRecebido =
                    totalRecebido + parseFloat(somaTotais.valor_pago * 1);
                totalReceber = totalValor - totalRecebido;
                totalJuros =
                    totalJuros +
                    parseFloat(
                        somaTotais.valor_juros / somaTotais.quantidade_parcelas
                    );
            } else {
                totalValor =
                    totalValor + parseFloat(somaTotais.valor_total * 1);

                console.log(totalValor);
                totalRecebido =
                    totalRecebido + parseFloat(somaTotais.valor_pago * 1);
                totalReceber = totalValor - totalRecebido;
                totalJuros = totalJuros + parseFloat(somaTotais.valor_juros);
            }
        });

        setTotalValorR(totalValor);
        setTotalValorRecebido(totalRecebido);
        setTotalValorReceber(totalReceber);
        setTotalValorJurosE(totalJuros);
    }, [listagem]);

    useEffect(() => {
        !checkRel && setCheckRel('GERAL');
    }, []);

    useEffect(() => {
        if (tipo == 'dinheiro') {
            setNomeRelatorio('Relatório de Empréstimo por data de Emissão');
        } else {
            setNomeRelatorio('Relatório de Financiamento por data de Emissão');
        }
    }, [tipo]);

    useEffect(() => {
        relatorioPorData();
    }, [checkRel]);

    return (
        <div id="divContainerRelatorio">
            {' '}
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            {idParcela != 0 && (
                <FormPagamentoEmprestimo
                    parcelaN={parcelaN}
                    idParcela={idParcela}
                    setIdParcela={setIdParcela}
                    setAtualizaParcelas={setAtualizaParcelas}
                    atualizaParcelas={atualizaParcelas}
                />
            )}
            <div className="divRelatorioEmprestimoData">
                {tipo == 'dinheiro' ? (
                    <TituloTela tituloTela="Realtório de Empréstimo por Data de Emissão" />
                ) : (
                    <TituloTela tituloTela="Realtório de Financiamento por Data de Emissão" />
                )}

                <form className="" ref={ref} onSubmit={handleSubmit}>
                    <div id="divCentralizada">
                        <div className="boxCol">
                            <label>A Receber</label>
                            <label>Recebidos</label>
                            <label>Geral</label>
                            <label>Agrupado</label>
                        </div>

                        <div className="boxCol" id="divCheckbox">
                            {checkRel == 'PAGAR' ? (
                                <input
                                    type="checkbox"
                                    name="chekedPagar"
                                    checked
                                    id="checkRel"
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    name="chekedPagar"
                                    id="checkRel"
                                    onChange={(e) => setCheckRel('PAGAR')}
                                />
                            )}

                            {checkRel == 'PAGAS' ? (
                                <input
                                    type="checkbox"
                                    name="chekedPagas"
                                    id="checkRel"
                                    checked
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    name="chekedPagas"
                                    id="checkRel"
                                    onChange={(e) => setCheckRel('PAGAS')}
                                />
                            )}

                            {checkRel == 'GERAL' ? (
                                <input
                                    type="checkbox"
                                    name="chekedGeral"
                                    id="checkRel"
                                    checked
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    name="chekedGeral"
                                    id="checkRel"
                                    onChange={(e) => setCheckRel('GERAL')}
                                />
                            )}
                            {checkRel == 'AGRUPADO' ? (
                                <input
                                    type="checkbox"
                                    name="chekedAgrupado"
                                    id="checkRel"
                                    checked
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    name="chekedAgrupado"
                                    id="checkRel"
                                    onChange={(e) => setCheckRel('AGRUPADO')}
                                />
                            )}
                        </div>

                        <div className="boxCol">
                            <label>Data Inicial</label>
                            <input
                                type="date"
                                value={dataIni}
                                name="dataI"
                                onChange={(e) => setDataIni(e.target.value)}
                            />
                        </div>
                        <div className="boxCol">
                            <label>Data Final</label>
                            <div className="row">
                                <input
                                    type="date"
                                    name="dataF"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                />
                            </div>
                        </div>
                        <div id="divBtnRel">
                            <FiSearch
                                className="icone3"
                                onClick={relatorioPorData}
                            />

                            <FiPrinter
                                className="icone3"
                                onClick={(e) =>
                                    impressaoRelEmprestimo(
                                        listagem,
                                        nomeRelatorio +
                                            ': ' +
                                            inverteData(dataIni) +
                                            ' - ' +
                                            inverteData(dataFim),
                                        checkRel,
                                        totalValorR,
                                        totalValorRecebido,
                                        totalValorReceber,
                                        totalValorJuros
                                    )
                                }
                            />
                        </div>
                    </div>
                </form>
            </div>{' '}
            <GridRelatorioEmprestimo listagem={listagem} checkRel={checkRel} />
        </div>
    );
};
