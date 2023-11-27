import './formOperacaoCheque.css';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch } from 'react-icons/fi';
import { FiEdit } from 'react-icons/fi';

import { AiFillCheckCircle } from 'react-icons/ai';
import { BuscaClienteNome } from '../buscaCliente';
import { useState, useEffect, useRef } from 'react';
import { apiFactoring, apiBancos } from '../../services/api';
import {
    converteMoedaFloat,
    keyDown,
    retornaDataAtual,
    converteFloatMoeda,
    inverteData,
    dataHoraAtual,
    feriadosFixos,
} from '../../biblitoteca';
import { BuscaOperacao } from '../buscaOperacaoCheque';
import { AuthProvider } from '../../context/authContext';
import axios from 'axios';
import { ImBin, ImExit } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { BuscaEmitente } from '../buscaEmitente';
import { BuscaClienteNomeDireto } from '../buscaClienteNome';

export const FormOperacaoCheque = () => {
    const navigate = useNavigate();

    const [clienteFiltrado, setClienteFiltrado] = useState([]);

    const [emitenteFiltrado, setEmitenteFiltrado] = useState([]);

    const [formatarCheque, setFormatarCheque] = useState(true);

    const [gravarDoc, setGravarDoc] = useState(false);

    const [onEdit, setOnEdit] = useState(false);

    const [devolvidos, setDevolvidos] = useState([]);
    let arrayDevolvidos = [];

    const [deducao, setDeducao] = useState([]);
    let arrayDeducao = [];

    const [diasDevolucao, setDiasDevolucao] = useState();

    const [lancamentos, setLancamentos] = useState([]);
    let arrayCheques = [];

    const [formBusca, setFormBusca] = useState(false);

    const [formBuscaEmitente, setFormBuscaEmitente] = useState(false);
    const [nomeEmitente, setNomeEmitente] = useState('');
    const [valorTotalChequeEmitente, setValorTotalChequeEmitente] = useState(0);
    const [quantidadeChequeEmitente, setQuantidadeChequeEmitente] = useState(0);

    const [idBordero, setIdBordero] = useState('0');

    const [dias, setDias] = useState();

    const [formBuscaOperacao, setFormBuscaOperacao] = useState(false);

    //let varIncluirCheque = true;

    const [varIncluirCheque, setVarIncluirCheque] = useState(true);

    //let idIndexCheque = 0;
    const [idIndexCheque, setIdIndexCheque] = useState(0);

    let varCalculaJuros = false;

    const [arrayBancos, setArrayBancos] = useState([]);

    const [especial, setEspecial] = useState();

    const [taxaMinima, setTaxaMinima] = useState();

    const [somaValorCheque, setSomaValorCheque] = useState();
    const [somaValorLiquido, setSomaValorLiquido] = useState();
    const [somaValorJuros, setSomaValorJuros] = useState();
    const [quantidadeCheques, setQuantidadeCheques] = useState();

    const [idCliente, setIdCliente] = useState();

    const [tab, setTab] = useState('cheques');

    const [clientes, setClientes] = useState([]);

    const [emitente, setEmitente] = useState([]);

    const [formBuscaDireto, setFormBuscaDireto] = useState(false);

    const ref = useRef();

    const exibeFormBusca = () => {
        setFormBusca(!formBusca);
    };

    const exibeFormBuscaEmitente = () => {
        setFormBuscaEmitente(!formBuscaEmitente);
    };

    const exibeFormBuscaOperacao = () => {
        setFormBuscaOperacao(!formBuscaOperacao);
        setIdBordero('0');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const buscaTaxaMinina = async () => {
        await apiFactoring
            .post(
                '/seleciona-factoring',
                {
                    idFactoring: localStorage.getItem('factoring'),
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setTaxaMinima(data[0].taxa_minima);
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const buscaCliente = async () => {
        const dadosCliente = ref.current;

        dadosCliente.nome.value = '';

        dadosCliente.jurosMensal.value = '0.00';

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
                        setNomeEmitente(dados.nome);

                        dadosCliente.idCliente.value = dados.idcliente;
                        dadosCliente.jurosMensal.value = dados.taxa_juros;
                        // document.getElementById('inputIdCliente').focus();
                        setEspecial(dados.especial);
                        listaChequesDevolvidos(dados.idcliente);
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
                            dadosOperacao.txTed.value = '0,00';
                            dadosOperacao.jurosMensal.value = dados.juros;
                            dadosOperacao.jurosDiario.value =
                                dados.juros_diario;
                            dadosOperacao.txtObs.value =
                                dados.observacao_operacao;

                            listaChequesDevolvidos(dados.idcliente);
                            listaChequesDeduzidos(dados.idbordero);
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
                        dadosOperacao.txtObs.value = '';
                    }
                })
                .catch(({ data }) => {
                    toast.error(data);
                });
        }
    };

    const gravar = () => {
        if (onEdit == false) {
            gravarBorderdo();

            BuscaCheques();
        }

        if (onEdit == true) {
            alterarBorderdo();
        }
    };

    const alterarBorderdo = async () => {
        setGravarDoc(false);
        localStorage.setItem('gravarDoc', false);

        const dadosBordero = ref.current;

        await apiFactoring
            .post(
                '/alterar-bordero',
                {
                    dataCadastro: dadosBordero.data.value,
                    idBordero: dadosBordero.operacao.value,
                    idcliente: dadosBordero.idCliente.value,
                    dataBase: dadosBordero.dataBase.value,
                    taxaTed: converteMoedaFloat(dadosBordero.txTed.value),
                    juros: dadosBordero.jurosMensal.value * 1,
                    jurosDiario: dadosBordero.jurosDiario.value * 1,
                    idFactoring: localStorage.getItem('factoring'),
                    arrayCheques: lancamentos,
                    arrayDeducao: deducao,
                    observacao_operacao: dadosBordero.txtObs.value,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                toast.success(data);
            })
            .catch((error) => {
                toast.error(error.response.data);
            });
    };

    const gravarBorderdo = async () => {
        setGravarDoc(false);
        localStorage.setItem('gravarDoc', false);
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
                    arrayDeducao: deducao,
                    observacao_operacao: dadosBordero.txtObs.value,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                toast.success(data.msg);
                dadosBordero.operacao.value = data.insertId;

                setOnEdit(true);
                setIdBordero(data.insertId);
            })
            .catch();

        setLancamentos([]);
        BuscaCheques();
    };

    const BuscaCheques = async () => {
        arrayCheques = [];
        setLancamentos([]);
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
                    data.map((item, index) => {
                        arrayCheques = [
                            ...arrayCheques,
                            {
                                index: index,
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
                                taxa_ted: item.taxa_ted,
                            },
                        ];
                    });
                    setLancamentos(arrayCheques);
                }
            })
            .catch();
    };

    const incluirCheque = () => {
        const dadosLancamento = ref.current;
        setGravarDoc(true);
        localStorage.setItem('gravarDoc', true);

        if (varIncluirCheque === true) {
            let checado = true;

            if (dadosLancamento.numeroBanco.value == '') {
                checado = false;
            }
            if (dadosLancamento.banco.value == '') {
                checado = false;
            }
            if (dadosLancamento.numeroCheque.value == '') {
                checado = false;
            }
            if (dadosLancamento.nomeCheque.value == '') {
                checado = false;
            }
            if (dadosLancamento.dataVencimento.value == '') {
                checado = false;
            }
            if (dadosLancamento.valorCheque.value == '') {
                checado = false;
            }
            if (dadosLancamento.valorJuros.value == '') {
                checado = false;
            }
            if (dadosLancamento.valorLiquido.value == '') {
                checado = false;
            }
            if (dadosLancamento.dias.value == '') {
                checado = false;
            }
            if (checado == true) {
                arrayCheques = [
                    ...lancamentos,
                    {
                        index: lancamentos.length,
                        idlancamento: 0,
                        numero_banco: dadosLancamento.numeroBanco.value,
                        nome_banco: dadosLancamento.banco.value,
                        numero_cheque: dadosLancamento.numeroCheque.value,
                        nome_cheque: dadosLancamento.nomeCheque.value,
                        data_vencimento: dadosLancamento.dataVencimento.value,
                        status: 'LANÇADO',
                        taxa_ted: converteMoedaFloat(
                            dadosLancamento.txTed.value
                        ),
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
                document.getElementById('inputTxTed').focus();

                dadosLancamento.numeroBanco.value = '';
                dadosLancamento.banco.value = '';
                dadosLancamento.numeroCheque.value = '';
                dadosLancamento.nomeCheque.value = '';
                dadosLancamento.dataVencimento.value = retornaDataAtual();
                dadosLancamento.valorCheque.value = '';
                dadosLancamento.valorJuros.value = '';
                dadosLancamento.valorLiquido.value = '';
                dadosLancamento.dias.value = '0';

                setVarIncluirCheque(true);
            } else {
                toast.error('Compos obrigatórios não preenchidos!');
                document.getElementById('inputTxTed').focus();
            }
        } else {
            localStorage.setItem('gravarDoc', true);

            dadosLancamento.btnIncluirLancamento.innerText = 'Incluir';
            gravarAlteracaoCheque(idIndexCheque);
        }
    };

    const gravarAlteracaoCheque = (idIndexCheque) => {
        setGravarDoc(true);
        localStorage.setItem('gravarDoc', true);

        const dadosLancamento = ref.current;

        for (let i = 0; i < lancamentos.length; i++) {
            if (lancamentos[i].index == idIndexCheque) {
                lancamentos[i].numero_banco = dadosLancamento.numeroBanco.value;
                lancamentos[i].nome_banco = dadosLancamento.banco.value;
                lancamentos[i].numero_cheque =
                    dadosLancamento.numeroCheque.value;
                lancamentos[i].nome_cheque = dadosLancamento.nomeCheque.value;
                lancamentos[i].data_vencimento =
                    dadosLancamento.dataVencimento.value;
                lancamentos[i].valor_cheque = converteMoedaFloat(
                    dadosLancamento.valorCheque.value
                );
                lancamentos[i].dias = dadosLancamento.dias.value;
                lancamentos[i].valor_juros = converteMoedaFloat(
                    dadosLancamento.valorJuros.value
                );
                lancamentos[i].valor_liquido = converteMoedaFloat(
                    dadosLancamento.valorLiquido.value
                );
                lancamentos[i].taxa_ted = converteMoedaFloat(
                    dadosLancamento.txTed.value
                );
            }
        }

        arrayCheques = [...lancamentos];
        setLancamentos(arrayCheques);

        document.getElementById('inputTxTed').focus();
        dadosLancamento.numeroBanco.value = '';
        dadosLancamento.banco.value = '';
        dadosLancamento.numeroCheque.value = '';
        dadosLancamento.nomeCheque.value = '';
        dadosLancamento.dataVencimento.value = retornaDataAtual();
        dadosLancamento.valorCheque.value = '';
        dadosLancamento.valorJuros.value = '';
        dadosLancamento.valorLiquido.value = '';
        dadosLancamento.dias.value = '0';

        setVarIncluirCheque(true);
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

    const calculaDiasUteis = () => {
        const dadosCheque = ref.current;

        var data_vencimento = new Date(dadosCheque.dataVencimento.value);
        data_vencimento.setDate(data_vencimento.getDate() + 1); // Adiciona 1 dias

        //vefifica se é feriado e retorna +1 dia
        var add_dia = feriadosFixos(data_vencimento);
        if (add_dia == true) {
            dadosCheque.dataVencimento.focus();
            toast.error('Feriado!');
        }

        //vefifica é sabado ou domingo e acrescenta 1 ou 2 dias
        // e se o intervalo é maior do q 0 add +1 ao intervalo
        if (data_vencimento.getDay() == 0) {
            dadosCheque.dataVencimento.focus();
            toast.error('Domingo!');
        }

        if (data_vencimento.getDay() == 6) {
            dadosCheque.dataVencimento.focus();
            toast.error('Sábado!');
        }
    };

    const calculaValorJuros = () => {
        const dadosJuros = ref.current;

        const jurosDiario = dadosJuros.jurosDiario.value;
        const dias = dadosJuros.dias.value;
        const valorCheque = converteMoedaFloat(dadosJuros.valorCheque.value);

        let valorJuros = 0;

        //calcula juros
        const valorJurosCliente = (dias * jurosDiario * valorCheque) / 100;

        //calcula juros minimo pela taxa da factoring
        const valorJurosMinimo = (taxaMinima * valorCheque) / 100;

        if (especial != 'SIM' && valorJurosMinimo > valorJurosCliente) {
            valorJuros = valorJurosMinimo;
        }

        if (especial != 'SIM' && valorJurosMinimo < valorJurosCliente) {
            valorJuros = valorJurosCliente;
        }

        if (especial != 'SIM' && valorJurosMinimo == valorJurosCliente) {
            valorJuros = valorJurosCliente;
        }

        if (especial == 'SIM') {
            valorJuros = valorJurosCliente;
        }

        dadosJuros.valorJuros.value = valorJuros.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        /* dadosJuros.valorLiquido.value = (
            valorCheque - valorJuros
        ).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
        });*/

        calculaValorLiquido();
    };

    const calculaValorLiquido = () => {
        varCalculaJuros = true;
        const dadosJuros = ref.current;
        const taxaTed = converteMoedaFloat(dadosJuros.txTed.value);

        dadosJuros.valorLiquido.value = (
            converteMoedaFloat(dadosJuros.valorCheque.value) -
            converteMoedaFloat(dadosJuros.valorJuros.value) * 1 -
            taxaTed
        ).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const limpa = () => {
        setGravarDoc(false);
        localStorage.setItem('gravarDoc', false);
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
        dadosOperacao.txtObs.value = '';
    };

    const formataValorCheque = () => {
        calculaValorJuros();

        const dadosOperacao = ref.current;

        let valorCheque = dadosOperacao.valorCheque.value;

        valorCheque = converteMoedaFloat(valorCheque);

        dadosOperacao.valorCheque.value = valorCheque.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
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

    const carregaBancos = async () => {
        await apiBancos
            .get('https://brasilapi.com.br/api/banks/v1')
            .then(({ data }) => {
                setArrayBancos(data);
            })
            .catch();
    };

    const calculaDiasDevolucao = (dataDevolucao) => {
        const dadosDia = ref.current;
        const dataBase = dadosDia.data.value;
        const diffInMs = new Date(dataBase) - new Date(dataDevolucao);
        const dias = diffInMs / (1000 * 60 * 60 * 24);
        dadosDia.dias.value = dias;

        return dias;
    };

    const calculaValorJurosDevolucao = (dias, valorCheque) => {
        const dadosJuros = ref.current;

        const jurosDiario = dadosJuros.jurosDiario.value;

        let valorJuros = 0;

        //calcula juros
        const valorJurosCliente = (dias * jurosDiario * valorCheque) / 100;

        //calcula juros minimo pela taxa da factoring
        const valorJurosMinimo = (taxaMinima * valorCheque) / 100;

        if (especial != 'SIM' && valorJurosMinimo > valorJurosCliente) {
            valorJuros = valorJurosMinimo;
        }

        if (especial != 'SIM' && valorJurosMinimo < valorJurosCliente) {
            valorJuros = valorJurosCliente;
        }

        if (especial == 'SIM') {
            valorJuros = valorJurosCliente;
        }

        return valorJuros;

        /* dadosJuros.valorLiquido.value = (
            valorCheque - valorJuros
        ).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
        });*/

        // calculaValorLiquido();
    };

    const buscaBancos = (codigo) => {
        const dadosBanco = ref.current;

        const bancoFiltrado = arrayBancos.filter((b) => b.code === codigo * 1);
        dadosBanco.banco.value = '';
        bancoFiltrado.map((banco) => {
            dadosBanco.banco.value = banco.name;
            setFormatarCheque(true);
        });

        if (codigo == 'np' || codigo == 'NP') {
            dadosBanco.banco.value = 'NOTA PROMISSÓRIA';
            setFormatarCheque(false);
        }
        if (codigo == 'dp' || codigo == 'DP') {
            dadosBanco.banco.value = 'DUPLICATA';
            setFormatarCheque(false);
        }
        if (codigo == 'cc' || codigo == 'CC') {
            dadosBanco.banco.value = 'CARTÃO DE CRÉDITO';
            setFormatarCheque(false);
        }
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
        let somaValorTxTed = 0;
        let somaValorLiquido = 0;
        let somaQuantidadeCheques = lancamentos.length;
        let somaDeducao = 0;

        lancamentos.map((resumo) => {
            somaValorCheques = somaValorCheques * 1 + resumo.valor_cheque * 1;
            somaValorJuros = somaValorJuros * 1 + resumo.valor_juros * 1;
            somaValorTxTed = somaValorTxTed * 1 + resumo.taxa_ted * 1;
            somaValorLiquido = somaValorLiquido * 1 + resumo.valor_liquido * 1;
        });

        deducao.map((ded) => {
            somaDeducao = somaDeducao * 1 + ded.valor_total * 1;
        });

        somaValorLiquido = somaValorLiquido * 1 - somaDeducao * 1;

        dadosResumo.totalDeducao.value = somaDeducao.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        dadosResumo.totalBruto.value = somaValorCheques.toLocaleString(
            'pt-BR',
            {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
        dadosResumo.totalJuros.value = somaValorJuros.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
        });

        dadosResumo.totalTxTed.value = somaValorTxTed.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        dadosResumo.totalLiquido.value = somaValorLiquido.toLocaleString(
            'pt-BR',
            {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
        dadosResumo.quantidadeCheques.value = somaQuantidadeCheques;
    };

    const editarCheque = (id) => {
        //varIncluirCheque = false;
        setVarIncluirCheque(false);

        setGravarDoc(true);
        localStorage.setItem('gravarDoc', true);

        const dadosLancamento = ref.current;
        dadosLancamento.btnIncluirLancamento.innerText = 'Alterar';

        const lancamentoFiltrado = lancamentos.filter(
            (l) => l.index === id * 1
        );
        lancamentoFiltrado.map((lanc) => {
            document.getElementById('inputNbco').focus();
            dadosLancamento.numeroBanco.value = lanc.numero_banco;
            dadosLancamento.banco.value = lanc.nome_banco;
            dadosLancamento.numeroCheque.value = lanc.numero_cheque;
            setNomeEmitente(lanc.nome_cheque);
            // dadosLancamento.nomeCheque.value = lanc.nome_cheque;
            dadosLancamento.dataVencimento.value = lanc.data_vencimento;
            dadosLancamento.valorCheque.value = (
                lanc.valor_cheque * 1
            ).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            dadosLancamento.valorJuros.value = (
                lanc.valor_juros * 1
            ).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            dadosLancamento.valorLiquido.value = (
                lanc.valor_liquido * 1
            ).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });

            dadosLancamento.txTed.value = (lanc.taxa_ted * 1).toLocaleString(
                'pt-BR',
                {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            );
            dadosLancamento.dias.value = lanc.dias;

            setIdIndexCheque(lanc.index);
        });
    };

    const formataValorTaxa = () => {
        const dadosTaxa = ref.current;

        let vl = dadosTaxa.txTed.value;

        vl = converteMoedaFloat(vl);

        dadosTaxa.txTed.value = vl.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const excluirCheque = async (id) => {
        if (confirm('Confirmar exclusão do Cheque?')) {
            //varIncluirCheque = false;
            setVarIncluirCheque(true);

            setGravarDoc(true);
            localStorage.setItem('gravarDoc', true);

            const dadosLancamento = ref.current;
            if (onEdit) {
                await apiFactoring
                    .post(
                        '/excluir-cheque',
                        { idlancamento: lancamentos[id].idlancamento },
                        {
                            headers: {
                                'x-access-token': localStorage.getItem('user'),
                            },
                        }
                    )
                    .then(({ data }) => {
                        toast.success(data);

                        const lancamentoFiltrado = lancamentos.filter(
                            (l) => l.index != id * 1
                        );

                        arrayCheques = [...lancamentoFiltrado];
                        setLancamentos(arrayCheques);
                        //  BuscaCheques();
                    })
                    .catch((err) => {
                        toast.error(err.response.data);
                    });
            }
            if (!onEdit) {
                const lancamentoFiltrado = lancamentos.filter(
                    (l) => l.index != id * 1
                );

                arrayCheques = [];
                lancamentoFiltrado.map((lanc, index) => {
                    arrayCheques = [
                        ...arrayCheques,
                        {
                            index: index,
                            idlancamento: lanc.idlancamento,
                            numero_banco: lanc.numero_banco,
                            nome_banco: lanc.nome_banco,
                            numero_cheque: lanc.numero_cheque,
                            nome_cheque: lanc.nome_cheque,
                            data_vencimento: lanc.data_vencimento,
                            status: lanc.status,
                            taxa_ted: lanc.taxa_ted,
                            valor_cheque: lanc.valor_cheque,
                            dias: lanc.dias,
                            valor_juros: lanc.valor_juros,
                            valor_liquido: lanc.valor_liquido,
                            idBordero: lanc.idBordero,
                        },
                    ];
                });

                setLancamentos(arrayCheques);
            }
        }
    };

    const imprimir = () => {
        const dadosOperacao = ref.current;

        let jurosTotal = converteMoedaFloat(dadosOperacao.totalJuros.value);

        const win = window.open('', '', 'heigth=700, width=700');
        win.document.write('<html>');
        win.document.write('<head >');
        win.document.write('<title></title>');
        win.document.write('</head>');
        win.document.write('<body>');
        win.document.write(
            '<table border="0" style="width: 300px; font-size: 10px">'
        );
        win.document.write('<tr><td colspan="5" style="text-align : right">');
        win.document.write(dataHoraAtual());
        win.document.write('</td></tr>');
        win.document.write('<tr ><td colspan="5" style="text-align : center">');
        win.document.write(
            '----------------------------------------------------------------------------------------'
        );

        win.document.write('<tr>');
        win.document.write(
            '<td colspan="3" style="text-transform: uppercase">'
        );
        var nome = dadosOperacao.nome.value;
        var nome2 = nome.slice(0, 25);
        win.document.write(nome2);

        win.document.write('</td>');

        win.document.write('<td>');
        win.document.write(inverteData(dadosOperacao.data.value));
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write('Op: ' + dadosOperacao.operacao.value);
        win.document.write('</td>');
        win.document.write('</tr>');

        win.document.write('<tr><td colspan="5" style="text-align : center">');
        win.document.write(
            '----------------------------------------------------------------------------------------'
        );
        win.document.write('</td ></tr >');

        win.document.write('<tr>');
        win.document.write('<td colspan="5">');
        win.document.write('Observação: ' + dadosOperacao.txtObs.value);
        win.document.write('</td>');
        win.document.write('</tr>');

        win.document.write('<tr><td colspan="5" style="text-align : center">');
        win.document.write(
            '----------------------------------------------------------------------------------------'
        );
        win.document.write('</td ></tr >');

        win.document.write('<tr>');
        win.document.write('<td width="45">');
        win.document.write('Nº Cheque');
        win.document.write('</td>');

        win.document.write('<td width="30" style="text-align: right">');
        win.document.write('Vencimento');
        win.document.write('</td>');

        win.document.write('<td style="text-align: right">');
        win.document.write('Valor');
        win.document.write('</td>');

        win.document.write('<td style="text-align: right">');
        win.document.write('Taxa');
        win.document.write('</td>');

        win.document.write('<td  style="text-align: right">');
        win.document.write(
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Juros'
        );

        win.document.write('</td>');
        win.document.write('</tr>');

        lancamentos.map((cheque, index) => {
            win.document.write('<tr>');
            win.document.write('<td>');
            win.document.write(cheque.numero_cheque);
            win.document.write('</td>');
            win.document.write('<td style="text-align: right">');
            win.document.write(inverteData(cheque.data_vencimento));
            win.document.write('</td>');
            win.document.write('<td style="text-align: right">');
            win.document.write(
                (cheque.valor_cheque * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            );
            win.document.write('</td>');

            win.document.write('<td style="text-align: right">');
            win.document.write(
                (cheque.taxa_ted * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            );
            win.document.write('</td>');

            win.document.write('<td style="text-align: right">');
            win.document.write(
                (cheque.valor_juros * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            );
            win.document.write('</td>');
            win.document.write('</tr>');
        });

        win.document.write('<tr><td colspan="5" style="text-align : center">');
        win.document.write(
            '----------------------------------------------------------------------------------------'
        );
        win.document.write('</td ></tr >');
        ////Deduções

        win.document.write('<tr>');
        win.document.write('<td>');
        win.document.write('Nº Cheque');
        win.document.write('</td>');

        win.document.write('<td style="text-align: right">');
        win.document.write('Devolução');
        win.document.write('</td>');

        win.document.write('<td style="text-align: right">');
        win.document.write('Valor');
        win.document.write('</td>');

        win.document.write('<td style="text-align: right">');
        win.document.write('Taxa');
        win.document.write('</td>');

        win.document.write('<td  style="text-align: right">');
        win.document.write(
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Juros'
        );

        win.document.write('</td>');
        win.document.write('</tr>');
        let jurosDevolucao = 0;
        deducao.map((ded, index) => {
            jurosDevolucao = jurosDevolucao * 1 + ded.juros_devolucao * 1;

            win.document.write('<tr>');
            win.document.write('<td>');
            win.document.write(ded.numero_cheque);
            win.document.write('</td>');
            win.document.write('<td style="text-align: right">');
            win.document.write(inverteData(ded.data_devolucao));
            win.document.write('</td>');
            win.document.write('<td style="text-align: right">');
            win.document.write(
                (ded.valor_cheque * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            );
            win.document.write('</td>');

            win.document.write('<td style="text-align: right">');
            win.document.write(
                (ded.taxa_cheque * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            );
            win.document.write('</td>');

            win.document.write('<td style="text-align: right">');
            win.document.write(
                (ded.juros_devolucao * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            );
            win.document.write('</td>');
            win.document.write('</tr>');
        });

        ////

        win.document.write('<tr><td colspan="5" style="text-align : center">');
        win.document.write(
            '----------------------------------------------------------------------------------------'
        );
        win.document.write('</td ></tr >');

        win.document.write('<tr>');
        win.document.write('<td>');
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write(
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Total'
        );
        win.document.write('</td>');

        win.document.write('<td style="text-align: right">');
        win.document.write(dadosOperacao.totalBruto.value);
        win.document.write('</td>');

        win.document.write('<td style="text-align: right">');
        win.document.write(dadosOperacao.totalTxTed.value);
        win.document.write('</td>');

        win.document.write('<td style="text-align: right">');
        win.document.write(
            (jurosDevolucao * 1 + jurosTotal * 1).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );
        win.document.write('</td>');

        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td>');
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Liquido');
        win.document.write('</td>');

        win.document.write('<td style="text-align: right">');
        win.document.write(dadosOperacao.totalLiquido.value);
        win.document.write('</td>');
        win.document.write('<td style="text-align: right">');
        win.document.write('</td>');
        win.document.write('</tr>');

        win.document.write('</body>');
        win.document.write('</html>');
        win.print();
        //  win.close();
    };

    //VEFIFICA SE É USUARIO ADMIM PARA LIBERAR EDIÇÃO DO VL. JUROS
    const vefificaPermissao = async () => {
        await apiFactoring
            .post(
                '/lista-grupos-permissao',
                {},
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {})
            .catch(({ err }) => {
                document.getElementById('inputValorJuros').readOnly = true;
            });
    };

    const listaChequesDevolvidos = async (id) => {
        arrayDevolvidos = [];

        await apiFactoring
            .post(
                '/lista-cheques-devolvidos',
                { idCliente: id },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                data.map((item) => {
                    let dias = calculaDiasDevolucao(item.data_devolucao);
                    let juros_devolucao = calculaValorJurosDevolucao(
                        dias,
                        item.valor_cheque
                    );
                    arrayDevolvidos = [
                        ...arrayDevolvidos,
                        {
                            numero_banco: item.numero_banco,
                            nome_banco: item.nome_banco,
                            numero_cheque: item.numero_cheque,
                            nome_cheque: item.nome_cheque,
                            data_devolucao: item.data_devolucao,
                            valor_cheque: item.valor_cheque,
                            dias: dias,
                            juros_devolucao: juros_devolucao,
                            valor_total:
                                item.valor_cheque * 1 + juros_devolucao * 1,
                            idlancamento: item.idlancamento,
                            taxa_ted: item.taxa_ted,
                        },
                    ];
                });

                setDevolvidos(arrayDevolvidos);
            })
            .catch();
    };

    const listaChequesDeduzidos = async (idBordero) => {
        let arrayDeduzidos = [];

        await apiFactoring
            .post(
                '/lista-cheques-deduzidos',
                { idBordero: idBordero },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                data.map((item) => {
                    let dias = calculaDiasDevolucao(item.data_devolucao);
                    let juros_devolucao = calculaValorJurosDevolucao(
                        dias,
                        item.valor_cheque
                    );
                    arrayDeduzidos = [
                        ...arrayDeduzidos,
                        {
                            numero_banco: item.numero_banco,
                            nome_banco: item.nome_banco,
                            numero_cheque: item.numero_cheque,
                            nome_cheque: item.nome_cheque,
                            data_devolucao: item.data_devolucao,
                            valor_cheque: item.valor_cheque,
                            dias: dias,
                            juros_devolucao: item.juros_devolucao,
                            valor_total:
                                item.valor_cheque * 1 + juros_devolucao * 1,
                            idlancamento: item.idlancamento,
                            taxa_ted: item.taxa_ted,
                        },
                    ];
                });

                setDeducao(arrayDeduzidos);
            })
            .catch();
    };

    const addDeducao = (id, index) => {
        const filtradoDevolvidos = devolvidos.filter(
            (l) => l.idlancamento === id * 1
        );

        arrayDeducao = [
            ...deducao,
            {
                numero_banco: filtradoDevolvidos[0].numero_banco,
                nome_banco: filtradoDevolvidos[0].nome_banco,
                numero_cheque: filtradoDevolvidos[0].numero_cheque,
                nome_cheque: filtradoDevolvidos[0].nome_cheque,
                data_devolucao: filtradoDevolvidos[0].data_devolucao,
                valor_cheque: filtradoDevolvidos[0].valor_cheque,
                dias: filtradoDevolvidos[0].dias,
                juros_devolucao: filtradoDevolvidos[0].juros_devolucao,
                valor_total: filtradoDevolvidos[0].valor_total,
                idlancamento: filtradoDevolvidos[0].idlancamento,
                taxa_ted: filtradoDevolvidos[0].taxa_ted,
            },
        ];

        const newArray = devolvidos.filter(
            (arrayDev) => arrayDev.idlancamento !== id
        );

        setDevolvidos(newArray);

        setDeducao(arrayDeducao);
    };

    const removeDeducao = (id, index) => {
        const filtradoDevolvidos = deducao.filter(
            (l) => l.idlancamento === id * 1
        );

        arrayDevolvidos = [
            ...devolvidos,
            {
                numero_banco: filtradoDevolvidos[0].numero_banco,
                nome_banco: filtradoDevolvidos[0].nome_banco,
                numero_cheque: filtradoDevolvidos[0].numero_cheque,
                nome_cheque: filtradoDevolvidos[0].nome_cheque,
                data_devolucao: filtradoDevolvidos[0].data_devolucao,
                valor_cheque: filtradoDevolvidos[0].valor_cheque,
                dias: filtradoDevolvidos[0].dias,
                juros_devolucao: filtradoDevolvidos[0].juros_devolucao,
                valor_total: filtradoDevolvidos[0].valor_total,
                idlancamento: filtradoDevolvidos[0].idlancamento,
                taxa_ted: filtradoDevolvidos[0].taxa_ted,
            },
        ];

        const newArray = deducao.filter(
            (arrayDed) => arrayDed.idlancamento !== id
        );
        setDeducao(newArray);

        setDevolvidos(arrayDevolvidos);
    };

    const completaNome = () => {
        //  const dadosCliente = ref.current;
        //dadosCliente.nomeCheque.value = dadosCliente.nome.value;
        dadosCliente.nomeCheque.select();
    };

    //consulta cheques a vencer do emitente a partir da data atual
    const buscaConcentracaoEmitente = async () => {
        const dadosRelatorio = ref.current;
        var dataI = dadosRelatorio.data.value;
        var dataF = '3000-01-01';

        await apiFactoring
            .post(
                '/relatorio-cheque-emitente-vencimento',
                {
                    dataI: dataI,
                    dataF: dataF,
                    status: 'GERAL',
                    emitente: nomeEmitente,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                let valorChequeEmitente = 0;
                setQuantidadeChequeEmitente(data.length);

                data.map((item) => {
                    valorChequeEmitente =
                        valorChequeEmitente + item.valor_cheque * 1;
                });
                setValorTotalChequeEmitente(valorChequeEmitente);
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const sair = () => {
        localStorage.setItem('gravarDoc', false);
        navigate('/');
    };

    const listaClientes = async () => {
        await apiFactoring
            .post(
                '/lista-clientes',
                {},
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setClientes(data);
            })
            .catch((error) => {});
    };

    const buscaEmitente = async () => {
        await apiFactoring
            .post(
                '/lista-emitentes',
                { emitente: '' },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setEmitente(data);
            })
            .catch((error) => {
                toast.error(error.response.status);

                signOut();
            });
    };

    const FiltraCliente = (busca) => {
        setClienteFiltrado(
            clientes.filter((C) =>
                C.nome.toUpperCase().includes(busca.toUpperCase())
            )
        );
    };

    const FiltraEmitente = (busca) => {
        setEmitenteFiltrado(
            emitente.filter((E) =>
                E.nome_cheque.toUpperCase().includes(busca.toUpperCase())
            )
        );
    };

    useEffect(() => {
        vefificaPermissao();
        listaClientes();
        buscaEmitente();
    }, []);

    useEffect(() => {
        buscaConcentracaoEmitente();
    }, [nomeEmitente]);

    useEffect(() => {
        atualizaResumo();
    }, [lancamentos, deducao]);

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
        carregaBancos();
        buscaTaxaMinina();
        setLancamentos([]);
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
                    autoClose={5000}
                    position={toast.POSITION.BOTTOM_CENTER}
                />
                <div className="boxOpChequeLeft">
                    <h1>Cheques</h1>

                    <div className="boxRow">
                        {!onEdit && (
                            <button id="btnGravarEmprestimo" onClick={gravar}>
                                Gravar
                            </button>
                        )}
                        {onEdit && (
                            <button id="btnGravarEmprestimo" onClick={limpa}>
                                Novo
                            </button>
                        )}
                        {onEdit && (
                            <button id="btnGravarEmprestimo" onClick={gravar}>
                                Gravar Alteração
                            </button>
                        )}
                        {onEdit && gravarDoc == '' && (
                            <button id="btnImprimir" onClick={imprimir}>
                                Imprimir
                            </button>
                        )}
                        <ImExit id="iconeExit" onClick={(e) => sair()} />
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
                                className="icone2"
                                onClick={exibeFormBuscaOperacao}
                            />
                            <input
                                type="date"
                                name="data"
                                autoComplete="off"
                                readOnly
                            />
                        </div>
                        <div className="boxRow">
                            {' '}
                            <label>Cliente</label>
                        </div>

                        <div className="boxRow">
                            <input
                                type="text"
                                id="inputIdCliente"
                                name="idCliente"
                                autoComplete="off"
                                onKeyDown={(e) => keyDown(e, 'inputCliente')}
                                onChange={(e) => setIdCliente(e.target.value)}
                            />
                        </div>
                        <div className="boxCol">
                            <input
                                id="inputCliente"
                                type="text"
                                name="nome"
                                placeholder=""
                                spellCheck="false"
                                autoComplete="off"
                                onKeyDown={(e) =>
                                    keyDown(
                                        e,
                                        'inputDataBase',
                                        'cliente',
                                        'inputCliente0'
                                    )
                                }
                                onChange={(e) => {
                                    setFormBuscaDireto(true);
                                    FiltraCliente(e.target.value);
                                }}
                                onFocus={(e) => e.target.select()}
                            />
                            {formBuscaDireto == true && (
                                <BuscaClienteNomeDireto
                                    clienteFiltrado={clienteFiltrado}
                                    setIdCliente={setIdCliente}
                                    setFormBuscaDireto={setFormBuscaDireto}
                                    setClienteFiltrado={setClienteFiltrado}
                                />
                            )}
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
                                onFocus={(e) => {
                                    setFormBuscaDireto(false);
                                }}
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
                                onBlur={formataValorTaxa}
                                onChange={calculaValorJuros}
                                onFocus={(e) => {
                                    e.target.select();
                                    setFormBuscaDireto(false);
                                }}
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
                                onFocus={(e) => {
                                    formataJurosMensalOnFocus();
                                    setFormBuscaDireto(false);
                                }}
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
                                onFocus={(e) => {
                                    calculaJurosDiario();
                                    setFormBuscaDireto(false);
                                }}
                                onKeyDown={(e) => keyDown(e, 'inputNbco')}
                                readOnly
                                autoComplete="off"
                            />
                        </div>
                        <div className="boxCol">
                            <div className="alignRight">
                                <label>Especial</label>
                            </div>
                            <div className="alignRight">
                                <label>{especial}</label>
                            </div>
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
                                onFocus={(e) => {
                                    e.target.select();
                                    setFormBuscaDireto(false);
                                }}
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
                                onFocus={(e) => e.target.select()}
                            />
                        </div>

                        <div className="boxCol">
                            <label>Nº Cheque</label>
                            <div>
                                <input
                                    type="checkbox"
                                    checked={formatarCheque}
                                    onChange={(e) =>
                                        e.target.checked(formatarCheque)
                                    }
                                    onClick={(e) =>
                                        setFormatarCheque(!formatarCheque)
                                    }
                                />

                                {formatarCheque && (
                                    <input
                                        id="inputNcheque"
                                        type="text"
                                        name="numeroCheque"
                                        placeholder=""
                                        onKeyDown={(e) =>
                                            keyDown(e, 'inputNomeC')
                                        }
                                        autoComplete="off"
                                        onFocus={(e) => e.target.select()}
                                        onKeyUp={(e) =>
                                            handleNumeroCheuque(e.target.value)
                                        }
                                    />
                                )}

                                {!formatarCheque && (
                                    <input
                                        id="inputNcheque"
                                        type="text"
                                        name="numeroCheque"
                                        placeholder=""
                                        onKeyDown={(e) =>
                                            keyDown(e, 'inputNomeC')
                                        }
                                        autoComplete="off"
                                        onFocus={(e) => e.target.select()}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="boxRow">
                            <div className="boxCol">
                                <label>Nome do Emitente</label>
                                <div className="boxRow">
                                    <input
                                        id="inputNomeC"
                                        type="text"
                                        name="nomeCheque"
                                        value={nomeEmitente}
                                        placeholder="Nome"
                                        onKeyDown={(e) =>
                                            keyDown(
                                                e,
                                                'inputVencimento',
                                                'emitente',
                                                'inputEmitente0'
                                            )
                                        }
                                        autoComplete="off"
                                        spellCheck="false"
                                        onChange={(e) => {
                                            FiltraEmitente(e.target.value);
                                            setNomeEmitente(e.target.value);
                                            setFormBuscaEmitente(true);
                                        }}
                                        onFocus={(e) => e.target.select()}
                                    />
                                    {formBuscaEmitente == true && (
                                        <BuscaEmitente
                                            setFormBusca={setFormBuscaEmitente}
                                            setNomeEmitente={setNomeEmitente}
                                            emitenteFiltrado={emitenteFiltrado}
                                        />
                                    )}
                                </div>
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
                                onBlur={calculaDiasUteis}
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
                                onFocus={(e) => e.target.select()}
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
                                    onChange={calculaValorLiquido}
                                    onFocus={(e) => e.target.select()}
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
                            name="btnIncluirLancamento"
                            onClick={incluirCheque}
                        >
                            Incluir
                        </button>
                    </div>

                    <div className="boxRow">
                        <div id="divObs">
                            <textarea
                                name="txtObs"
                                id="textAreaObs"
                                placeholder="Observação"
                                spellCheck="false"
                                autoComplete="off"
                            />
                        </div>
                        <div id="divConcentracao">
                            <label>Cheques a vencer do Emitente</label>
                            {quantidadeChequeEmitente}
                            &nbsp;&nbsp;/&nbsp;&nbsp;R$&nbsp;
                            {valorTotalChequeEmitente.toLocaleString('pt-BR', {
                                style: 'decimal',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </div>
                    </div>

                    <div className="boxRow">
                        <button
                            className="buttonTab"
                            onClick={(e) => setTab('cheques')}
                        >
                            Cheques
                        </button>
                        <button
                            className="buttonTab"
                            onClick={(e) => setTab('deducao')}
                        >
                            Deduções
                        </button>
                        <button
                            className="buttonTab"
                            onClick={(e) => setTab('devolvido')}
                        >
                            Devolvidos
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
                        <label>Total Juros</label>
                        <input
                            type="text"
                            value={somaValorJuros}
                            autoComplete="off"
                            name="totalJuros"
                        />
                    </div>

                    <div className="boxResumo">
                        <label>Total Ted</label>
                        <input
                            type="text"
                            autoComplete="off"
                            name="totalTxTed"
                        />
                    </div>

                    <div className="boxResumo">
                        <label>Deduções</label>
                        <input
                            type="text"
                            name="totalDeducao"
                            autoComplete="off"
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
                </div>{' '}
            </form>

            {tab === 'cheques' && (
                <>
                    <div className="gridCheque">
                        <div>N.Banco</div>
                        <div>Banco</div>
                        <div className="alignCenter">N. Cheque</div>
                        <div>Nome</div>
                        <div className="alignRight">Vencimento</div>
                        <div className="alignRight">Prazo&nbsp;&nbsp;</div>
                        <div className="alignRight">Valor&nbsp;&nbsp;</div>
                        <div className="alignRight">V. Juros&nbsp;&nbsp;</div>
                        <div className="alignRight">Taxa&nbsp;&nbsp;</div>
                        <div className="alignRight">V. Liquido&nbsp;&nbsp;</div>
                        <div className="alignRight">
                            Editar&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                    </div>

                    <div className="containerCheques">
                        {lancamentos.map((item, index) => (
                            <div className="gridLinhaCheque" key={index}>
                                <div>{item.numero_banco}</div>
                                <div id="maximo_200px">{item.nome_banco}</div>
                                <div className="alignCenter">
                                    {item.numero_cheque}
                                </div>
                                <div id="maximo_200px">{item.nome_cheque}</div>

                                <div className="alignRight">
                                    {inverteData(item.data_vencimento)}
                                </div>

                                <div className="alignRight">
                                    {item.dias} dias
                                </div>
                                <div className="alignRight">
                                    {(item.valor_cheque * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                                <div className="alignRight">
                                    {(item.valor_juros * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                                <div className="alignRight">
                                    {(item.taxa_ted * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                                <div className="alignRight">
                                    {(item.valor_liquido * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                                <div className="alignRight">
                                    <FiEdit
                                        onClick={(e) =>
                                            editarCheque(item.index)
                                        }
                                    />
                                    &nbsp;&nbsp;&nbsp;
                                    <ImBin
                                        onClick={(e) =>
                                            excluirCheque(item.index)
                                        }
                                    />
                                    &nbsp;
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {tab === 'deducao' && (
                <>
                    <div className="gridCheque">
                        <div>N.Banco</div>
                        <div>Banco</div>
                        <div className="alignCenter">N. Cheque</div>
                        <div>Nome</div>
                        <div className="alignRight">Devolução</div>
                        <div className="alignRight">Dias&nbsp;&nbsp;</div>
                        <div className="alignRight">Valor&nbsp;&nbsp;</div>
                        <div className="alignRight">V. juros&nbsp;&nbsp;</div>
                        <div className="alignRight">V. Total&nbsp;&nbsp;</div>
                        <div className="alignRight">
                            Excluir&nbsp;&nbsp;&nbsp;
                        </div>
                    </div>

                    <div className="containerCheques">
                        {deducao.map((item, index) => (
                            <div className="gridLinhaCheque" key={index}>
                                <div>{item.numero_banco}</div>
                                <div id="maximo_200px">{item.nome_banco}</div>
                                <div className="alignCenter">
                                    {item.numero_cheque}
                                </div>
                                <div id="maximo_200px">{item.nome_cheque}</div>

                                <div className="alignRight">
                                    {inverteData(item.data_devolucao)}
                                </div>

                                <div className="alignRight">
                                    {item.dias} dias
                                </div>
                                <div className="alignRight">
                                    {(item.valor_cheque * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                                <div className="alignRight">
                                    {item.juros_devolucao}
                                </div>

                                <div className="alignRight">
                                    {(item.valor_total * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                                <div className="alignRight">
                                    <AiFillCheckCircle
                                        onClick={(e) =>
                                            removeDeducao(
                                                item.idlancamento,
                                                index
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {tab === 'devolvido' && (
                <>
                    <div className="gridCheque">
                        <div>N.Banco</div>
                        <div>Banco</div>
                        <div className="alignCenter">N. Cheque</div>
                        <div>Nome</div>
                        <div className="alignRight">Devolução</div>
                        <div className="alignRight">Dias&nbsp;&nbsp;</div>
                        <div className="alignRight">Valor&nbsp;&nbsp;</div>
                        <div className="alignRight">V. juros&nbsp;&nbsp;</div>
                        <div className="alignRight">V. Total&nbsp;&nbsp;</div>
                        <div className="alignRight">
                            Deduzir&nbsp;&nbsp;&nbsp;
                        </div>
                    </div>
                    <div className="containerCheques">
                        {devolvidos.map((item, index) => (
                            <div className="gridLinhaCheque" key={index}>
                                <div>{item.numero_banco}</div>
                                <div id="maximo_200px">{item.nome_banco}</div>
                                <div className="alignCenter">
                                    {item.numero_cheque}
                                </div>
                                <div id="maximo_200px">{item.nome_cheque}</div>

                                <div className="alignRight">
                                    {inverteData(item.data_devolucao)}
                                </div>

                                <div className="alignRight">
                                    {item.dias} dias
                                </div>
                                <div className="alignRight">
                                    {(item.valor_cheque * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                                <div className="alignRight">
                                    {item.juros_devolucao.toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </div>

                                <div className="alignRight">
                                    {item.valor_total.toLocaleString('pt-BR', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </div>
                                <div className="alignRight">
                                    <AiFillCheckCircle
                                        onClick={(e) =>
                                            addDeducao(item.idlancamento, index)
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};
