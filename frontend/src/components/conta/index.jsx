import { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { BuscaClienteNome } from '../buscaCliente';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../../context/authContext';
import { apiFactoring } from '../../services/api';
import {
    converteMoedaFloat,
    keyDown,
    retornaDataAtual,
} from '../../biblitoteca';
import './conta.css';
import { Entrada } from '../contaEntrada';
import { Saida } from '../contaSaida';
import { ContaGeral } from '../contaGeral';

export const Conta = () => {
    const [idCliente, setIdCliente] = useState();
    const [formBusca, setFormBusca] = useState();

    const [data, setData] = useState();
    const [documento, setDocumento] = useState();
    const [numero, setNumero] = useState();
    const [valor, setValor] = useState();
    const [tipo, setTipo] = useState();

    const [lancamentoConta, setLancamentoConta] = useState([]);

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
                })
                .catch();

            setDocumento('');
            setNumero('');
            setValor('');
        }
    };

    const alterarLancamento = async (lancamento) => {
        let idLancamento = lancamento;
        console.log(data);
        console.log(documento);
        console.log(numero);
        console.log(valor);

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
            })
            .catch();
    };

    const excluirLancamento = async (idLancamento) => {
        console.log(idLancamento);

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
    };

    const listaLancamentoConta = async () => {
        await apiFactoring
            .post(
                '/lista-lancamento-conta',
                {
                    idCliente: idCliente,
                    dataI: data,
                    dataF: data,
                    tipo: tipo,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                console.log(data);
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

                console.log(arrayLancamento);
            })
            .catch();
        setLancamentoConta(arrayLancamento);
    };

    useEffect(() => {
        buscaClienteCodigo();
    }, [idCliente]);

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
                                placeholder=""
                                autoComplete="off"
                            />
                            <FiSearch size="25" onClick={exibeFormBusca} />
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        id="buttonConta"
                        onClick={(e) => {
                            setTab('entrada');
                        }}
                    >
                        Entrada
                    </button>
                    <button id="buttonConta" onClick={(e) => setTab('saida')}>
                        Saida
                    </button>
                    <button id="buttonConta" onClick={(e) => setTab('geral')}>
                        Movimento
                    </button>
                </div>
            </form>
            {(tab === 'entrada' || tab == undefined) && (
                <Entrada
                    data={data}
                    setData={setData}
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
                />
            )}
            {tab === 'saida' && (
                <Saida
                    data={data}
                    setData={setData}
                    documento={documento}
                    setDocumento={setDocumento}
                    numero={numero}
                    setNumero={setNumero}
                    valor={valor}
                    setValor={setValor}
                    tipo={tipo}
                    setTipo={setTipo}
                    gravarLancamento={gravarLancamento}
                />
            )}
            {tab === 'geral' && (
                <ContaGeral
                    data={data}
                    setData={setData}
                    documento={documento}
                    setDocumento={setDocumento}
                    numero={numero}
                    setNumero={setNumero}
                    valor={valor}
                    setValor={setValor}
                    tipo={tipo}
                    setTipo={setTipo}
                />
            )}
        </>
    );
};
