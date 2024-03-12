import './relatorioChequeClienteVencimento.css';
import { FiSearch, FiDollarSign, FiPrinter } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { apiFactoring } from '../../services/api.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GridChequeRelatorio } from '../gridRelatorioCheques/index.jsx';
import {
    converteFloatMoeda,
    inverteData,
    keyDown,
    retornaDataAtual,
} from '../../biblitoteca.jsx';
import { GridRelatorioEmprestimo } from '../gridRelatorioEmprestimo/index.jsx';

import { impressaoMovimento } from '../functions/impressaoMovimento.jsx';
import { BuscaClienteNome } from '../buscaCliente/index.jsx';
import { BuscaClienteNomeDireto } from '../buscaClienteNome/index.jsx';
import { TituloTela } from '../titulosTela/tituloTela.jsx';
import { useParams } from 'react-router-dom';

export const RelatorioMovimentoPorClienteVencimento = () => {
    const ref = useRef();

    const [listagemCheque, setListagemCheque] = useState([]);
    const [listagemChequeDeducao, setListagemChequeDeducao] = useState([]);
    const [listagemEmprestimo, setListagemEmprestimo] = useState([]);

    const [clienteFiltrado, setClienteFiltrado] = useState([]);
    const [formBuscaDireto, setFormBuscaDireto] = useState(false);
    const [clientes, setClientes] = useState([]);

    const [isCheckedDeducao, setIsCheckedDeducao] = useState(false);

    const [dataIni, setDataIni] = useState(retornaDataAtual());
    const [dataFim, setDataFim] = useState(retornaDataAtual());

    const [idParcela, setIdParcela] = useState(0);
    const [parcelaN, setParcelaN] = useState(0);

    const [atualizaParcelas, setAtualizaParcelas] = useState(false);

    const [idCliente, setIdCliente] = useState(0);
    const [formBusca, setFormBusca] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const relatorioPorData = async () => {
        const dadosRelatorio = ref.current;
        var dataI = dadosRelatorio.dataI.value;
        var dataF = dadosRelatorio.dataF.value;

        let newArray = [];

        await apiFactoring
            .post(
                '/relatorio-movimento-cheque-cliente-vencimento',
                {
                    dataI: dataI,
                    dataF: dataF,
                    idCliente: idCliente,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                data.map((item) => {
                    newArray = [
                        ...newArray,
                        {
                            numero_banco: item.numero_banco,
                            numero_cheque: item.numero_cheque,
                            nome_cheque: item.nome_cheque,
                            nome: item.nome,
                            idbordero: item.idbordero,
                            data: item.data,
                            data_vencimento: item.data_vencimento,
                            valor_cheque: item.valor_cheque,
                            valor_juros: item.valor_juros,
                            idbordero_deducao: '0',
                            valor_taxa: item.taxa_ted,
                        },
                    ];
                });
            })
            .catch(({ data }) => {
                toast.error(data);
            });

        await apiFactoring
            .post(
                '/relatorio-movimento-deducao-cliente-vencimento',
                {
                    dataI: dataI,
                    dataF: dataF,
                    idCliente: idCliente,
                    status: isCheckedDeducao,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                data.map((item) => {
                    newArray = [
                        ...newArray,
                        {
                            numero_banco: item.numero_banco,
                            numero_cheque: item.numero_cheque,
                            nome_cheque: item.nome_cheque,
                            nome: item.nome,
                            idbordero: item.idbordero,
                            data: item.data_deducao,
                            data_vencimento: 'DV-' + item.data_devolucao,
                            valor_cheque: item.valor_cheque,
                            valor_juros: item.juros_devolucao,
                            idbordero_deducao: item.idbordero_deducao,
                            valor_taxa: item.taxa_ted,
                        },
                    ];
                });
                console.log(newArray);
            })
            .catch(({ data }) => {
                toast.error(data);
            });

        await apiFactoring
            .post(
                '/relatorio-movimento-emprestimo-cliente-vencimento',
                {
                    dataI: dataI,
                    dataF: dataF,
                    idCliente: idCliente,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setListagemEmprestimo(data);
            })
            .catch(({ data }) => {
                toast.error(data);
            });

        console.log(newArray);

        setListagemCheque(newArray);
    };

    const handleOnChangeDeducao = () => {
        setIsCheckedDeducao(!isCheckedDeducao);
    };

    const exibeFormBusca = () => {
        setFormBusca(!formBusca);
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
                if (data.length > 0) {
                    data.map((dados) => {
                        dadosCliente.nome.value = dados.nome;
                    });
                }
            });
    };

    const FiltraCliente = (busca) => {
        let clienteF = [];
        clienteF = clientes.filter((C) =>
            C.nome.toUpperCase().includes(busca.toUpperCase() || C.nome != ' ')
        );
        setClienteFiltrado(clienteF);
        console.log(clienteF.length);
        if (clienteF.length == 0) {
            setFormBuscaDireto(false);
        } else {
            setFormBuscaDireto(true);
        }
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

    useEffect(() => {
        listaClientes();
    }, []);

    useEffect(() => {
        buscaClienteCodigo();
    }, [idCliente]);
    return (
        <div id="divContainerRelatorio">
            {' '}
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
                <TituloTela tituloTela="Realtório por Cliente e Data de Vencimento" />

                <form className="" ref={ref} onSubmit={handleSubmit}>
                    <div className="boxRow" id="divFiltroMovimentoEmissao">
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
                                            id="inputCliente"
                                            name="nome"
                                            placeholder=""
                                            onKeyDown={(e) =>
                                                keyDown(
                                                    e,
                                                    'dataI',
                                                    'cliente',
                                                    'inputCliente0'
                                                )
                                            }
                                            onChange={(e) => {
                                                FiltraCliente(e.target.value);
                                            }}
                                            autoComplete="off"
                                        />
                                        {formBuscaDireto == true && (
                                            <BuscaClienteNomeDireto
                                                clienteFiltrado={
                                                    clienteFiltrado
                                                }
                                                setIdCliente={setIdCliente}
                                                setFormBuscaDireto={
                                                    setFormBuscaDireto
                                                }
                                                setClienteFiltrado={
                                                    setClienteFiltrado
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="boxCol">
                            <label>Geral</label>
                            <label>Sem Dedução</label>
                        </div>

                        <div className="boxCol" id="divCheckbox">
                            <input
                                type="checkbox"
                                name="chekeboxGeral"
                                id="checkRel"
                                checked={!isCheckedDeducao}
                                onChange={handleOnChangeDeducao}
                            />

                            <input
                                type="checkbox"
                                name="checkboxDeducao"
                                id="checkRel"
                                checked={isCheckedDeducao}
                                onChange={handleOnChangeDeducao}
                            />
                        </div>

                        <div className="boxCol">
                            <label>Data Inicial</label>
                            <input
                                type="date"
                                value={dataIni}
                                name="dataI"
                                id="dataI"
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
                                    onClick={relatorioPorData}
                                />{' '}
                                <FiPrinter
                                    className="icone2"
                                    onClick={(e) =>
                                        impressaoMovimento(
                                            listagemCheque,
                                            listagemEmprestimo
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div id="divListagemMovimento">
                <GridChequeRelatorio listagem={listagemCheque} />
                <GridRelatorioEmprestimo listagem={listagemEmprestimo} />{' '}
            </div>
        </div>
    );
};
