import './relatorioChequeVencimento.css';
import { FiSearch, FiDollarSign } from 'react-Icons/fi';
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

export const RelatorioChequePorVencimento = () => {
    const ref = useRef();

    const [listagem, setListagem] = useState([]);

    const [dadosCheque, setDadosCheque] = useState([]);

    const [checkRel, setCheckRel] = useState();

    const [dataIni, setDataIni] = useState(retornaDataAtual());
    const [dataFim, setDataFim] = useState(retornaDataAtual());

    var totalValorCheques = 0;
    var totalValorLiquido = 0;
    var totalValorJuros = 0;

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
                    <label>Realtório por Data de Vencimento</label>
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
            <div className="divListaRContainerCheque">
                <div className="gridChequeRelatorio">
                    <div>Banco</div>
                    <div className="alignCenter">N. Cheque</div>
                    <div>Nome</div>
                    <div className="alignRight">Vencimento</div>
                    <div className="alignRight">Valor</div>
                    <div className="alignRight">Prazo</div>
                    <div className="alignRight">V. Juros</div>
                    <div className="alignRight">V. Liquido</div>
                    <div className="alignRight">Status</div>
                    <div className="alignRight">Operação</div>
                    <div>Emissão</div>
                </div>
                <div className="divListaRcheques">
                    {listagem.map((item, index) => (
                        <div className="gridLinhaChequeRelatorio" key={index}>
                            <div>{item.nome_banco}</div>

                            <div className="alignCenter">
                                {item.numero_cheque}
                            </div>
                            <div id="maximo_200px">{item.nome_cheque}</div>

                            <div className="alignRight">
                                {inverteData(item.data_vencimento)}
                            </div>

                            <div className="alignRight">
                                {item.valor_cheque.toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                })}
                            </div>
                            <div className="alignRight">{item.dias} dias</div>
                            <div className="alignRight">
                                {item.valor_juros.toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                })}
                            </div>
                            <div className="alignRight">
                                {item.valor_liquido.toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                })}
                            </div>
                            <div className="alignRight">{item.status}</div>
                            <div className="alignRight">{item.idbordero}</div>
                            <div id="maximo_200px">
                                {inverteData(item.data)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="divTotaisRcheques" id="divListaRtotais">
                    <div className=""></div>
                    <div className=""></div>
                    <div className=""></div>
                    <div className=""></div>
                    <div className="alignRight">
                        {totalValCheques.toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        })}
                    </div>
                    <div className=""></div>
                    <div className="alignRight">
                        {totalValJuros.toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        })}
                    </div>
                    <div className="alignRight">
                        {totalValLiquido.toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        })}
                    </div>
                    <div className=""></div>

                    <div></div>
                    <div></div>
                </div>
            </div>
        </>
    );
};
