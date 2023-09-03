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
import { GridChequeRelatorio } from '../gridRelatorioCheques';
import { impressaoRelCheque } from '../functions/impressaoRelCheque';

export const RelatorioChequePorEmissao = () => {
    const ref = useRef();

    const [listagem, setListagem] = useState([]);

    const [checkRel, setCheckRel] = useState();

    const [dataIni, setDataIni] = useState(retornaDataAtual());
    const [dataFim, setDataFim] = useState(retornaDataAtual());

    const [idParcela, setIdParcela] = useState(0);
    const [parcelaN, setParcelaN] = useState(0);

    const [atualizaParcelas, setAtualizaParcelas] = useState(false);

    let newArray = [];

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const relatorioPorData = async () => {
        const dadosRelatorio = ref.current;
        var dataI = dadosRelatorio.dataI.value;
        var dataF = dadosRelatorio.dataF.value;

        await apiFactoring
            .post(
                '/relatorio-cheque-emissao',
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
                        },
                    ];
                });
                setListagem(newArray);
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
                    <label>
                        Realtório de Cheques por Data de Emissao da Operação
                    </label>
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

                            {checkRel == 'PAGO' ? (
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
                                    onChange={(e) => setCheckRel('PAGO')}
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

                                <FiPrinter
                                    className="icone2"
                                    onClick={(e) =>
                                        impressaoRelCheque(
                                            listagem,
                                            'Realtório de Cheques por Data de Emissao da Operação de: ' +
                                                inverteData(dataIni) +
                                                ' a ' +
                                                inverteData(dataFim)
                                        )
                                    }
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
