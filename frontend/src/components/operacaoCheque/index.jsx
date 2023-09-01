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
} from '../../biblitoteca';
import { BuscaOperacao } from '../buscaOperacaoCheque';
import { AuthProvider } from '../../context/authContext';
import axios from 'axios';
import { ImBin } from 'react-icons/im';

export const FormOperacaoCheque = () => {
    const [onEdit, setOnEdit] = useState(false);

    const [devolvidos, setDevolvidos] = useState([]);
    let arrayDevolvidos = [];

    const [deducao, setDeducao] = useState([]);
    let arrayDeducao = [];

    const [diasDevolucao, setDiasDevolucao] = useState();

    const [lancamentos, setLancamentos] = useState([]);
    let arrayCheques = [];

    const [formBusca, setFormBusca] = useState(false);

    const [idBordero, setIdBordero] = useState('0');

    const [dias, setDias] = useState();

    const [formBuscaOperacao, setFormBuscaOperacao] = useState(false);

    let varIncluirCheque = true;
    let idIndexCheque = 0;

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
                        document.getElementById('inputTxTed').focus();
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
                            dadosOperacao.txTed.value = (
                                dados.taxa_ted * 1
                            ).toLocaleString('pt-BR', {
                                style: 'decimal',
                                minimumFractionDigits: 2,
                            });
                            dadosOperacao.jurosMensal.value = dados.juros;
                            dadosOperacao.jurosDiario.value =
                                dados.juros_diario;
                            console.log(dados.idcliente);
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
            console.log('gravar novo...');
        }

        if (onEdit == true) {
            alterarBorderdo();

            console.log('gravar alteracao');
        }
    };

    const alterarBorderdo = async () => {
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

        console.log(lancamentos);
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
                    arrayDeducao: deducao,
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

        console.log(lancamentos);
    };

    const incluirCheque = () => {
        const dadosLancamento = ref.current;

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
            if (
                dadosLancamento.valorJuros.value == '' ||
                dadosLancamento.valorJuros.value == '0,00'
            ) {
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
                dadosLancamento.txTed.value = '0';
            } else {
                toast.error('Compos obrigatórios não preenchidos!');
                document.getElementById('inputTxTed').focus();
            }
        } else {
            dadosLancamento.btnIncluirLancamento.innerText = 'Incluir';
            gravarAlteracaoCheque(idIndexCheque);
        }
    };

    const gravarAlteracaoCheque = () => {
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

        console.log(lancamentos);

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
        dadosLancamento.txTed.value = '0';
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
        const dadosJuros = ref.current;

        const jurosDiario = dadosJuros.jurosDiario.value;
        const dias = dadosJuros.dias.value;
        const valorCheque = converteMoedaFloat(dadosJuros.valorCheque.value);

        let valorJuros = 0;

        //calcula juros
        const valorJurosCliente = (dias * jurosDiario * valorCheque) / 100;
        console.log(valorJurosCliente + ' cliente');

        //calcula juros minimo pela taxa da factoring
        const valorJurosMinimo = (taxaMinima * valorCheque) / 100;
        console.log(valorJurosMinimo + ' empresa');

        if (especial != 'SIM' && valorJurosMinimo > valorJurosCliente) {
            valorJuros = valorJurosMinimo;
        }

        if (especial != 'SIM' && valorJurosMinimo < valorJurosCliente) {
            valorJuros = valorJurosCliente;
        }

        if (especial == 'SIM') {
            valorJuros = valorJurosCliente;
        }

        dadosJuros.valorJuros.value = valorJuros.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
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
        });
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
        calculaValorJuros();

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
        console.log(dias);

        //calcula juros
        const valorJurosCliente = (dias * jurosDiario * valorCheque) / 100;

        //calcula juros minimo pela taxa da factoring
        const valorJurosMinimo = (taxaMinima * valorCheque) / 100;

        if (especial != 'SIM' && valorJurosMinimo > valorJurosCliente) {
            valorJuros = valorJurosMinimo;
            console.log('especial - nao . jm > jc ' + valorJuros);
        }

        if (especial != 'SIM' && valorJurosMinimo < valorJurosCliente) {
            valorJuros = valorJurosCliente;
            console.log('especial - nao . jm < jc ' + valorJuros);
        }

        if (especial == 'SIM') {
            valorJuros = valorJurosCliente;
            console.log('especial - sim . jm = jc ' + valorJuros);
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
        });
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
        console.log('atualizou');
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

        dadosResumo.totalTxTed.value = somaValorTxTed.toLocaleString('pt-BR', {
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

    const editarCheque = (id) => {
        varIncluirCheque = false;

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
            dadosLancamento.nomeCheque.value = lanc.nome_cheque;
            dadosLancamento.dataVencimento.value = lanc.data_vencimento;
            dadosLancamento.valorCheque.value = (
                lanc.valor_cheque * 1
            ).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
            });
            dadosLancamento.valorJuros.value = (
                lanc.valor_juros * 1
            ).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
            });
            dadosLancamento.valorLiquido.value = (
                lanc.valor_liquido * 1
            ).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
            });

            dadosLancamento.txTed.value = (lanc.taxa_ted * 1).toLocaleString(
                'pt-BR',
                {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                }
            );
            dadosLancamento.dias.value = lanc.dias;

            idIndexCheque = lanc.index;
        });
    };

    const formataValorTaxa = () => {
        const dadosTaxa = ref.current;

        let vl = dadosTaxa.txTed.value;

        vl = converteMoedaFloat(vl);

        dadosTaxa.txTed.value = vl.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
        });
    };

    const excluirCheque = async (id) => {
        varIncluirCheque = false;

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
                    lancamentos.splice([id]);
                    arrayCheques = [...lancamentos];
                    setLancamentos(arrayCheques);
                })
                .catch((err) => {
                    toast.error(err.response.data);
                });
        }
        if (!onEdit) {
            lancamentos.splice([i]);
            arrayCheques = [...lancamentos];
            setLancamentos(arrayCheques);
        }
        BuscaCheques();
    };

    const imprimir = () => {
        const dadosOperacao = ref.current;

        let jurosTotal = converteMoedaFloat(dadosOperacao.totalJuros.value);
        console.log(jurosTotal);

        const win = window.open('', '', 'heigth=700, width=700');
        win.document.write('<html>');
        win.document.write('<head >');
        win.document.write('<title></title>');
        win.document.write('</head>');
        win.document.write('<body>');
        win.document.write('<table border="0" style="width: 500px">');
        win.document.write('<tr><td colspan="5" style="text-align : right">');
        win.document.write(dataHoraAtual());
        win.document.write('</td></tr>');
        win.document.write('<tr ><td colspan="5" style="text-align : center">');
        win.document.write(
            '--------------------------------------------------------------------------------------------'
        );

        win.document.write('<tr>');
        win.document.write(
            '<td colspan="3" style="text-transform: uppercase">'
        );
        win.document.write(dadosOperacao.nome.value);
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
            '--------------------------------------------------------------------------------------------'
        );
        win.document.write('</td ></tr >');

        win.document.write('<tr>');
        win.document.write('<td>');
        win.document.write('Nº Cheque');
        win.document.write('</td>');

        win.document.write('<td style="text-align: right">');
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
                })
            );
            win.document.write('</td>');

            win.document.write('<td style="text-align: right">');
            win.document.write(
                (cheque.taxa_ted * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            );
            win.document.write('</td>');

            win.document.write('<td style="text-align: right">');
            win.document.write(
                (cheque.valor_juros * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            );
            win.document.write('</td>');
            win.document.write('</tr>');
        });

        win.document.write('<tr><td colspan="5" style="text-align : center">');
        win.document.write(
            '--------------------------------------------------------------------------------------------'
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
            console.log(jurosDevolucao);
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
                })
            );
            win.document.write('</td>');

            win.document.write('<td style="text-align: right">');
            win.document.write(
                (ded.taxa_cheque * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            );
            win.document.write('</td>');

            win.document.write('<td style="text-align: right">');
            win.document.write(
                (ded.juros_devolucao * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            );
            win.document.write('</td>');
            win.document.write('</tr>');
        });

        ////

        win.document.write('<tr><td colspan="5" style="text-align : center">');
        win.document.write(
            '--------------------------------------------------------------------------------------------'
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

                console.log(arrayDevolvidos);
            })
            .catch();
    };

    const listaChequesDeduzidos = async (idBordero) => {
        let arrayDeduzidos = [];
        console.log(idBordero);
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
                console.log(data);
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

                console.log(arrayDeduzidos);
            })
            .catch();
    };

    const addDeducao = (id, index) => {
        const filtradoDevolvidos = devolvidos.filter(
            (l) => l.idlancamento === id * 1
        );

        console.log(filtradoDevolvidos);

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

        console.log(newArray);

        setDevolvidos(newArray);

        setDeducao(arrayDeducao);
    };

    const removeDeducao = (id, index) => {
        console.log(id);

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

    useEffect(() => {
        vefificaPermissao();
    }, []);

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
                    autoClose={3000}
                    position={toast.POSITION.BOTTOM_LEFT}
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
                        {onEdit && (
                            <button id="btnImprimir" onClick={imprimir}>
                                Imprimir
                            </button>
                        )}
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
                            <input
                                type="date"
                                name="data"
                                autoComplete="off"
                                readOnly
                            />
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
                                onBlur={formataValorTaxa}
                                onChange={calculaValorJuros}
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
                                <label>Nome do Emitente</label>

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
                                    onChange={calculaValorLiquido}
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
                    <div>
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
                                        }
                                    )}
                                </div>
                                <div className="alignRight">
                                    {(item.valor_juros * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                                <div className="alignRight">
                                    {(item.taxa_ted * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                                <div className="alignRight">
                                    {(item.valor_liquido * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
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
                                        }
                                    )}
                                </div>

                                <div className="alignRight">
                                    {item.valor_total.toLocaleString('pt-BR', {
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
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
