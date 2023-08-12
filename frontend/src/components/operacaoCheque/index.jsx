import './formOperacaoCheque.css';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch } from 'react-Icons/fi';
import { BuscaClienteNome } from '../buscaCliente';
import { useState, useEffect, useRef } from 'react';
import { apiFactoring, apiBancos } from '../../services/api';
import {
    converteMoedaFloat,
    keyDown,
    retornaDataAtual,
    converteFloatMoeda,
    inverteData,
} from '../../biblitoteca';
import { BuscaOperacao } from '../buscaOperacaoCheque';
import { AuthProvider } from '../../context/authContext';
import axios from 'axios';

export const FormOperacaoCheque = () => {
    const [onEdit, setOnEdit] = useState(false);
    const [lancamentos, setLancamentos] = useState([]);
    let arrayCheques = [];
    let i = 0;

    const [formBusca, setFormBusca] = useState(false);

    const [idBordero, setIdBordero] = useState('0');

    const [dias, setDias] = useState();

    const [formBuscaOperacao, setFormBuscaOperacao] = useState(false);

    const [checkCalculaJuros, setCheckCalculaJuros] = useState(true);

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
        setIdBordero('0');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
                if (data.length > 0) {
                    data.map((dados) => {
                        dadosCliente.nome.value = dados.nome;
                        dadosCliente.idCliente.value = dados.idcliente;
                        dadosCliente.jurosMensal.value = dados.taxa_juros;
                    });

                    calculaJurosDiario();
                }
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const buscaOperacao = async () => {
        if (idBordero > 0) {
            setLancamentos([]);
            const dadosOperacao = ref.current;
            await apiFactoring
                .post(
                    '/busca-bordero-id',
                    {
                        operacao: idBordero,
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
                            dadosOperacao.nome.value = dados.nome;
                            dadosOperacao.idCliente.value = dados.idcliente;
                            dadosOperacao.operacao.value = dados.idbordero;
                            dadosOperacao.dataBase.value = dados.data_base;
                            dadosOperacao.data.value = dados.data;
                            dadosOperacao.txTed.value = dados.taxa_ted;
                            dadosOperacao.jurosMensal.value = dados.juros;
                            dadosOperacao.jurosDiario.value =
                                dados.juros_diario;
                        });
                        setOnEdit(true);
                    } else {
                        dadosOperacao.nome.value = '';
                        dadosOperacao.idCliente.value = '';
                        dadosOperacao.operacao.value = '';
                        dadosOperacao.dataBase.value = '';
                        dadosOperacao.data.value = '';
                        dadosOperacao.txTed.value = '';
                        dadosOperacao.jurosMensal.value = '';
                        dadosOperacao.jurosDiario.value = '';
                    }
                })
                .catch(({ data }) => {
                    toast.error(data);
                });
        }
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

        await apiFactoring
            .post(
                '/gravar-bordero',
                {
                    idcliente: dadosBordero.idCliente.value,
                    dataBase: dadosBordero.dataBase.value,
                    taxaTed: converteMoedaFloat(dadosBordero.txTed.value),
                    juros: dadosBordero.jurosMensal.value * 1,
                    jurosDiario: dadosBordero.jurosDiario.value * 1,
                    idFactoring: localStorage.getItem('factoring'),
                    arrayCheques: lancamentos,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                dadosBordero.operacao.value = data.insertId;
                setOnEdit(true);
                setIdBordero(data.insertId);
            })
            .catch();

        console.log(lancamentos);
    };

    const BuscaCheques = async () => {
        await apiFactoring
            .post(
                '/listar-Lancamento',
                {
                    operacao: idBordero,
                    arrayCheques: lancamentos,
                },

                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                if (data.length > 0) {
                    data.map((item) => {
                        arrayCheques = [
                            ...arrayCheques,
                            {
                                numero_banco: item.numero_banco,
                                nome_banco: item.nome_banco,
                                numero_cheque: item.numero_cheque,
                                nome_cheque: item.nome_cheque,
                                data_vencimento: item.data_vencimento,
                                valor_cheque: item.valor_cheque,
                                dias: item.dias,
                                valor_juros: item.valor_juros,
                                valor_liquido: item.valor_liquido,
                                idlancamento: item.idlancamento,
                            },
                        ];
                    });
                    setLancamentos(arrayCheques);
                }
            })
            .catch();
    };

    const incluirCheque = () => {
        calculaValorJuros();

        const dadosLancamento = ref.current;

        let checado = true;

        if (dadosLancamento.numeroBanco.value == '') {
            checado = false;
            console.log(checado);
        }
        if (dadosLancamento.banco.value == '') {
            checado = false;
            console.log(checado);
        }
        if (dadosLancamento.numeroCheque.value == '') {
            checado = false;
            console.log(checado);
        }
        if (dadosLancamento.nomeCheque.value == '') {
            checado = false;
            console.log(checado);
        }
        if (dadosLancamento.dataVencimento.value == '') {
            checado = false;
            console.log(checado);
        }
        if (dadosLancamento.valorCheque.value == '') {
            checado = false;
            console.log(checado);
        }
        if (
            dadosLancamento.valorJuros.value == '' ||
            dadosLancamento.valorJuros.value == '0,00'
        ) {
            checado = false;
            console.log(checado);
        }
        if (dadosLancamento.valorLiquido.value == '') {
            checado = false;
            console.log(checado);
        }
        if (dadosLancamento.dias.value == '') {
            checado = false;
            console.log(checado);
        }
        if (checado == true) {
            arrayCheques = [
                ...lancamentos,
                {
                    idlancamento: lancamentos.length + 1,
                    numero_banco: dadosLancamento.numeroBanco.value,
                    nome_banco: dadosLancamento.banco.value,
                    numero_cheque: dadosLancamento.numeroCheque.value,
                    nome_cheque: dadosLancamento.nomeCheque.value,
                    data_vencimento: dadosLancamento.dataVencimento.value,
                    valor_cheque: converteMoedaFloat(
                        dadosLancamento.valorCheque.value
                    ),
                    dias: dadosLancamento.dias.value,
                    valor_juros: converteMoedaFloat(
                        dadosLancamento.valorJuros.value
                    ),
                    valor_liquido: converteMoedaFloat(
                        dadosLancamento.valorLiquido.value
                    ),
                    idBordero: dadosLancamento.operacao.value,
                },
            ];

            setLancamentos(arrayCheques);
            document.getElementById('inputNbco').focus();
            dadosLancamento.numeroBanco.value = '';
            dadosLancamento.banco.value = '';
            dadosLancamento.numeroCheque.value = '';
            dadosLancamento.nomeCheque.value = '';
            dadosLancamento.dataVencimento.value = retornaDataAtual();
            dadosLancamento.valorCheque.value = '';
            dadosLancamento.valorJuros.value = '';
            dadosLancamento.valorLiquido.value = '';
            dadosLancamento.dias.value = '0';
        } else {
            toast.error('Compos obrigatórios não preenchidos!');
            document.getElementById('inputNbco').focus();
        }
    };

    const calculaJurosDiario = () => {
        const dadosJuros = ref.current;
        const jurosMensal = dadosJuros.jurosMensal.value;
        const jurosDiario = jurosMensal / 30;
        dadosJuros.jurosDiario.value = jurosDiario.toFixed(4);
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
        console.log(checkCalculaJuros);

        if (checkCalculaJuros == true) {
            const dadosJuros = ref.current;
            const jurosDiario = dadosJuros.jurosDiario.value;
            const dias = dadosJuros.dias.value;
            const valorCheque = converteMoedaFloat(
                dadosJuros.valorCheque.value
            );

            const valorJuros = (dias * jurosDiario * valorCheque) / 100;
            dadosJuros.valorJuros.value = valorJuros.toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
            });

            dadosJuros.valorLiquido.value = (
                valorCheque - valorJuros
            ).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
            });
        }
    };

    const limpa = () => {
        const dadosOperacao = ref.current;

        setIdBordero('0');
        setLancamentos([]);
        setIdCliente();
        setOnEdit(false);
        setFormBuscaOperacao();

        dadosOperacao.nome.value = '';
        dadosOperacao.idCliente.value = '';
        dadosOperacao.operacao.value = '';

        dadosOperacao.txTed.value = '';
        dadosOperacao.jurosMensal.value = '';
        dadosOperacao.jurosDiario.value = '';

        dadosOperacao.data.value = retornaDataAtual();
        dadosOperacao.dataBase.value = retornaDataAtual();
        dadosOperacao.dataVencimento.value = retornaDataAtual();
        dadosOperacao.dias.value = '0';
    };

    const formataValorCheque = () => {
        const dadosOperacao = ref.current;

        let valorCheque = dadosOperacao.valorCheque.value;

        valorCheque = converteMoedaFloat(valorCheque);

        dadosOperacao.valorCheque.value = valorCheque.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
        });
    };

    const formataJurosMensal = () => {
        const dadosJuros = ref.current;
        dadosJuros.jurosMensal.value = converteMoedaFloat(
            dadosJuros.jurosMensal.value
        );
        calculaJurosDiario();
    };

    const formataJurosMensalOnFocus = () => {
        const dadosJuros = ref.current;
        dadosJuros.jurosMensal.value = converteFloatMoeda(
            dadosJuros.jurosMensal.value
        );
    };

    const buscaBancos = async (codigo) => {
        const dadosBanco = ref.current;
        await apiBancos
            .get('https://brasilapi.com.br/api/banks/v1')
            .then(({ data }) => {
                const bancoFiltrado = data.filter((b) => b.code === codigo * 1);
                bancoFiltrado.map((banco) => {
                    dadosBanco.banco.value = banco.name;
                });
            })
            .catch();
    };

    const handleNumeroCheuque = (e) => {
        const dadosCheque = ref.current;
        dadosCheque.numeroCheque.value = formataCheque(e);
    };

    const formataCheque = (value) => {
        if (!value) return '';
        value = value.replace(/\D/g, '');
        value = value
            .replace(/(\d{6})(\d)/, '$1-$2')
            .replace(/(-\d{1})\d+?$/, '$1');
        return value;
    };

    const atualizaResumo = () => {
        const dadosResumo = ref.current;
        let somaValorCheques = 0;
        let somaValorJuros = 0;
        let somaValorLiquido = 0;
        let somaQuantidadeCheques = lancamentos.length;
        lancamentos.map((resumo) => {
            somaValorCheques = somaValorCheques * 1 + resumo.valor_cheque * 1;
            somaValorJuros = somaValorJuros * 1 + resumo.valor_juros * 1;
            somaValorLiquido = somaValorLiquido * 1 + resumo.valor_liquido * 1;
        });
        dadosResumo.totalBruto.value = somaValorCheques.toLocaleString(
            'pt-BR',
            {
                style: 'decimal',
                minimumFractionDigits: 2,
            }
        );
        dadosResumo.totalJuros.value = somaValorJuros.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
        });
        dadosResumo.totalLiquido.value = somaValorLiquido.toLocaleString(
            'pt-BR',
            {
                style: 'decimal',
                minimumFractionDigits: 2,
            }
        );
        dadosResumo.quantidadeCheques.value = somaQuantidadeCheques;
    };

    const toogle = () => {
        setCheckCalculaJuros(!checkCalculaJuros);
        console.log(checkCalculaJuros);
    };

    useEffect(() => {
        atualizaResumo();
    }, [lancamentos]);

    useEffect(() => {
        buscaCliente();
    }, [idCliente]);

    useEffect(() => {
        calculaValorJuros();
    }, [dias]);

    useEffect(() => {
        buscaOperacao();
        BuscaCheques();
    }, [idBordero]);

    useEffect(() => {
        const dadosBordero = ref.current;
        dadosBordero.data.value = retornaDataAtual();
        dadosBordero.dataBase.value = retornaDataAtual();
        dadosBordero.dataVencimento.value = retornaDataAtual();
        dadosBordero.dias.value = '0';
        setIdBordero('0');
    }, []);

    return (
        <>
            {formBusca == true && (
                <AuthProvider>
                    <BuscaClienteNome
                        setFormBusca={setFormBusca}
                        setIdCliente={setIdCliente}
                    />
                </AuthProvider>
            )}
            {formBuscaOperacao == true && (
                <AuthProvider>
                    <BuscaOperacao
                        setFormBuscaOperacao={setFormBuscaOperacao}
                        setIdOperacao={setIdBordero}
                    />
                </AuthProvider>
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
                        {!onEdit && (
                            <button
                                id="btnGravarEmprestimo"
                                onClick={gravarBorderdo}
                            >
                                Gravar
                            </button>
                        )}{' '}
                        {onEdit && (
                            <button id="btnGravarEmprestimo" onClick={limpa}>
                                Novo
                            </button>
                        )}{' '}
                        {onEdit && <button id="btnImprimir">Imprimir</button>}
                    </div>

                    <div className="boxRow">
                        <div className="boxRow">
                            <input
                                type="text"
                                id="inputId"
                                name="operacao"
                                value={idBordero || ''}
                                onChange={(e) => setIdBordero(e.target.value)}
                                autoComplete="off"
                                onKeyDown={(e) => keyDown(e, 'inputIdCliente')}
                            />
                            <FiSearch
                                size="25"
                                onClick={exibeFormBuscaOperacao}
                            />
                            <input type="date" name="data" autoComplete="off" />
                        </div>

                        <label>Cliente</label>
                        <div className="boxRow">
                            <input
                                type="text"
                                id="inputIdCliente"
                                name="idCliente"
                                autoComplete="off"
                                onChange={(e) => setIdCliente(e.target.value)}
                                onKeyDown={(e) => keyDown(e, 'inputCliente')}
                            />
                            <input
                                id="inputCliente"
                                type="text"
                                name="nome"
                                placeholder=""
                                onKeyDown={(e) => keyDown(e, 'inputDataBase')}
                                autoComplete="off"
                            />
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
                                autoComplete="off"
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
                                autoComplete="off"
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
                                onBlur={formataJurosMensal}
                                onFocus={formataJurosMensalOnFocus}
                                readOnly
                                autoComplete="off"
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
                                readOnly
                                autoComplete="off"
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
                                autoComplete="off"
                                onChange={(e) => buscaBancos(e.target.value)}
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
                                autoComplete="off"
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
                                autoComplete="off"
                                onKeyUp={(e) =>
                                    handleNumeroCheuque(e.target.value)
                                }
                            />
                        </div>

                        <div className="boxRow">
                            <div className="boxCol">
                                <label>Nome do Cheque</label>

                                <input
                                    id="inputNomeC"
                                    type="text"
                                    name="nomeCheque"
                                    placeholder="Nome"
                                    onKeyDown={(e) =>
                                        keyDown(e, 'inputVencimento')
                                    }
                                    autoComplete="off"
                                />
                            </div>
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
                                autoComplete="off"
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
                                autoComplete="off"
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
                                autoComplete="off"
                                readOnly
                            />
                        </div>
                        <div className="boxCol">
                            <label>Vl Juros</label>
                            <div className="boxRow">
                                <input
                                    id="inputValorJuros"
                                    type="text"
                                    name="valorJuros"
                                    placeholder=""
                                    onKeyDown={(e) =>
                                        keyDown(e, 'inputValorLiquido')
                                    }
                                    autoComplete="off"
                                />
                                <input
                                    type="checkbox"
                                    id="checkP"
                                    name="checkP"
                                    onClick={toogle}
                                />
                            </div>
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
                                autoComplete="off"
                                readOnly
                            />
                        </div>
                        <button
                            id="btnGravarLancamento"
                            onClick={incluirCheque}
                        >
                            Incluir
                        </button>
                    </div>
                </div>
                <div className="boxOpChequeRight">
                    <h2>Resumo</h2>

                    <div className="boxResumo">
                        <label>Cheques Lançados</label>
                        <input
                            type="text"
                            name="quantidadeCheques"
                            autoComplete="off"
                        />
                    </div>

                    <div className="boxResumo">
                        <label>Total Bruto</label>
                        <input
                            type="text"
                            autoComplete="off"
                            name="totalBruto"
                        />
                    </div>

                    <div className="boxResumo">
                        <label>Deduções</label>
                        <input type="text" autoComplete="off" />
                    </div>
                    <div className="boxResumo">
                        <label>Total Juros</label>
                        <input
                            type="text"
                            value={somaValorJuros}
                            autoComplete="off"
                            name="totalJuros"
                        />
                    </div>
                    <div className="boxResumo">
                        <label>Total Liquido</label>
                        <input
                            type="text"
                            value={somaValorLiquido}
                            autoComplete="off"
                            name="totalLiquido"
                        />
                    </div>
                </div>
            </form>
            <div>
                <div className="gridCheque">
                    <div>N.Banco</div>
                    <div>Banco</div>
                    <div>N. Cheque</div>
                    <div>Nome</div>
                    <div className="alignRight">Vencimento</div>
                    <div className="alignRight">Valor</div>
                    <div className="alignRight">Prazo</div>
                    <div className="alignRight">Valor Juros</div>
                    <div className="alignRight">Valor Liquido</div>
                </div>
                {lancamentos.map((item) => (
                    <div className="gridLinhaCheque" key={item.idlancamento}>
                        <div>{item.numero_banco}</div>
                        <div>{item.nome_banco}</div>
                        <div>{item.numero_cheque}</div>
                        <div className="upercase">{item.nome_cheque}</div>

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
                    </div>
                ))}
            </div>
        </>
    );
};
