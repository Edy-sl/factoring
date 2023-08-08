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
import { FormPagamentoEmprestimo } from '../pagamentoEmprestimo';

export const RelatorioEmprestimoPorClienteEmissao = () => {
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

    const [dadosEmprestimo, setDadosEmprestimo] = useState([]);

    const [checkRel, setCheckRel] = useState();

    const [dataIni, setDataIni] = useState(retornaDataAtual());
    const [dataFim, setDataFim] = useState(retornaDataAtual());

    var totalValor = 0;
    var totalRecebido = 0;
    var totalReceber = 0;

    const [totalValorR, setTotalValorR] = useState(0);
    const [totalValorRecebido, setTotalValorRecebido] = useState(0);
    const [totalValorReceber, setTotalValorReceber] = useState(0);

    const [idParcela, setIdParcela] = useState(0);
    const [parcelaN, setParcelaN] = useState(0);

    const [atualizaParcelas, setAtualizaParcelas] = useState(false);

    const relatorioPorData = async () => {
        const dadosRelatorio = ref.current;
        var dataI = dadosRelatorio.dataI.value;
        var dataF = dadosRelatorio.dataF.value;

        await apiFactoring
            .post(
                '/relatorio-emprestimo-cliente-emissao',
                {
                    dataI: dataI,
                    dataF: dataF,
                    tipoRel: checkRel,
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
            totalValor = totalValor + parseFloat(somaTotais.valor);
            totalRecebido = totalRecebido + parseFloat(somaTotais.valor_pago);
            totalReceber = totalValor - totalRecebido;
        });
        setTotalValorR(totalValor);
        setTotalValorRecebido(totalRecebido);
        setTotalValorReceber(totalReceber);
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
                <FormPagamentoEmprestimo
                    parcelaN={parcelaN}
                    idParcela={idParcela}
                    setIdParcela={setIdParcela}
                    setAtualizaParcelas={setAtualizaParcelas}
                    atualizaParcelas={atualizaParcelas}
                />
            )}
            <div className="divRelatorioEmprestimoData">
                <div id="divTituloRelatorio">
                    <label>Realtório por Data de Emissão</label>
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
                                <FiSearch
                                    className="icone2"
                                    onClick={checkRel && relatorioPorData}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>{' '}
            <div className="boxCol" id="divContainerLista">
                <div className="divListaTitulo">
                    <div className="alignLeft">Operação</div>
                    <div className="alignLeft">Cliente</div>
                    <div className="alignRight">Parcela</div>
                    <div className="alignCenter">Data</div>
                    <div className="alignRight">Vencimento</div>
                    <div className="alignRight">Valor Total</div>
                    <div className="alignRight">Valor</div>
                    <div className="alignRight">Recebido</div>
                    <div className="alignRight">A Receber</div>
                    <div className="alignRight"></div>
                </div>
                <div className="divListaRContainer">
                    {' '}
                    {listagem.map((lista, i) => (
                        <div key={i} className="divListaR">
                            <div className="alignLet">{lista.idemprestimo}</div>
                            <div className="alignLeft">{lista.nome}</div>
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
                        {totalValorRecebido.toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        })}
                    </div>
                    <div className="alignRight">
                        {totalValorReceber.toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};
