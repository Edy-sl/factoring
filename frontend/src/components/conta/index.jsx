import { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { BuscaClienteNome } from '../buscaCliente';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../../context/authContext';
import { apiFactoring } from '../../services/api';
import {
    converteMoedaFloat,
    dataHoraAtual,
    keyDown,
    retornaDataAtual,
} from '../../biblitoteca';
import './conta.css';
import { Entrada } from '../contaEntrada';
import { Saida } from '../contaSaida';
import { ContaMovimento } from '../contaGeral';

export const Conta = () => {
    const [idCliente, setIdCliente] = useState();
    const [formBusca, setFormBusca] = useState();
    const [nomeCliente, setNomeCliente] = useState();

    const [data, setData] = useState();
    const [dataF, setDataF] = useState();
    const [documento, setDocumento] = useState();
    const [numero, setNumero] = useState();
    const [valor, setValor] = useState();
    const [tipo, setTipo] = useState();

    const [somaEntrada, setSomaEntrada] = useState();
    const [somaSaida, setSomaSaida] = useState();

    const [idLancamentoEdit, setIdLancamentoEdit] = useState();

    const [lancamentoConta, setLancamentoConta] = useState([]);

    const [onEdit, setOnEdit] = useState(false);

    let arrayLancamento = [];

    const [tab, setTab] = useState();

    const ref = useRef();

    const exibeFormBusca = () => {
        setFormBusca(!formBusca);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const buscaClienteCodigo = async () => {
        setNomeCliente('');

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
                    setNomeCliente(dados.nome);
                });
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const gravarLancamento = async () => {
        if (
            idCliente == '' ||
            data == null ||
            documento == '' ||
            numero == '' ||
            valor == '' ||
            tipo == ''
        ) {
            toast.error('Campo obrigatório não digitado!');
        } else {
            await apiFactoring
                .post(
                    '/gravar-lancamento-conta',
                    {
                        idCliente: idCliente,
                        data: data,
                        documento: documento,
                        numero: numero,
                        valor: converteMoedaFloat(valor),
                        tipo: tipo,
                    },
                    {
                        headers: {
                            'x-access-token': localStorage.getItem('user'),
                        },
                    }
                )
                .then(({ data }) => {
                    toast.success(data);
                    listaLancamentoConta();
                })
                .catch();

            setDocumento('');
            setNumero('');
            setValor('');
        }
    };

    const alterarLancamento = async (lancamento) => {
        let idLancamento = lancamento;

        await apiFactoring
            .post(
                'alterar-lancamento-conta',
                {
                    idLancamento: idLancamento,
                    data: data,
                    documento: documento,
                    numero: numero,
                    valor: converteMoedaFloat(valor),
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                toast.success(data);
                setDocumento('');
                setNumero('');
                setValor('');
                idLancamento = '';
                setIdLancamentoEdit('');
            })
            .catch();

        listaLancamentoConta();
    };

    const excluirLancamento = async (idLancamento) => {
        const confirma = confirm('Deseja excluir o Lançamento?');
        if (confirma) {
            await apiFactoring
                .post(
                    'excluir-lancamento-conta',
                    {
                        idLancamento: idLancamento,
                    },
                    {
                        headers: {
                            'x-access-token': localStorage.getItem('user'),
                        },
                    }
                )
                .then(({ data }) => {
                    toast.success(data);
                    listaLancamentoConta();
                })
                .catch();
        }
    };

    const somaMovimento = async () => {
        await apiFactoring
            .post(
                '/soma-movimento-conta',
                {
                    idCliente: idCliente,
                    dataI: data,
                    dataF: dataF,
                    tipo: tipo,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                data.map((movimento) => {
                    setSomaEntrada(movimento.entrada);
                    setSomaSaida(movimento.saida);
                });
            })
            .catch();
    };

    const listaLancamentoConta = async () => {
        setOnEdit(false);

        arrayLancamento = [];
        await apiFactoring
            .post(
                '/lista-lancamento-conta',
                {
                    idCliente: idCliente,
                    dataI: data,
                    dataF: dataF,
                    tipo: tipo,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                data.map((lancamento) => {
                    arrayLancamento = [
                        ...arrayLancamento,
                        {
                            documento: lancamento.documento,
                            numero_documento: lancamento.numero,
                            valor_documento: lancamento.valor,
                            data_documento: lancamento.data,
                            tipo: lancamento.tipo,
                            idlancamento: lancamento.idlancamento,
                        },
                    ];
                });
            })
            .catch();
        setLancamentoConta(arrayLancamento);
        somaMovimento();
    };

    useEffect(() => {
        buscaClienteCodigo();
    }, [idCliente]);

    useEffect(() => {
        listaLancamentoConta();
    }, [idCliente, tipo]);

    return (
        <>
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_CENTER}
            />

            {formBusca == true && (
                <AuthProvider>
                    <BuscaClienteNome
                        setFormBusca={setFormBusca}
                        setIdCliente={setIdCliente}
                    />
                </AuthProvider>
            )}
            <form className="formCliente" onSubmit={handleSubmit} ref={ref}>
                <div className="boxRow">
                    <div className="boxCol">
                        <label>Código</label>

                        <input
                            type="text"
                            id="inputIdCliente"
                            name="idCliente"
                            placeholder=""
                            value={idCliente || ''}
                            onChange={(e) => setIdCliente(e.target.value)}
                            onKeyDown={(e) => keyDown(e, 'inputNome')}
                            autoComplete="off"
                        />
                    </div>

                    <div className="boxCol">
                        <label>Nome</label>
                        <div className="boxRow">
                            <input
                                type="text"
                                id="inputNome"
                                name="nome"
                                value={nomeCliente}
                                placeholder=""
                                autoComplete="off"
                            />
                            <FiSearch
                                className="icone2"
                                onClick={exibeFormBusca}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        id="buttonConta"
                        onClick={(e) => {
                            setIdLancamentoEdit('');
                            setDocumento('');
                            setNumero('');
                            setValor('');
                            setTipo('');
                            setTab('entrada');
                        }}
                    >
                        Entrada
                    </button>
                    <button
                        id="buttonConta"
                        onClick={(e) => {
                            setIdLancamentoEdit('');
                            setDocumento('');
                            setNumero('');
                            setValor('');
                            setTipo('');
                            setTab('saida');
                        }}
                    >
                        Saída
                    </button>
                    <button
                        id="buttonConta"
                        onClick={(e) => {
                            setTab('geral');
                        }}
                    >
                        Movimento
                    </button>
                </div>
            </form>
            {(tab === 'entrada' || tab == undefined) && (
                <Entrada
                    data={data}
                    setData={setData}
                    setDataF={setDataF}
                    documento={documento}
                    setDocumento={setDocumento}
                    numero={numero}
                    setNumero={setNumero}
                    valor={valor}
                    setValor={setValor}
                    tipo={tipo}
                    setTipo={setTipo}
                    gravarLancamento={gravarLancamento}
                    idCliente={idCliente}
                    alterarLancamento={alterarLancamento}
                    excluirLancamento={excluirLancamento}
                    listaLancamentoConta={listaLancamentoConta}
                    lancamentoConta={lancamentoConta}
                    setIdLancamentoEdit={setIdLancamentoEdit}
                    idLancamentoEdit={idLancamentoEdit}
                    onEdit={onEdit}
                    setOnEdit={setOnEdit}
                />
            )}
            {tab === 'saida' && (
                <Saida
                    data={data}
                    setData={setData}
                    setDataF={setDataF}
                    documento={documento}
                    setDocumento={setDocumento}
                    numero={numero}
                    setNumero={setNumero}
                    valor={valor}
                    setValor={setValor}
                    tipo={tipo}
                    setTipo={setTipo}
                    gravarLancamento={gravarLancamento}
                    idCliente={idCliente}
                    alterarLancamento={alterarLancamento}
                    excluirLancamento={excluirLancamento}
                    listaLancamentoConta={listaLancamentoConta}
                    lancamentoConta={lancamentoConta}
                    setIdLancamentoEdit={setIdLancamentoEdit}
                    idLancamentoEdit={idLancamentoEdit}
                    onEdit={onEdit}
                    setOnEdit={setOnEdit}
                />
            )}
            {tab === 'geral' && (
                <ContaMovimento
                    data={data}
                    setData={setData}
                    setDataF={setDataF}
                    dataF={dataF}
                    documento={documento}
                    setDocumento={setDocumento}
                    numero={numero}
                    setNumero={setNumero}
                    valor={valor}
                    setValor={setValor}
                    tipo={tipo}
                    setTipo={setTipo}
                    gravarLancamento={gravarLancamento}
                    idCliente={idCliente}
                    alterarLancamento={alterarLancamento}
                    excluirLancamento={excluirLancamento}
                    listaLancamentoConta={listaLancamentoConta}
                    lancamentoConta={lancamentoConta}
                    setTab={setTab}
                    setIdLancamentoEdit={setIdLancamentoEdit}
                    idLancamentoEdit={idLancamentoEdit}
                    setOnEdit={setOnEdit}
                    onEdit={onEdit}
                    somaEntrada={somaEntrada}
                    somaSaida={somaSaida}
                    nomeCliente={nomeCliente}
                />
            )}
        </>
    );
};
