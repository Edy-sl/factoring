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
} from '../../biblitoteca';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch } from 'react-Icons/fi';
import { BuscaClienteNome } from '../buscaCliente';
import { ImDiamonds } from 'react-icons/im';
import { BuscaEmprestimo } from '../buscaEmprestimo';
export const FormOperacionalEmprestimo = () => {
    const ref = useRef();

    const [arrayParcelas, setArrayParcelas] = useState([]);

    const [formBusca, setFormBusca] = useState(false);
    const [cnpjCpfCredor, setCnpjCpfCredor] = useState('');

    const [formBuscaEmprestimo, setFormBuscaEmprestimo] = useState();
    const [idEmprestimo, setIdEmprestimo] = useState();

    const [valorEmprestimo, setValorEmprestimo] = useState();

    const [s_intervalo, setIntervalo] = useState(0);

    const [idCliente, setIdCliente] = useState();

    const [onEdit, setOnEdit] = useState(false);

    const dadosEmprestimo = ref.current;

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const calculaEmprestimo = () => {
        const dadosEmprestimo = ref.current;

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
            dadosEmprestimo.valorParcela.value =
                calculos[0].prestacao.toLocaleString('pt-BR');

            dadosEmprestimo.valorInicial.value =
                capital.toLocaleString('pt-br');

            dadosEmprestimo.valorTotalJuros.value =
                calculos[0].valorTotalJuros.toLocaleString('pt-br');
            dadosEmprestimo.valorTotal.value =
                calculos[0].valorTotal.toLocaleString('pt-br');

            let arrayP = [];
            let intervalo = parseInt(dadosEmprestimo.intervalo.value) + 1;

            let vencimento = new Date(dadosEmprestimo.dataBase.value);
            vencimento.setDate(vencimento.getDate() + 1);

            let intervaloMes = 1;

            for (let i = 0; i < parcela; i++) {
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

                let dataIntervalo = formataDias(vencimento);
                let valorPrestacao =
                    calculos[0].prestacao.toLocaleString('pt-BR');

                /////////////////////////////////////////////////////////

                var data_vencimento = new Date(
                    dataIntervalo.split('-').reverse().join('- ')
                );

                //vefifica se é feriado e retorna +1 dia
                var add_dia = feriadosFixos(data_vencimento);
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
                }

                //////////////////////////////////////////////////////////////////

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

    function zeroFill(n) {
        return n < 10 ? `0${n}` : `${n}`;
    }
    const formataDias = (date) => {
        const d = zeroFill(date.getDate());
        const mo = zeroFill(date.getMonth() + 1);
        const y = zeroFill(date.getFullYear());
        const h = zeroFill(date.getHours());
        const mi = zeroFill(date.getMinutes());
        const s = zeroFill(date.getSeconds());
        return `${d}-${mo}-${y}`;
    };

    const formataData = (dataI) => {
        const data = dataI;

        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();

        return (dataFormatada = dia + '/' + mes + '/' + ano);
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

        dadosEmprestimo.valorEmprestimo.value = vl.toLocaleString('pt-BR');
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
                    jurosMensal: parseFloat(dadosEmprestimo.jurosMensal.value),
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
                        dadosEmprestimo.valorEmprestimo.value =
                            dados.valor_emprestimo;
                        dadosEmprestimo.parcelas.value =
                            dados.quantidade_parcelas;
                        dadosEmprestimo.dataBase.value = dados.data_base;
                        dadosEmprestimo.intervalo.value = dados.intervalo;
                        dadosEmprestimo.valorParcela.value =
                            dados.valor_parcela.toLocaleString('pt-BR');

                        dadosEmprestimo.valorInicial.value =
                            dados.valor_emprestimo.toLocaleString('pt-BR');

                        dadosEmprestimo.valorTotalJuros.value =
                            dados.valor_juros.toLocaleString('pt-BR');

                        dadosEmprestimo.valorTotal.value =
                            dados.valor_total.toLocaleString('pt-BR');

                        calculaJurosDiario();
                        setOnEdit(true);
                    });
                }
            })
            .catch(({ data }) => {
                toast.error(data);
            });
        // calculaEmprestimo();
    };

    const buscaParcelas = async () => {
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
                    let arrayP = [];
                    data.map((item) => {
                        //carrega grid
                        var vl = item.valor;
                        vl = vl.toLocaleString('pt-BR');
                        arrayP = [
                            ...arrayP,
                            {
                                p: item.parcela,
                                valorPrestacao: vl,
                                data_vencimento: item.vencimento,
                            },
                        ];
                    });

                    setArrayParcelas(arrayP);
                }
            })
            .catch(({ data }) => {
                toast.error(data);
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
        buscaEmprestimo();
        buscaParcelas();
    }, [idEmprestimo]);

    useEffect(() => {
        buscaClienteCodigo();
    }, [idCliente]);

    useEffect(() => {
        calculaEmprestimo();
    }, [valorEmprestimo, s_intervalo]);

    useEffect(() => {
        const dadosEmprestimo = ref.current;
        dadosEmprestimo.dataCadastro.value = retornaDataAtual();
        dadosEmprestimo.dataBase.value = retornaDataAtual();
        setIntervalo('0');
        setIdEmprestimo('0');
    }, []);

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
                                    value={valorEmprestimo}
                                    onChange={(e) =>
                                        setValorEmprestimo(e.target.value)
                                    }
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
                                    onChange={calculaEmprestimo}
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
                                    onChange={calculaEmprestimo}
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
                                <input
                                    type="text"
                                    id="inputValorParcela"
                                    name="valorParcela"
                                    placeholder=""
                                    readOnly
                                />
                            </div>{' '}
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
                                <input type="text" name="valorInicial" />
                            </div>
                            <div className="boxCol">
                                <label>Juros</label>{' '}
                                <input type="text" name="valorTotalJuros" />
                            </div>
                            <div className="boxCol">
                                <label>A pagar</label>{' '}
                                <input type="text" name="valorTotal" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="gridEmprestimo">
                        <div>Parcela</div>
                        <div>Vencimento</div>
                        <div>Prestação</div>
                    </div>
                    <div id="divResultadoEmprestimo">
                        {arrayParcelas.map((item) => (
                            <div className="gridLinha" key={item.p}>
                                <div>{item.p}</div>
                                <div>{item.data_vencimento}</div>
                                <div>{item.valorPrestacao}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </>
    );
};
