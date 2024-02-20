import { useEffect, useRef, useState } from 'react';
import {
    converteMoedaFloat,
    converteFloatMoeda,
    keyDown,
    retornaDataAtual,
    inverteData,
} from '../../biblitoteca';
import { FiSearch, FiDollarSign, FiPrinter } from 'react-icons/fi';
import { BuscaClienteNome } from '../buscaCliente';

import { apiFactoring } from '../../services/api';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormPagamentoEmprestimo } from '../pagamentoEmprestimo';
import { GridRelatorioEmprestimo } from '../gridRelatorioEmprestimo';
import { impressaoRelEmprestimo } from '../functions/impressaoRelEmprestimo';
import { BuscaClienteNomeDireto } from '../buscaClienteNome';
import { TituloTela } from '../titulosTela/tituloTela';

export const RelatorioEmprestimoPorClienteEmissao = () => {
    const [idCliente, setIdCliente] = useState(0);
    const [formBusca, setFormBusca] = useState();
    const [checkEspecial, setCheckEspecial] = useState('NAO');

    const [clienteFiltrado, setClienteFiltrado] = useState([]);
    const [formBuscaDireto, setFormBuscaDireto] = useState(false);
    const [clientes, setClientes] = useState([]);

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

    useEffect(() => {
        !checkRel && setCheckRel('GERAL');
    }, []);

    return (
        <div id="divContainerRelatorio">
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
                <TituloTela tituloTela="Realtório de Empréstimo por Cliente e Data de Emissão" />

                <form className="" ref={ref} onSubmit={handleSubmit}>
                    <div id="divCentralizada">
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
                            </div>
                        </div>
                        <div id="divBtnRel">
                            <FiSearch
                                className="icone3"
                                onClick={relatorioPorData}
                            />
                            <FiPrinter
                                className="icone3"
                                onClick={(e) =>
                                    impressaoRelEmprestimo(
                                        listagem,
                                        'Realtório de Empréstimo por Cliente e Data de Emissão de: ' +
                                            inverteData(dataIni) +
                                            ' - ' +
                                            inverteData(dataFim)
                                    )
                                }
                            />
                        </div>
                    </div>
                </form>
            </div>{' '}
            <GridRelatorioEmprestimo listagem={listagem} />
        </div>
    );
};
