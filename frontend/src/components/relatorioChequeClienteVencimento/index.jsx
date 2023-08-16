import { useEffect, useRef, useState } from 'react';
import {
    converteMoedaFloat,
    converteFloatMoeda,
    keyDown,
    retornaDataAtual,
    inverteData,
} from '../../biblitoteca';
import { FiSearch, FiDollarSign } from 'react-Icons/fi';
import { BuscaClienteNome } from '../buscaCliente';

import { apiFactoring } from '../../services/api';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const RelatorioChequePorClienteVencimento = () => {
    const [idCliente, setIdCliente] = useState(0);
    const [formBusca, setFormBusca] = useState();
    const [checkEspecial, setCheckEspecial] = useState('NAO');

    const ref = useRef();

    const exibeFormBusca = () => {
        setFormBusca(!formBusca);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

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

    const relatorioPorData = async () => {
        const dadosRelatorio = ref.current;
        var dataI = dadosRelatorio.dataI.value;
        var dataF = dadosRelatorio.dataF.value;

        await apiFactoring
            .post(
                '/relatorio-cheque-cliente-vencimento',
                {
                    dataI: dataI,
                    dataF: dataF,
                    status: checkRel,
                    idCliente: idCliente,
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

    const buscaClienteCodigo = async () => {
        const dadosCliente = ref.current;

        await apiFactoring
            .post(
                '/busca-cliente-id',
                {
                    idCliente: idCliente,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                if (data.length > 0) {
                    data.map((dados) => {
                        dadosCliente.nome.value = dados.nome;
                    });
                }
            });
    };

    const toogle = () => {
        if (checkEspecial == 'NAO') {
            setCheckEspecial('SIM');
        }
        if (checkEspecial == 'SIM') {
            setCheckEspecial('NAO');
        }

        console.log(checkEspecial);
    };

    const formataTaxa = () => {
        const dadosTaxa = ref.current;
        dadosTaxa.taxaJuros.value = converteFloatMoeda(
            dadosTaxa.taxaJuros.value
        );
    };

    useEffect(() => {
        buscaClienteCodigo();
    }, [idCliente]);
    return (
        <>
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            {formBusca == true && (
                <BuscaClienteNome
                    setFormBusca={setFormBusca}
                    setIdCliente={setIdCliente}
                />
            )}
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
                        <div className="boxRow">
                            <div className="boxRow">
                                <div className="boxCol">
                                    <label>Código</label>

                                    <input
                                        type="text"
                                        id="inputIdCliente"
                                        name="idCliente"
                                        placeholder=""
                                        value={idCliente}
                                        onKeyDown={(e) =>
                                            keyDown(e, 'inputNome')
                                        }
                                        onChange={(e) =>
                                            setIdCliente(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="boxCol">
                                    <label>Nome</label>
                                    <div className="boxRow">
                                        <input
                                            type="text"
                                            id="inputNomeCliTaxa"
                                            name="nome"
                                            placeholder=""
                                        />
                                        <FiSearch
                                            size="25"
                                            onClick={exibeFormBusca}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="boxCol">
                            <label>Devolvido</label>
                            <label>Recebido</label>
                            <label>Geral</label>
                        </div>

                        <div className="boxCol" id="divCheckbox">
                            {checkRel == 'DEVOLVIDO' ? (
                                <input
                                    type="checkbox"
                                    name="chekedDevolvido"
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
                                    name="chekeRecebido"
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
