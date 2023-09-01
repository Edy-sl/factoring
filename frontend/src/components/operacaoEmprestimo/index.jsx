import './formOperacionalEmprestimo.css';
import React, { useState, useRef, useEffect } from 'react';

import { apiFactoring } from '../../services/api';
import {
    feriadosFixos,
    converteMoedaFloat,
    converteFloatMoeda,
    keyDown,
    retornaDataAtual,
    cpfCnpjMask,
    calculaParcelaEmprestimo,
    formataDias,
    inverteData,
    formatarDataExtenso,
    dataHoraAtual,
} from '../../biblitoteca';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch, FiEdit, FiDollarSign } from 'react-icons/fi';
import { BuscaClienteNome } from '../buscaCliente';
import { BuscaEmprestimo } from '../buscaEmprestimo';
import { FormPagamentoEmprestimo } from '../pagamentoEmprestimo';
import extenso from 'extenso';

export const FormOperacionalEmprestimo = () => {
    const ref = useRef();

    const [arrayParcelas, setArrayParcelas] = useState([]);

    const [formBusca, setFormBusca] = useState(false);
    const [cnpjCpfCredor, setCnpjCpfCredor] = useState('');

    const [formBuscaEmprestimo, setFormBuscaEmprestimo] = useState();
    const [idEmprestimo, setIdEmprestimo] = useState();

    const [atualizaParcelas, setAtualizaParcelas] = useState(false);

    const [s_intervalo, setIntervalo] = useState(0);

    const [idCliente, setIdCliente] = useState();

    const [onEdit, setOnEdit] = useState(false);

    const [idParcela, setIdParcela] = useState(0);
    const [parcelaN, setParcelaN] = useState(0);

    const [dadosCliente, setDadosCliente] = useState([]);

    const [checkPrestacao, setCheckPrestacao] = useState(true);

    var valorPrestacao = 0;
    var valorTotalJuros = 0;
    var valorTotal = 0;

    var somaValorPago = 0;
    var valorRestante = 0;

    const dadosEmprestimo = ref.current;

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const calculaEmprestimo = () => {
        const dadosEmprestimo = ref.current;

        //guarda valor calculado pelo calculoEmprestimo...

        const parcela = parseInt(dadosEmprestimo.parcelas.value);
        const capital = converteMoedaFloat(
            dadosEmprestimo.valorEmprestimo.value
        );

        var calculoPrestacao = calculaParcelaEmprestimo(
            dadosEmprestimo.intervalo.value,
            dadosEmprestimo.jurosMensal.value,
            dadosEmprestimo.jurosDiario.value,
            dadosEmprestimo.parcelas.value,
            dadosEmprestimo.valorEmprestimo.value
        );

        calculoPrestacao.map((calculos) => {
            if (checkPrestacao) {
                console.log(checkPrestacao);
                valorPrestacao = calculos[0].prestacao;
                valorTotalJuros = calculos[0].valorTotalJuros;
                valorTotal = calculos[0].valorTotal;

                dadosEmprestimo.valorParcela.value = (
                    valorPrestacao * 1
                ).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                });

                dadosEmprestimo.valorInicial.value =
                    dadosEmprestimo.valorEmprestimo.value.toLocaleString(
                        'pt-BR',
                        {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        }
                    );
                dadosEmprestimo.valorTotalJuros.value = (
                    valorTotalJuros * 1
                ).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                });

                dadosEmprestimo.valorTotal.value = (
                    valorTotal * 1
                ).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                });
            } else {
                valorPrestacao = converteMoedaFloat(
                    dadosEmprestimo.valorParcela.value
                );
                valorTotal = valorPrestacao * parcela;
                var taxaJuros = valorTotal / valorPrestacao;

                console.log(taxaJuros);

                dadosEmprestimo.valorInicial.value =
                    dadosEmprestimo.valorEmprestimo.value.toLocaleString(
                        'pt-BR',
                        {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        }
                    );

                valorTotalJuros = valorTotal - capital;
                console.log(valorTotalJuros);

                dadosEmprestimo.valorTotalJuros.value =
                    valorTotalJuros.toLocaleString('pt-BR', {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                    });

                dadosEmprestimo.valorTotal.value = valorTotal.toLocaleString(
                    'pt-BR',
                    {
                        style: 'decimal',
                        minimumFractionDigits: 2,
                    }
                );
            }

            let arrayP = [];
            let intervalo = parseInt(dadosEmprestimo.intervalo.value) + 1;

            var vencimento = new Date(dadosEmprestimo.dataBase.value);
            vencimento.setDate(vencimento.getDate() + 1);

            let intervaloMes = 1;

            for (var i = 0; i < parcela; i++) {
                if (i > 0) {
                    vencimento = new Date(dadosEmprestimo.dataBase.value);
                    vencimento.setDate(
                        vencimento.getDate() + parseInt(intervalo)
                    );

                    if (intervalo > 1) {
                        intervalo =
                            parseInt(intervalo) +
                            parseInt(dadosEmprestimo.intervalo.value);
                    } else {
                        vencimento.setMonth(
                            vencimento.getMonth() + parseInt(intervaloMes)
                        );

                        intervaloMes = intervaloMes + 1;
                    }
                }

                //  let dataIntervalo = vencimento;

                /////////////////////////////////////////////////////////

                var data_vencimento = new Date(vencimento);

                //vefifica se é feriado e retorna +1 dia
                /* var add_dia = feriadosFixos(data_vencimento);
                add_dia == true &&
                    data_vencimento.setDate(data_vencimento.getDate() + 1);
                if ((add_dia == true) & (intervalo > 1)) {
                    intervalo++;
                }

                //vefifica é sabado ou domingo e acrescenta 1 ou 2 dias
                // e se o intervalo é maior do q 0 add +1 ao intervalo
                if (data_vencimento.getDay() == 0) {
                    data_vencimento.setDate(data_vencimento.getDate() + 1);
                    intervalo > 1 && intervalo++;
                }

                if (data_vencimento.getDay() == 6) {
                    data_vencimento.setDate(data_vencimento.getDate() + 2);
                    if (intervalo > 1) {
                        intervalo = intervalo + 2;
                    }
                }

                //vefifica novamentese é feriado e retorna +1 dia / apos o acrescimo do sabado ou domingo
                add_dia = feriadosFixos(data_vencimento);
                add_dia == true &&
                    data_vencimento.setDate(data_vencimento.getDate() + 1);
                if ((add_dia == true) & (intervalo > 1)) {
                    intervalo++;
                }*/

                data_vencimento = formataDias(data_vencimento);

                arrayP = [
                    ...arrayP,
                    {
                        p: i + 1,
                        valorPrestacao,
                        data_vencimento,
                    },
                ];
            }
            setArrayParcelas(arrayP);
        });
    };

    const exibeFormBusca = () => {
        setFormBusca(!formBusca);
    };

    const formataInt = () => {
        const dadosEmprestimo = ref.current;
        const campoIntervalo = dadosEmprestimo.intervalo.value;

        if (campoIntervalo == '') {
            dadosEmprestimo.intervalo.value = '0';
        }
    };

    const calculaJurosDiario = () => {
        const dadosJuros = ref.current;
        const jurosMensal = dadosJuros.jurosMensal.value;
        const jurosDiario = jurosMensal / 30;
        dadosJuros.jurosDiario.value = jurosDiario.toFixed(4);
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

    const formataValorEmprestimo = () => {
        const dadosEmprestimo = ref.current;

        let vl = dadosEmprestimo.valorEmprestimo.value;

        vl = converteMoedaFloat(vl);

        dadosEmprestimo.valorEmprestimo.value = vl.toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
        });
    };

    const gravarEmprestimo = async () => {
        const dadosEmprestimo = ref.current;

        const data = new Date();
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        const dataCadastro = ano + '-' + mes + '-' + dia;
        dadosEmprestimo.dataCadastro.value = dataCadastro;

        await apiFactoring
            .post(
                '/gravar-emprestimo',
                {
                    dataCadastro: dadosEmprestimo.dataCadastro.value,
                    idCliente: dadosEmprestimo.idClienteEmprestimo.value,
                    cnpjCpfCredor: dadosEmprestimo.cnpjCpfCredor.value,
                    nomeCredor: dadosEmprestimo.nomeCredor.value,
                    jurosMensal: dadosEmprestimo.jurosMensal.value * 1,
                    valorEmprestimo: converteMoedaFloat(
                        dadosEmprestimo.valorEmprestimo.value
                    ),
                    quatidadeParcelas: dadosEmprestimo.parcelas.value,
                    dataBase: dadosEmprestimo.dataBase.value,
                    intervalo: dadosEmprestimo.intervalo.value,
                    valorParcela: converteMoedaFloat(
                        dadosEmprestimo.valorParcela.value
                    ),
                    valorJuros: converteMoedaFloat(
                        dadosEmprestimo.valorTotalJuros.value
                    ),
                    valorTotal: converteMoedaFloat(
                        dadosEmprestimo.valorTotal.value
                    ),
                    idFactoring: localStorage.getItem('factoring'),
                    arrayParcelas: arrayParcelas,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                toast.success(data.msg);
                setIdEmprestimo(data.insertId);
                setOnEdit(true);
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const buscaEmprestimo = async () => {
        const dadosEmprestimo = ref.current;
        await apiFactoring
            .post(
                '/busca-emprestimo-id',
                {
                    emprestimo: idEmprestimo,
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
                        dadosEmprestimo.dataCadastro.value =
                            dados.data_cadastro;

                        setIdCliente(dados.idcliente);

                        dadosEmprestimo.nomeClienteEmprestimo.value =
                            dados.nome;
                        setCnpjCpfCredor(dados.cnpj_cpf_credor);
                        dadosEmprestimo.nomeCredor.value = dados.nome_credor;

                        dadosEmprestimo.jurosMensal.value = dados.juros_mensal;
                        dadosEmprestimo.valorEmprestimo.value = (
                            dados.valor_emprestimo * 1
                        ).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        });
                        dadosEmprestimo.parcelas.value =
                            dados.quantidade_parcelas;
                        dadosEmprestimo.dataBase.value = dados.data_base;
                        dadosEmprestimo.intervalo.value = dados.intervalo;
                        dadosEmprestimo.valorParcela.value = (
                            dados.valor_parcela * 1
                        ).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        });

                        dadosEmprestimo.valorInicial.value = (
                            dados.valor_emprestimo * 1
                        ).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        });

                        dadosEmprestimo.valorTotalJuros.value = (
                            dados.valor_juros * 1
                        ).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        });

                        dadosEmprestimo.valorTotal.value = (
                            dados.valor_total * 1
                        ).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                        });

                        calculaJurosDiario();
                        setOnEdit(true);
                    });
                }
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const buscaParcelas = async () => {
        somaValorPago = 0;
        valorRestante = 0;
        const dadosEmprestimo = ref.current;
        await apiFactoring
            .post(
                'busca-parcelas-idemprestimo',
                {
                    idEmprestimo: idEmprestimo,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                if (data.length > 0) {
                    console.log(data);
                    let arrayP = [];

                    data.map((item) => {
                        console.log(item.vencimento);
                        somaValorPago = somaValorPago + item.valor_pago * 1;
                        arrayP = [
                            ...arrayP,
                            {
                                idParcela: item.idparcela,
                                p: item.parcela,
                                valorPrestacao: item.valor,
                                data_vencimento: item.vencimento,
                                valorPago: item.valor_pago,
                            },
                        ];
                    });

                    setArrayParcelas(arrayP);
                }
            })
            .catch(({ data }) => {
                toast.error(data);
            });

        valorRestante = converteMoedaFloat(dadosEmprestimo.valorTotal.value);
        valorRestante = valorRestante - somaValorPago;

        dadosEmprestimo.valorPago.value = (somaValorPago * 1).toLocaleString(
            'pt-BR',
            {
                style: 'decimal',
                minimumFractionDigits: 2,
            }
        );
        dadosEmprestimo.valorRestante.value = (
            valorRestante * 1
        ).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
        });
    };

    const buscaClienteCodigo = async () => {
        const dadosCliente = ref.current;
        const idCliente = dadosCliente.idClienteEmprestimo.value;

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
                        dadosCliente.nomeClienteEmprestimo.value = dados.nome;
                        dadosCliente.jurosMensal.value = dados.taxa_juros;
                        setDadosCliente(dados);
                        calculaJurosDiario();
                    });
                }
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const exibirBuscaEmprestimo = () => {
        setFormBuscaEmprestimo(!formBuscaEmprestimo);
        setIdEmprestimo('0');
    };

    const formataCpfCnpj = () => {
        const dadosCredor = ref.current;
        let vCpfCnpj = dadosCredor.cnpjCpfCredor.value;

        setCnpjCpfCredor(cpfCnpjMask(vCpfCnpj));
    };

    const limpar = () => {
        setArrayParcelas([]);
        setCnpjCpfCredor('');
        setFormBuscaEmprestimo();
        setIdEmprestimo('0');
        setIntervalo('0');
        setIdCliente();
        setOnEdit(false);

        dadosEmprestimo.dataCadastro.value = retornaDataAtual();
        dadosEmprestimo.idClienteEmprestimo.value = '';
        dadosEmprestimo.nomeClienteEmprestimo.value = '';

        dadosEmprestimo.nomeCredor.value = '';

        dadosEmprestimo.jurosMensal.value = '';
        dadosEmprestimo.jurosDiario.value = '';
        dadosEmprestimo.valorEmprestimo.value = '';
        dadosEmprestimo.parcelas.value = '';
        dadosEmprestimo.dataBase.value = retornaDataAtual();
        dadosEmprestimo.intervalo.value = '0';
        dadosEmprestimo.valorParcela.value = '';

        dadosEmprestimo.valorInicial.value = '';

        dadosEmprestimo.valorTotalJuros.value = '';

        dadosEmprestimo.valorTotal.value = '';
    };

    useEffect(() => {
        buscaParcelas();
    }, [atualizaParcelas]);

    useEffect(() => {
        buscaEmprestimo();
        buscaParcelas();
    }, [idEmprestimo]);

    useEffect(() => {
        buscaClienteCodigo();
    }, [idCliente]);

    useEffect(() => {
        const dadosEmprestimo = ref.current;
        dadosEmprestimo.dataCadastro.value = retornaDataAtual();
        dadosEmprestimo.dataBase.value = retornaDataAtual();
        setIntervalo('0');
        setIdEmprestimo('0');
    }, []);

    const imprimirPromissoria = () => {
        const dadosEmprestimo = ref.current;
        const cliente = dadosEmprestimo.nomeClienteEmprestimo.value;
        const cnpjCredor = dadosEmprestimo.cnpjCpfCredor.value;
        const credor = dadosEmprestimo.nomeCredor.value;
        const valor = dadosEmprestimo.valorEmprestimo.value;
        const qtdParcelas = dadosEmprestimo.parcelas.value;

        const valorParcela = extenso(dadosEmprestimo.valorParcela.value, {
            mode: 'currency',
        });
        console.log(dadosEmprestimo.valorParcela.value);

        const cnpj_cpf = dadosCliente.cnpj_cpf;
        const rua = dadosCliente.rua;
        const numero = dadosCliente.numero;
        const bairro = dadosCliente.bairro;
        const cidade = dadosCliente.cidade;
        const uf = dadosCliente.uf;
        const cep = dadosCliente.cep;
        var CnpjOuCpf = '';
        cnpj_cpf.length == 14 ? (CnpjOuCpf = 'CPF:') : (CnpjOuCpf = 'CNPJ:');
        var dia_vencimento = '';
        var mes_vencimento = '';
        var ano_vencimento = '';

        var CnpjOuCpfCredor = '';
        cnpjCredor.length == 14
            ? (CnpjOuCpfCredor = 'CPF:')
            : (CnpjOuCpfCredor = 'CNPJ:');
        var dia_vencimento = '';
        var mes_vencimento = '';
        var ano_vencimento = '';

        const win = window.open('', '', 'heigth=700, width=700');
        win.document.write('<html>');
        win.document.write('<head >');
        win.document.write('<title></title>');
        win.document.write('</head>');
        win.document.write('<body>');

        arrayParcelas.map((item) => {
            win.document.write(
                '<table style="border: solid; padding: 10px; font: 15px Calibri; min-height:340px; max-height:340px;">'
            );
            win.document.write('<tr>');
            win.document.write('<td>');
            win.document.write(
                '<label style="text-transform: uppercase; font-weight: bold;">' +
                    'NOTA PROMISSÓRIA Nº' +
                    '#' +
                    item.p +
                    '/' +
                    qtdParcelas +
                    '#' +
                    '</label>'
            );
            win.document.write('</td>');
            win.document.write('<td style="text-align:right;">');
            win.document.write(
                'Vencimento: ' + inverteData(item.data_vencimento)
            );
            console.log(item.data_vencimento);
            win.document.write('</td>');
            win.document.write('</tr>');
            ///

            //segunda linha

            win.document.write(
                '<tr><td colspan="2" style="text-align:right;">' +
                    '<label style="text-transform: uppercase; font-weight: bold;">' +
                    (item.valorPrestacao * 1).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    }) +
                    '</label></td></tr>'
            );
            //terceiro bloco
            win.document.write(
                '<tr><td colspan="2">No dia ' +
                    '<label style="text-transform: uppercase; font-weight: bold;">' +
                    formatarDataExtenso(new Date(item.data_vencimento)) +
                    '</label>' +
                    ' pagamos por esta única via de NOTA PROMISSÓRIA a ' +
                    '<label style="text-transform: uppercase;font-weight: bold;">' +
                    credor +
                    ' ' +
                    CnpjOuCpfCredor +
                    cnpjCredor +
                    '</label>' +
                    ', ou à sua ordem, a quantia de ' +
                    '<label style="text-transform: uppercase;font-weight: bold;">' +
                    valorParcela +
                    '</label>' +
                    ', em moeda corrente desse país<br><br></td></tr>'
            );
            //
            win.document.write('<tr>');
            win.document.write(
                '<td> Local de pagamento: GUARULHOS SP <br><br></td>'
            );
            win.document.write(
                '<td colspan="2">Data da Emissão: ' +
                    inverteData(item.data_vencimento) +
                    '<br><br></td>'
            );
            win.document.write('</tr>');

            ///
            win.document.write('<tr>');
            win.document.write(
                '<td colspan="2">Nome do Emitente: ' +
                    '<label style="text-transform: uppercase;font-weight: bold;">' +
                    cliente +
                    '</label><br><br></td>'
            );
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td colspan="2">');
            win.document.write(
                '<label style="text-transform: uppercase;font-weight: bold;">' +
                    CnpjOuCpf +
                    ' ' +
                    cnpj_cpf +
                    ' Endereço: ' +
                    rua +
                    ', ' +
                    numero +
                    ', ' +
                    bairro +
                    '- ' +
                    cidade +
                    ' ' +
                    uf +
                    ' - CEP: ' +
                    cep +
                    '</label><br><br>'
            );
            win.document.write('</td>');
            win.document.write('</tr>');
            win.document.write('<tr>');
            win.document.write('<td colspan="2" style="text-align:center">');
            win.document.write(
                '-------------------------------------------------'
            );
            win.document.write('</td>');
            win.document.write('</tr>');

            win.document.write('<tr>');
            win.document.write('<td colspan="2" style="text-align:center">');
            win.document.write('Assinatura do Emitente');
            win.document.write('</td>');
            win.document.write('</tr>');
            win.document.write('</table>');
            win.document.write(
                '<label>----------------------------------------------</label>'
            );
        });

        win.document.write('</body>');
        win.document.write('</html>');
        win.print();
        // win.close();
    };

    const imprimir = () => {
        const dadosEmpretimo = ref.current;

        var somaValorPago = 0;
        var valorRestante = 0;

        const win = window.open('', '', 'heigth=700, width=700');
        win.document.write('<html>');
        win.document.write('<head >');
        win.document.write('<title></title>');
        win.document.write('</head>');
        win.document.write('<body>');
        win.document.write('<table border="0" style="width: 400px">');
        win.document.write('<tr><td colspan="4" style="text-align : right">');
        win.document.write(dataHoraAtual());
        win.document.write('</tr></td>');
        win.document.write('<tr ><td colspan="4" style="text-align : center">');
        win.document.write(
            '--------------------------------------------------------------------------'
        );
        win.document.write('</tr ><td>');
        win.document.write('<tr>');
        win.document.write(
            '<td colspan="2" style="text-transform: uppercase">'
        );
        win.document.write(dadosEmprestimo.nomeClienteEmprestimo.value);
        win.document.write('</td>');
        win.document.write('<td style="text-align: right">');
        win.document.write(inverteData(dadosEmprestimo.dataCadastro.value));
        win.document.write('</td>');
        win.document.write('<td style="text-align: right">');
        win.document.write(dadosEmprestimo.emprestimo.value);
        win.document.write('</td>');
        win.document.write('</tr>');
        win.document.write('<tr ><td colspan="4" style="text-align : center">');
        win.document.write(
            '--------------------------------------------------------------------------'
        );
        win.document.write('</tr ><td>');
        win.document.write('<tr>');
        win.document.write('<td>Parcela');
        win.document.write('</td>');
        win.document.write('<td style="text-align: right;">Vencimento');
        win.document.write('</td>');
        win.document.write('<td style="text-align: right;">Valor');
        win.document.write('</td>');
        win.document.write('<td style="text-align: right;">Pago');
        win.document.write('</td>');
        win.document.write('</tr>');
        arrayParcelas.map((item) => {
            win.document.write('<tr>');
            win.document.write('<td>');
            win.document.write(item.p + '/' + dadosEmprestimo.parcelas.value);
            win.document.write('</td>');
            win.document.write('<td style="text-align: right;">');
            win.document.write(inverteData(item.data_vencimento));
            win.document.write('<td style="text-align: right;">');
            win.document.write(
                (item.valorPrestacao * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            );
            win.document.write('</td>');
            win.document.write('<td style="text-align: right;">');
            win.document.write(
                (item.valorPago * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            );
            somaValorPago = somaValorPago + item.valorPago * 1;
            win.document.write('</td>');
            somaValorPago.toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
            });
        });
        valorRestante = converteMoedaFloat(dadosEmprestimo.valorTotal.value);
        valorRestante = valorRestante - somaValorPago;
        win.document.write('<tr><td colspan="4" style="text-align : center">');
        win.document.write(
            '--------------------------------------------------------------------------'
        );
        win.document.write('</td ></tr >');
        win.document.write('<tr><td colspan="2" style="text-align: right;">');
        win.document.write('Emprestimo</td >');
        win.document.write('<td style = "text-align: right;">');
        win.document.write(' Juros</td >');
        win.document.write('<td style = "text-align: right;" >');
        win.document.write('Total a Pagar</td ></tr >');
        win.document.write('<tr><td colspan="2" style="text-align: right;">');
        win.document.write(dadosEmprestimo.valorInicial.value);
        win.document.write('</td ><td style="text-align: right;">');
        win.document.write(dadosEmprestimo.valorTotalJuros.value);
        win.document.write('</td > <td style="text-align: right;">');
        win.document.write(dadosEmprestimo.valorTotal.value);
        win.document.write('</td ></tr >');
        win.document.write('<tr>');
        win.document.write('<td colspan="4" style="text-align: right;" > -');
        win.document.write(
            somaValorPago.toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
            })
        );
        win.document.write('</td ></tr >');
        win.document.write('<tr>');
        win.document.write('<td colspan="4" style="text-align: right;" >');
        win.document.write(
            valorRestante.toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
            })
        );
        win.document.write('</td ></tr >');
        win.document.write('</body>');
        win.document.write('</html>');
        win.print();
        //  win.close();
    };

    const toogle = () => {
        setCheckPrestacao(!checkPrestacao);

        console.log(checkPrestacao);
    };

    return (
        <>
            {formBuscaEmprestimo == true && (
                <BuscaEmprestimo
                    setFormBuscaEmprestimo={setFormBuscaEmprestimo}
                    setIdEmprestimo={setIdEmprestimo}
                />
            )}

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

            <form
                className="formOperacionalEmprestimo"
                onSubmit={handleSubmit}
                ref={ref}
            >
                <ToastContainer
                    autoClose={3000}
                    position={toast.POSITION.BOTTOM_LEFT}
                />
                <h1>Empréstimo</h1>

                <div className="boxGeralOperacionalEmprestimo">
                    <div className="boxLeft">
                        <div className="boxRow">
                            {!onEdit && (
                                <button
                                    id="btnGravarEmprestimo"
                                    onClick={gravarEmprestimo}
                                >
                                    Gravar
                                </button>
                            )}{' '}
                            {onEdit && (
                                <button
                                    id="btnGravarEmprestimo"
                                    onClick={limpar}
                                >
                                    Novo
                                </button>
                            )}{' '}
                            {onEdit && (
                                <button
                                    id="btnImprimir"
                                    onClick={imprimirPromissoria}
                                >
                                    Promissória
                                </button>
                            )}
                            {onEdit && (
                                <button id="btnImprimir" onClick={imprimir}>
                                    Imprimir
                                </button>
                            )}
                        </div>

                        <div className="boxRow">
                            <input
                                type="text"
                                id="inputId"
                                name="emprestimo"
                                value={idEmprestimo || ''}
                                onChange={(e) =>
                                    setIdEmprestimo(e.target.value)
                                }
                                onKeyDown={(e) =>
                                    keyDown(e, 'inputIdClienteEmprestimo')
                                }
                            />
                            <FiSearch
                                size="25"
                                onClick={exibirBuscaEmprestimo}
                            />
                            <input type="date" name="dataCadastro" readOnly />
                        </div>
                        <label className="labelOperacionalEmprestimo">
                            Cliente
                        </label>
                        <div className="boxRow">
                            <input
                                id="inputIdClienteEmprestimo"
                                name="idClienteEmprestimo"
                                type="text"
                                value={idCliente || ''}
                                onChange={(e) => setIdCliente(e.target.value)}
                                placeholder=""
                                onKeyDown={(e) => keyDown(e, 'inputCliente')}
                                onBlur={buscaClienteCodigo}
                            />
                            <input
                                id="inputCliente"
                                name="nomeClienteEmprestimo"
                                type="text"
                                placeholder=""
                                onKeyDown={(e) =>
                                    keyDown(e, 'inputCnpjCpfCredor')
                                }
                            />
                            {!onEdit == true && (
                                <FiSearch size="25" onClick={exibeFormBusca} />
                            )}
                        </div>
                        <div className="boxRow">
                            <div className="boxCol">
                                <label>Cnpj Creddor</label>
                                <input
                                    id="inputCnpjCpfCredor"
                                    name="cnpjCpfCredor"
                                    type="text"
                                    value={cnpjCpfCredor || ''}
                                    placeholder=""
                                    onChange={(e) => {
                                        setCnpjCpfCredor(e.target.value);
                                    }}
                                    onBlur={formataCpfCnpj}
                                    onKeyDown={(e) => keyDown(e, 'inputCredor')}
                                />
                            </div>
                            <div className="boxCol">
                                <label>Credor</label>
                                <input
                                    type="text"
                                    id="inputCredor"
                                    name="nomeCredor"
                                    onKeyDown={(e) =>
                                        keyDown(e, 'inputValorEmprestimo')
                                    }
                                />
                            </div>
                        </div>
                        <div className="boxRow">
                            <div className="boxCol">
                                <label>Juros Mensal</label>
                                <input
                                    type="text"
                                    id="inputJurosMensal"
                                    name="jurosMensal"
                                    placeholder=""
                                    //   onChange={calculaJurosDiario}
                                    onBlur={formataJurosMensal}
                                    onKeyDown={(e) =>
                                        keyDown(e, 'inputValorEmprestimo')
                                    }
                                    onFocus={formataJurosMensalOnFocus}
                                />
                            </div>
                            <div className="boxCol">
                                <label>Juros Diario</label>
                                <input
                                    type="text"
                                    name="jurosDiario"
                                    id="inputJurosDiario"
                                    placeholder=""
                                    readOnly
                                />
                            </div>
                            <div className="boxCol">
                                <label>Vl. Emprestimo</label>
                                <input
                                    type="text"
                                    id="inputValorEmprestimo"
                                    name="valorEmprestimo"
                                    placeholder=""
                                    onBlur={formataValorEmprestimo}
                                    onKeyDown={(e) =>
                                        keyDown(e, 'inputQtdParcelas')
                                    }
                                />
                            </div>
                            <div className="boxCol">
                                <label>Qtd. Parcelas</label>
                                <input
                                    type="text"
                                    id="inputQtdParcelas"
                                    name="parcelas"
                                    placeholder=""
                                    onKeyDown={(e) =>
                                        keyDown(e, 'inputDataBase')
                                    }
                                />
                            </div>
                        </div>

                        <div className="boxRow">
                            <div className="boxCol">
                                <label>Vencimento</label>
                                <input
                                    type="date"
                                    id="inputDataBase"
                                    name="dataBase"
                                    placeholder=""
                                    onKeyDown={(e) =>
                                        keyDown(e, 'inputIntervalo')
                                    }
                                />
                            </div>
                            <div className="boxCol">
                                <label>Intervalo</label>
                                <input
                                    type="text"
                                    id="inputIntervalo"
                                    name="intervalo"
                                    placeholder=""
                                    value={s_intervalo || ''}
                                    onBlur={formataInt}
                                    onChange={(e) =>
                                        setIntervalo(e.target.value)
                                    }
                                    onKeyDown={(e) => keyDown(e, 'btnCalcular')}
                                />
                            </div>
                            <div className="boxCol">
                                <label>Valor Parcela</label>
                                <div className="boxRow">
                                    {checkPrestacao && (
                                        <input
                                            type="text"
                                            id="inputValorParcela"
                                            name="valorParcela"
                                            placeholder=""
                                            readOnly
                                        />
                                    )}
                                    {!checkPrestacao && (
                                        <input
                                            type="text"
                                            id="inputValorParcela"
                                            name="valorParcela"
                                            placeholder=""
                                        />
                                    )}
                                    <input
                                        type="checkbox"
                                        id="checkP"
                                        name="checkP"
                                        onClick={toogle}
                                    />
                                </div>
                            </div>
                            {!onEdit && (
                                <button
                                    id="btnCalcular"
                                    onClick={calculaEmprestimo}
                                >
                                    Calcular
                                </button>
                            )}
                        </div>
                        <textarea id="obsEmprestimo" />
                    </div>
                    <div className="boxRight">
                        <div className="boxResumoOpE">
                            <div className="boxCol">
                                <label>RESUMO</label>
                            </div>
                            <div className="boxCol">
                                <label>Emprestimo</label>{' '}
                                <input
                                    type="text"
                                    name="valorInicial"
                                    readOnly
                                />
                            </div>
                            <div className="boxCol">
                                <label>Juros</label>{' '}
                                <input
                                    type="text"
                                    name="valorTotalJuros"
                                    readOnly
                                />
                            </div>
                            <div className="boxCol">
                                <label>A pagar</label>{' '}
                                <input type="text" name="valorTotal" readOnly />
                            </div>
                            <div className="boxCol">
                                <label>Valor Pago</label>{' '}
                                <input type="text" name="valorPago" readOnly />
                            </div>
                            <div className="boxCol">
                                <label>Restante</label>{' '}
                                <input
                                    type="text"
                                    name="valorRestante"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="gridEmprestimo">
                        <div>Parcela</div>
                        <div className="alignRight">Vencimento</div>
                        <div className="alignRight">Prestação</div>
                        <div className="alignRight">Valor Pago</div>
                        <div></div>
                    </div>
                    <div id="divResultadoEmprestimo">
                        {arrayParcelas.map((item) => (
                            <div
                                key={item.p}
                                className={
                                    item.valorPrestacao == item.valorPago ||
                                    item.valorPrestacao < item.valorPago
                                        ? 'gridLinhaPago'
                                        : 'gridLinha'
                                }
                                name="linhaParcela"
                                value={item.idParcela}
                            >
                                <div>{item.p}</div>
                                <div className="alignRight">
                                    {inverteData(item.data_vencimento)}
                                </div>
                                <div className="alignRight">
                                    {(item.valorPrestacao * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                                <div className="alignRight">
                                    {(item.valorPago * 1).toLocaleString(
                                        'pt-BR',
                                        {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                        }
                                    )}
                                </div>
                                <div className="alignRight">
                                    {onEdit && (
                                        <FiDollarSign
                                            id="iconeDollarPagar"
                                            onClick={(e) => {
                                                setIdParcela(item.idParcela);
                                                setParcelaN(item.p);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </>
    );
};
