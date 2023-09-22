import { FiSearch, FiPrinter } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { apiFactoring } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GridChequeRelatorio } from '../gridRelatorioCheques';
import {
    converteFloatMoeda,
    inverteData,
    retornaDataAtual,
    tamanhoMaximo,
} from '../../biblitoteca.jsx';
import { GridRelatorioEmprestimo } from '../gridRelatorioEmprestimo';
import { impressaoMovimento } from '../functions/impressaoMovimento';

export const RelatorioMovimentoPorEmissao = () => {
    const ref = useRef();

    const [listagemCheque, setListagemCheque] = useState([]);
    const [listagemChequeDeducao, setListagemChequeDeducao] = useState([]);
    const [listagemEmprestimo, setListagemEmprestimo] = useState([]);

    const [isCheckedDeducao, setIsCheckedDeducao] = useState(false);

    const [dataIni, setDataIni] = useState(retornaDataAtual());
    const [dataFim, setDataFim] = useState(retornaDataAtual());

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

        let newArray = [];

        await apiFactoring
            .post(
                '/relatorio-movimento-cheque-emissao',
                {
                    dataI: dataI,
                    dataF: dataF,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                console.log(data);
                data.map((item) => {
                    newArray = [
                        ...newArray,
                        {
                            numero_banco: item.numero_banco,
                            numero_cheque: item.numero_cheque,
                            nome_cheque: item.nome_cheque,
                            nome: item.nome,
                            idbordero: item.idbordero,
                            data: item.data,
                            data_vencimento: item.data_vencimento,
                            valor_cheque: item.valor_cheque,
                            valor_juros: item.valor_juros,
                            idbordero_deducao: '0',
                            valor_taxa: item.taxa_ted,
                        },
                    ];
                });
            })
            .catch(({ data }) => {
                toast.error(data);
            });

        await apiFactoring
            .post(
                '/relatorio-movimento-deducao-emissao',
                {
                    dataI: dataI,
                    dataF: dataF,
                    status: isCheckedDeducao,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                data.map((item) => {
                    newArray = [
                        ...newArray,
                        {
                            numero_banco: item.numero_banco,
                            numero_cheque: item.numero_cheque,
                            nome_cheque: item.nome_cheque,
                            nome: item.nome,
                            idbordero: item.idbordero,
                            data: item.data_deducao,
                            data_vencimento: 'DV-' + item.data_devolucao,
                            valor_cheque: item.valor_cheque,
                            valor_juros: item.juros_devolucao,
                            valor_taxa: item.taxa_ted,
                            idbordero_deducao: item.idbordero_deducao,
                        },
                    ];
                });
                console.log(newArray);
            })
            .catch(({ data }) => {
                toast.error(data);
            });

        await apiFactoring
            .post(
                '/relatorio-movimento-emprestimo-emissao',
                {
                    dataI: dataI,
                    dataF: dataF,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setListagemEmprestimo(data);
            })
            .catch(({ data }) => {
                toast.error(data);
            });

        setListagemCheque(newArray);
        console.log(listagemEmprestimo);
    };

    const handleOnChangeDeducao = () => {
        setIsCheckedDeducao(!isCheckedDeducao);
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
                    <label>Realtório por Data de Emissão</label>
                </div>
                <form className="" ref={ref} onSubmit={handleSubmit}>
                    <div className="boxRow" id="divFiltroMovimentoEmissao">
                        <div className="boxCol">
                            <label>Geral</label>
                            <label>Sem Dedução</label>
                        </div>

                        <div className="boxCol" id="divCheckbox">
                            <input
                                type="checkbox"
                                name="chekeboxGeral"
                                id="checkRel"
                                checked={!isCheckedDeducao}
                                onChange={handleOnChangeDeducao}
                            />

                            <input
                                type="checkbox"
                                name="checkboxDeducao"
                                id="checkRel"
                                checked={isCheckedDeducao}
                                onChange={handleOnChangeDeducao}
                            />
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
                                    onClick={relatorioPorData}
                                />
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
            <div id="divListagemMovimento">
                <GridChequeRelatorio listagem={listagemCheque} />
                <GridRelatorioEmprestimo listagem={listagemEmprestimo} />
            </div>
        </>
    );
};
