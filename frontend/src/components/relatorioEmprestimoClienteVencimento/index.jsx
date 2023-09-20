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

export const RelatorioEmprestimoPorClienteVencimento = () => {
    const [idCliente, setIdCliente] = useState(0);
    const [formBusca, setFormBusca] = useState();
    const [checkEspecial, setCheckEspecial] = useState('NAO');

    const ref = useRef();

    const exibeFormBusca = () => {
        setFormBusca(!formBusca);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const [listagem, setListagem] = useState([]);

    const [checkRel, setCheckRel] = useState();

    const [dataIni, setDataIni] = useState(retornaDataAtual());
    const [dataFim, setDataFim] = useState(retornaDataAtual());

    const [idParcela, setIdParcela] = useState(0);
    const [parcelaN, setParcelaN] = useState(0);

    const [atualizaParcelas, setAtualizaParcelas] = useState(false);

    const relatorioPorData = async () => {
        const dadosRelatorio = ref.current;
        var dataI = dadosRelatorio.dataI.value;
        var dataF = dadosRelatorio.dataF.value;

        await apiFactoring
            .post(
                '/relatorio-emprestimo-cliente-vencimento',
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

    useEffect(() => {
        buscaClienteCodigo();
    }, [idCliente]);

    useEffect(() => {
        !checkRel && setCheckRel('GERAL');
    }, []);

    return (
        <>
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
                <div id="divTituloRelatorio">
                    <label>
                        Realtório de Empréstimo por Cliente e Data de Vencimento
                    </label>
                </div>

                <form className="" ref={ref} onSubmit={handleSubmit}>
                    <div className="boxRow">
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
                                            id="inputNomeCliTaxa"
                                            name="nome"
                                            placeholder=""
                                        />
                                        <FiSearch
                                            size="25"
                                            onClick={exibeFormBusca}
                                        />
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
                                className="icone2"
                                onClick={relatorioPorData}
                            />
                            <FiPrinter
                                className="icone2"
                                onClick={(e) =>
                                    impressaoRelEmprestimo(
                                        listagem,
                                        'Realtório de Empréstimo por Cliente e Data de Vencimento de: ' +
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
        </>
    );
};
