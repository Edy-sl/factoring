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
import { GridChequeRelatorio } from '../gridRelatorioCheques';
import { impressaoRelCheque } from '../functions/impressaoRelCheque';
import { BuscaEmitente } from '../buscaEmitente';
import { TituloTela } from '../titulosTela/tituloTela';

export const RelatorioChequePorEmitenteVencimento = () => {
    const [nomeEmitente, setNomeEmitente] = useState('');
    const [emitenteFiltrado, setEmitenteFiltrado] = useState([]);
    const [emitente, setEmitente] = useState([]);
    const [formBusca, setFormBusca] = useState();
    const [checkEspecial, setCheckEspecial] = useState('NAO');
    const [formBuscaEmitente, setFormBuscaEmitente] = useState(false);

    let newArray = [];

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
                '/relatorio-cheque-emitente-vencimento',
                {
                    dataI: dataI,
                    dataF: dataF,
                    status: checkRel,
                    emitente: nomeEmitente,
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
                setListagem(newArray);
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
            });
    };

    const FiltraEmitente = (busca) => {
        let emitenteF = [];
        emitenteF = emitente.filter((E) =>
            E.nome_cheque
                .toUpperCase()
                .includes(busca.toUpperCase() || E.nome_cheque != ' ')
        );
        setEmitenteFiltrado(emitenteF);

        if (emitenteF.length == 0) {
            setFormBuscaEmitente(false);
        } else {
            setFormBuscaEmitente(true);
        }
    };

    useEffect(() => {
        !checkRel && setCheckRel('GERAL');
        buscaEmitente();
    }, []);

    return (
        <>
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            {formBusca == true && (
                <BuscaEmitente
                    setFormBusca={setFormBusca}
                    setNomeEmitente={setNomeEmitente}
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
                <TituloTela tituloTela="Realtório de Cheques por Emitente e Data de Vencimento" />

                <form className="" ref={ref} onSubmit={handleSubmit}>
                    <div className="boxRow">
                        <div className="boxRow">
                            <div className="boxRow">
                                <div className="boxCol">
                                    <label>Emitente</label>
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
                                            }}
                                            onFocus={(e) => e.target.select()}
                                        />
                                        {formBuscaEmitente == true && (
                                            <BuscaEmitente
                                                setFormBusca={
                                                    setFormBuscaEmitente
                                                }
                                                setNomeEmitente={
                                                    setNomeEmitente
                                                }
                                                emitenteFiltrado={
                                                    emitenteFiltrado
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="boxCol">
                            <label>Devolvido</label>
                            <label>Recebido</label>
                            <label>Geral</label>
                        </div>

                        <div className="boxCol" id="divCheckbox">
                            {checkRel == 'DEVOLVIDO' ? (
                                <input
                                    type="checkbox"
                                    name="chekedDevolvido"
                                    checked
                                    id="checkRel"
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    name="chekedDevolvido"
                                    id="checkRel"
                                    onChange={(e) => setCheckRel('DEVOLVIDO')}
                                />
                            )}

                            {checkRel == 'PAGO' ? (
                                <input
                                    type="checkbox"
                                    name="chekedRecebido"
                                    id="checkRel"
                                    checked
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    name="chekeRecebido"
                                    id="checkRel"
                                    onChange={(e) => setCheckRel('PAGO')}
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
                                    impressaoRelCheque(
                                        listagem,
                                        'Realtório de Cheques por Cliente e Data de Vencimento de: ' +
                                            inverteData(dataIni) +
                                            ' a ' +
                                            inverteData(dataFim)
                                    )
                                }
                            />
                        </div>
                    </div>
                </form>
            </div>{' '}
            <GridChequeRelatorio listagem={listagem} />
        </>
    );
};
