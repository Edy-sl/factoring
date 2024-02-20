import './relatorioEmprestimoVencimento.css';
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
export const RelatorioEmprestimoPorVencimento = () => {
    const ref = useRef();

    const [listagem, setListagem] = useState([]);

    const [checkRel, setCheckRel] = useState();

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

        await apiFactoring
            .post(
                '/relatorio-emprestimo-vencimento',
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
                setListagem(data);
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    useEffect(() => {
        !checkRel && setCheckRel('GERAL');
    }, []);

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
                <TituloTela tituloTela="Realtório de Empréstimo por Data de Vencimento" />

                <form className="" ref={ref} onSubmit={handleSubmit}>
                    <div id="divCentralizada">
                        <div className="boxCol">
                            <label>A Receber</label>
                            <label>Recebidos</label>
                            <label>Geral</label>
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
                                onClick={(e) => {
                                    impressaoRelEmprestimo(
                                        listagem,
                                        'Realtório de Empréstimo por Data de Vencimento de: ' +
                                            inverteData(dataIni) +
                                            ' - ' +
                                            inverteData(dataFim)
                                    );
                                }}
                            />
                        </div>
                    </div>
                </form>
            </div>{' '}
            <GridRelatorioEmprestimo listagem={listagem} />
        </div>
    );
};
