import './relatorioChequeVencimento.css';
import { FiSearch, FiDollarSign } from 'react-Icons/fi';
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

export const RelatorioChequePorVencimento = () => {
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
                '/relatorio-cheque-vencimento',
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
                setListagem(data);
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
                    <label>Realtório de Cheques por Data de Vencimento</label>
                </div>
                <form className="" ref={ref} onSubmit={handleSubmit}>
                    <div className="boxRow">
                        <div className="boxCol">
                            <label>Devolvido</label>
                            <label>Recebido</label>
                            <label>Geral</label>
                        </div>

                        <div className="boxCol" id="divCheckbox">
                            {checkRel == 'DEVOLVIDO' ? (
                                <input
                                    type="checkbox"
                                    name="chekeDevolvido"
                                    checked
                                    id="checkRel"
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    name="chekedDevolvido"
                                    id="checkRel"
                                    onChange={(e) => setCheckRel('DEVOLVIDO')}
                                />
                            )}

                            {checkRel == 'RECEBIDO' ? (
                                <input
                                    type="checkbox"
                                    name="chekedRecebido"
                                    id="checkRel"
                                    checked
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    name="chekedRecebido"
                                    id="checkRel"
                                    onChange={(e) => setCheckRel('RECEBIDO')}
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
                                <FiSearch
                                    className="icone2"
                                    onClick={checkRel && relatorioPorData}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>{' '}
            <GridChequeRelatorio listagem={listagem} />
        </>
    );
};
