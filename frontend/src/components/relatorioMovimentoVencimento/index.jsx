import './relatorioChequeVencimento.css';
import { FiSearch, FiDollarSign, FiPrinter } from 'react-Icons/fi';
import { useState, useRef, useEffect } from 'react';
import { apiFactoring } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GridChequeRelatorio } from '../gridRelatorioCheques';
import {
    converteFloatMoeda,
    inverteData,
    retornaDataAtual,
} from '../../biblitoteca.jsx';
import { GridRelatorioEmprestimo } from '../gridRelatorioEmprestimo';

import { impressaoMovimento } from '../menu/functions/impressaoMovimento';

export const RelatorioMovimentoPorVencimento = () => {
    const ref = useRef();

    const [listagemCheque, setListagemCheque] = useState([]);
    const [listagemEmprestimo, setListagemEmprestimo] = useState([]);

    const [dadosCheque, setDadosCheque] = useState([]);

    const [checkRel, setCheckRel] = useState('GERAL');

    const [dataIni, setDataIni] = useState(retornaDataAtual());
    const [dataFim, setDataFim] = useState(retornaDataAtual());

    var totalValorCheques = 0;
    var totalValorLiquido = 0;
    var totalValorJuros = 0;

    var totalValor = 0;
    var totalRecebido = 0;
    var totalReceber = 0;

    const [totalValorR, setTotalValorR] = useState(0);
    const [totalValorRecebido, setTotalValorRecebido] = useState(0);
    const [totalValorReceber, setTotalValorReceber] = useState(0);

    const [totalValCheques, setTotalValorCheques] = useState(0);
    const [totalValLiquido, setTotalValorLiquido] = useState(0);
    const [totalValJuros, setTotalValorJuros] = useState(0);

    const [idParcela, setIdParcela] = useState(0);
    const [parcelaN, setParcelaN] = useState(0);

    const [atualizaParcelas, setAtualizaParcelas] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const relatorioPorData = async () => {
        const dadosRelatorio = ref.current;
        var dataI = dadosRelatorio.dataI.value;
        var dataF = dadosRelatorio.dataF.value;

        await apiFactoring
            .post(
                '/relatorio-movimento-cheque-vencimento',
                {
                    dataI: dataI,
                    dataF: dataF,
                    status: checkRel,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                console.log(data);
                setListagemCheque(data);
            })
            .catch(({ data }) => {
                toast.error(data);
            });

        await apiFactoring
            .post(
                '/relatorio-movimento-emprestimo-vencimento',
                {
                    dataI: dataI,
                    dataF: dataF,
                    tipoRel: checkRel,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                console.log(data);
                setListagemEmprestimo(data);
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    return (
        <>
            {' '}
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            {idParcela != 0 && (
                <FormPagamentoCheque
                    parcelaN={parcelaN}
                    idParcela={idParcela}
                    setIdParcela={setIdParcela}
                    setAtualizaParcelas={setAtualizaParcelas}
                    atualizaParcelas={atualizaParcelas}
                />
            )}
            <div className="divRelatorioChequeData">
                <div id="divTituloRelatorio">
                    <label>Movimento por Data de Vencimento</label>
                </div>
                <form className="" ref={ref} onSubmit={handleSubmit}>
                    <div className="boxRow" id="divFiltroMovimentoEmissao">
                        <div className="boxCol">
                            <label>Geral</label>
                        </div>

                        <div className="boxCol" id="divCheckbox">
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
                                <FiSearch
                                    className="icone2"
                                    onClick={checkRel && relatorioPorData}
                                />{' '}
                                <FiPrinter
                                    className="icone2"
                                    onClick={(e) =>
                                        impressaoMovimento(
                                            listagemCheque,
                                            listagemEmprestimo
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <GridChequeRelatorio listagem={listagemCheque} />
            <GridRelatorioEmprestimo listagem={listagemEmprestimo} />
        </>
    );
};
