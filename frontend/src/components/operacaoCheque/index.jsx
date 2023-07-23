import { GridCheque } from '../gridCheque';
import './formOperacaoCheque.css';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch } from 'react-Icons/fi';
import { BuscaClienteNome } from '../buscaCliente';
import { useState, useEffect, useRef } from 'react';
import { apiFactoring } from '../../services/api';
import {
    converteMoedaFloat,
    keyDown,
    retornaDataAtual,
} from '../../biblitoteca';
import { BuscaOperacao } from '../buscaOperacaoCheque';
import { ImLoop2, ImPencil2, ImPlus } from 'react-icons/im';

export const FormOperacaoCheque = () => {
    const [iniOperacao, setIniOperacao] = useState(false);

    const [formBusca, setFormBusca] = useState(false);
    const [cpfCnpj, setCpfCnpj] = useState('');

    const [idBordero, setIdBordero] = useState();

    const [rodaLista, setRodaLista] = useState(false);

    const [dias, setDias] = useState();

    const [formBuscaOperacao, setFormBuscaOperacao] = useState(false);
    const [idOperacao, setIdOperacao] = useState();

    const [somaValorCheque, setSomaValorCheque] = useState();
    const [somaValorLiquido, setSomaValorLiquido] = useState();
    const [somaValorJuros, setSomaValorJuros] = useState();
    const [quantidadeCheques, setQuantidadeCheques] = useState();

    const [idCliente, setIdCliente] = useState();

    const ref = useRef();

    const exibeFormBusca = () => {
        setFormBusca(!formBusca);
    };

    const exibeFormBuscaOperacao = () => {
        setFormBuscaOperacao(!formBuscaOperacao);
        setIniOperacao(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const iniciaOperacao = () => {
        limpa();
        const dadosCliente = ref.current;

        setIniOperacao(true);
        if (dadosCliente.idCliente.value != '' && dadosCliente.operacao == '') {
            gravarBorderdo();
        }
    };

    const buscaCliente = async () => {
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
                data.map((dados) => {
                    dadosCliente.nome.value = dados.nome;
                    dadosCliente.idCliente.value = dados.idcliente;
                    dadosCliente.jurosMensal.value = dados.taxa_juros;
                });
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const buscaOperacao = async () => {
        const dadosOperacao = ref.current;
        await apiFactoring
            .post(
                '/busca-bordero-id',
                {
                    operacao: idOperacao,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                data.map((dados) => {
                    dadosOperacao.nome.value = dados.nome;
                    dadosOperacao.idCliente.value = dados.idcliente;
                    dadosOperacao.operacao.value = dados.idbordero;
                    dadosOperacao.dataBase.value = dados.data_base;
                    dadosOperacao.data.value = dados.data;
                    dadosOperacao.txTed.value = dados.taxa_ted;
                    dadosOperacao.jurosMensal.value = dados.juros;
                    dadosOperacao.jurosDiario.value = dados.juros_diario;

                    setIdBordero(dados.idbordero);
                    setRodaLista(!rodaLista);
                });
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const alterarBordero = async () => {
        const dadosBordero = ref.current;

        await apiFactoring
            .post(
                '/alterar-bordero',
                {
                    idBordero: dadosBordero.operacao.value,
                    idcliente: dadosBordero.idCliente.value,
                    dataBase: dadosBordero.dataBase.value,
                    taxaTed: converteMoedaFloat(dadosBordero.txTed.value),
                    juros: converteMoedaFloat(dadosBordero.jurosMensal.value),
                    jurosDiario: converteMoedaFloat(
                        dadosBordero.jurosDiario.value
                    ),
                    idFactoring: localStorage.getItem('factoring'),
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setIniOperacao(false);
                toast.success(data);
            })
            .catch();
    };
    const gravarBorderdo = async () => {
        const dadosBordero = ref.current;
        setIdBordero(0);
        setRodaLista(!rodaLista);
        await apiFactoring
            .post(
                '/gravar-bordero',
                {
                    idcliente: dadosBordero.idCliente.value,
                    dataBase: dadosBordero.dataBase.value,
                    taxaTed: converteMoedaFloat(dadosBordero.txTed.value),
                    juros: converteMoedaFloat(dadosBordero.jurosMensal.value),
                    jurosDiario: converteMoedaFloat(
                        dadosBordero.jurosDiario.value
                    ),
                    idFactoring: localStorage.getItem('factoring'),
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                dadosBordero.operacao.value = data.insertId;
                setIniOperacao(false);
            })
            .catch();
    };

    const gravarLancamento = async () => {
        const dadosLancamento = ref.current;

        setIdBordero(dadosLancamento.operacao.value);

        await apiFactoring
            .post(
                'gravar-lancamento',
                {
                    numeroBanco: dadosLancamento.numeroBanco.value,
                    nomeBanco: dadosLancamento.banco.value,
                    numeroCheque: dadosLancamento.numeroCheque.value,
                    nomeCheque: dadosLancamento.nomeCheque.value,
                    dataVencimento: dadosLancamento.dataVencimento.value,
                    valorCheque: dadosLancamento.valorCheque.value,
                    dias: dadosLancamento.dias.value,
                    valorJuros: dadosLancamento.valorJuros.value,
                    valorLiquido: dadosLancamento.valorLiquido.value,
                    idBordero: dadosLancamento.operacao.value,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                toast.success(data);
                setRodaLista(!rodaLista);
                console.log(rodaLista);
            })
            .catch();
        alterarBordero();
    };

    const calculaJurosDiario = () => {
        const dadosJuros = ref.current;
        const jurosMensal = converteMoedaFloat(dadosJuros.jurosMensal.value);
        const jurosDiario = jurosMensal / 30;
        dadosJuros.jurosDiario.value = jurosDiario.toFixed(4);
        console.log(jurosDiario);
    };

    const calculaDias = () => {
        const dadosDia = ref.current;
        const dataBase = dadosDia.dataBase.value;
        const dataVencimento = dadosDia.dataVencimento.value;
        const diffInMs = new Date(dataVencimento) - new Date(dataBase);
        const dias = diffInMs / (1000 * 60 * 60 * 24);
        dadosDia.dias.value = dias;
        setDias(dias);
    };

    const calculaValorJuros = () => {
        const dadosJuros = ref.current;
        const jurosDiario = dadosJuros.jurosDiario.value;
        const dias = dadosJuros.dias.value;
        const valorCheque = converteMoedaFloat(dadosJuros.valorCheque.value);

        const valorJuros = (dias * jurosDiario * valorCheque) / 100;
        dadosJuros.valorJuros.value = valorJuros.toFixed(2);

        dadosJuros.valorLiquido.value = (valorCheque - valorJuros).toFixed(2);
    };

    const limpa = () => {
        const dadosOperacao = ref.current;
        setCpfCnpj('');
        setIniOperacao(false);
        setIdBordero();
        setIdOperacao();

        dadosOperacao.nome.value = '';
        dadosOperacao.idCliente.value = '';
        dadosOperacao.operacao.value = '';
        dadosOperacao.dataBase.value = '';
        dadosOperacao.data.value = '';
        dadosOperacao.txTed.value = '';
        dadosOperacao.jurosMensal.value = '';
        dadosOperacao.jurosDiario.value = '';
    };

    const formataValorCheque = () => {
        const dadosOperacao = ref.current;
        let valorCheque = dadosOperacao.valorCheque.value;
        valorCheque = converteMoedaFloat(valorCheque);

        dadosOperacao.valorCheque.value = valorCheque.toLocaleString('pt-BR');
    };

    useEffect(() => {
        buscaCliente();
    }, [idCliente]);

    useEffect(() => {
        calculaValorJuros();
    }, [dias]);

    useEffect(() => {
        buscaOperacao();
    }, [idOperacao]);

    useEffect(() => {
        const dadosBordero = ref.current;
        dadosBordero.data.value = retornaDataAtual();
        dadosBordero.dataBase.value = retornaDataAtual();
    });

    return (
        <>
            {formBusca == true && (
                <BuscaClienteNome
                    setFormBusca={setFormBusca}
                    setIdCliente={setIdCliente}
                />
            )}
            {formBuscaOperacao == true && (
                <BuscaOperacao
                    setFormBuscaOperacao={setFormBuscaOperacao}
                    setIdOperacao={setIdOperacao}
                />
            )}

            <form
                className="formOperacaoCheque"
                onSubmit={handleSubmit}
                ref={ref}
            >
                {' '}
                <ToastContainer
                    autoClose={3000}
                    position={toast.POSITION.BOTTOM_LEFT}
                />
                <div className="boxOpChequeLeft">
                    <h1>Cheques</h1>
                    <div className="boxRow">
                        <ImPlus id="imPlus" onClick={iniciaOperacao} />
                        <ImPencil2 id="imPlus" onClick={alterarBordero} />
                    </div>
                    <div className="boxCol">
                        <div className="boxRow">
                            <input type="text" id="inputId" name="operacao" />
                            <FiSearch
                                size="25"
                                onClick={exibeFormBuscaOperacao}
                            />
                            <input type="date" name="data" />
                        </div>

                        <label>Cliente</label>
                        <div className="boxRow">
                            <input
                                type="text"
                                id="inputId"
                                name="idCliente"
                                readOnly
                            />
                            <input
                                id="inputCliente"
                                type="text"
                                name="nome"
                                placeholder=""
                                onKeyDown={(e) => keyDown(e, 'inputDataBase')}
                            />{' '}
                            <FiSearch size="25" onClick={exibeFormBusca} />
                        </div>
                    </div>
                    <div className="boxRow">
                        <div className="boxCol">
                            <label>Data Base</label>
                            <input
                                id="inputDataBase"
                                type="date"
                                name="dataBase"
                                placeholder=""
                                onChange={calculaDias}
                                onKeyDown={(e) => keyDown(e, 'inputTxTed')}
                            />
                        </div>
                        <div className="boxCol">
                            <label>Tx Ted</label>
                            <input
                                id="inputTxTed"
                                type="text"
                                name="txTed"
                                placeholder=""
                                onKeyDown={(e) => keyDown(e, 'inputJurosM')}
                            />
                        </div>
                        <div className="boxCol">
                            <label>Juros Mensal</label>

                            <input
                                id="inputJurosM"
                                type="text"
                                name="jurosMensal"
                                placeholder=""
                                onChange={calculaJurosDiario}
                                onKeyDown={(e) => keyDown(e, 'inputJurosD')}
                            />
                        </div>
                        <div className="boxCol">
                            <label>Juros Diario</label>

                            <input
                                id="inputJurosD"
                                type="text"
                                name="jurosDiario"
                                placeholder=""
                                onFocus={calculaJurosDiario}
                                onKeyDown={(e) => keyDown(e, 'inputNbco')}
                            />
                        </div>
                    </div>

                    <div className="boxRow">
                        <div className="boxCol">
                            <label>Banco</label>
                            <input
                                id="inputNbco"
                                type="text"
                                name="numeroBanco"
                                placeholder=""
                                onKeyDown={(e) => keyDown(e, 'inputBanco')}
                            />
                        </div>
                        <div className="boxCol">
                            <label>Nome do Banco</label>

                            <input
                                id="inputBanco"
                                type="text"
                                name="banco"
                                placeholder=""
                                onKeyDown={(e) => keyDown(e, 'inputNcheque')}
                            />
                        </div>

                        <div className="boxCol">
                            <label>Nº Cheque</label>

                            <input
                                id="inputNcheque"
                                type="text"
                                name="numeroCheque"
                                placeholder=""
                                onKeyDown={(e) => keyDown(e, 'inputNomeC')}
                            />
                        </div>
                    </div>
                    <div className="boxRow">
                        <div className="boxCol">
                            <label>Nome do Cheque</label>

                            <input
                                id="inputNomeC"
                                type="text"
                                name="nomeCheque"
                                placeholder="Nome"
                                onKeyDown={(e) => keyDown(e, 'inputVencimento')}
                            />
                        </div>
                    </div>
                    <div className="boxRow">
                        <div className="boxCol">
                            <label>Vencimento</label>
                            <input
                                id="inputVencimento"
                                type="date"
                                name="dataVencimento"
                                placeholder=""
                                onChange={calculaDias}
                                onKeyDown={(e) => keyDown(e, 'inputValorC')}
                            />
                        </div>
                        <div className="boxCol">
                            <label>Vl. Cheque</label>

                            <input
                                id="inputValorC"
                                type="text"
                                name="valorCheque"
                                placeholder=""
                                onChange={calculaValorJuros}
                                onKeyDown={(e) => keyDown(e, 'inputDias')}
                                onBlur={formataValorCheque}
                            />
                        </div>
                        <div className="boxCol">
                            <label>Dias</label>

                            <input
                                id="inputDias"
                                type="text"
                                name="dias"
                                placeholder=""
                                onKeyDown={(e) => keyDown(e, 'inputValorJuros')}
                            />
                        </div>
                        <div className="boxCol">
                            <label>Vl Juros</label>

                            <input
                                id="inputValorJuros"
                                type="text"
                                name="valorJuros"
                                placeholder=""
                                onKeyDown={(e) =>
                                    keyDown(e, 'inputValorLiquido')
                                }
                            />
                        </div>
                        <div className="boxCol">
                            <label>Vl Liquido</label>

                            <input
                                id="inputValorLiquido"
                                type="text"
                                name="valorLiquido"
                                placeholder=""
                                onKeyDown={(e) =>
                                    keyDown(e, 'btnGravarLancamento')
                                }
                            />
                        </div>
                    </div>
                    <button id="btnGravarLancamento" onClick={gravarLancamento}>
                        Incluir
                    </button>
                </div>
                <div className="boxOpChequeRight">
                    <h2>Resumo</h2>

                    <div className="boxResumo">
                        <label>Cheques Lançados</label>
                        <input type="text" value={quantidadeCheques} />
                    </div>

                    <div className="boxResumo">
                        <label>Total Bruto</label>
                        <input type="text" value={somaValorCheque} />
                    </div>

                    <div className="boxResumo">
                        <label>Deduções</label>
                        <input type="text" />
                    </div>
                    <div className="boxResumo">
                        <label>Total Juros</label>
                        <input type="text" value={somaValorJuros} />
                    </div>
                    <div className="boxResumo">
                        <label>Total Liquido</label>
                        <input type="text" value={somaValorLiquido} />
                    </div>
                </div>
            </form>
            <GridCheque
                idBordero={idBordero}
                rodaLista={rodaLista}
                setSomaValorCheque={setSomaValorCheque}
                setSomaValorLiquido={setSomaValorLiquido}
                setSomaValorJuros={setSomaValorJuros}
                setQuantidadeCheques={setQuantidadeCheques}
            />
        </>
    );
};
