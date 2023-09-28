import { useEffect, useRef, useState } from 'react';
import {
    converteFloatMoeda,
    converteMoedaFloat,
    dataHoraAtual,
    inverteData,
    keyDown,
    retornaDataAtual,
} from '../../biblitoteca';

import { apiFactoring } from '../../services/api';
import { FiDelete, FiEdit, FiTrash, FiTrash2 } from 'react-icons/fi';
import { ImBin } from 'react-icons/im';

export const Entrada = ({
    data,
    setData,
    documento,
    setDocumento,
    numero,
    setNumero,
    valor,
    setValor,
    tipo,
    setTipo,
    gravarLancamento,
    alterarLancamento,
    excluirLancamento,
    idCliente,
    listaLancamentoConta,
    lancamentoConta,
}) => {
    const ref = useRef();

    const [dataI, setDataI] = useState();

    const [onEdtit, setOnEdit] = useState();

    const [idLancamento, setIdLancamento] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const editarLancamento = (id) => {
        const lancamentoFiltrado = lancamentoConta.filter(
            (l) => l.idlancamento === id * 1
        );

        setIdLancamento(id);

        const dadosLancamento = ref.current;

        lancamentoFiltrado.map((lancamentoF) => {
            setData(lancamentoF.data_documento);
            setDocumento(lancamentoF.documento);
            setNumero(lancamentoF.numero_documento);
            setValor(converteFloatMoeda(lancamentoF.valor_documento));
            setTipo(lancamentoF.tipo);

            console.log(lancamentoF.data_documento);
        });

        setOnEdit(true);
    };

    useEffect(() => {
        const dadosEntrada = ref.current;

        setTipo('entrada');
    }, []);

    useEffect(() => {
        listaLancamentoConta();
    }, [dataI, data, idCliente]);

    return (
        <>
            <form id="formContaEntrada" onSubmit={handleSubmit} ref={ref}>
                <div>
                    <h1>Entrada</h1>
                </div>
                <div className="boxRow">
                    <div className="boxCol">
                        <label>Data</label>
                        <input
                            type="date"
                            id="inputData"
                            name="data"
                            value={data}
                            onKeyDown={(e) => keyDown(e, 'inputDocumento')}
                            onChange={(e) => {
                                setData(e.target.value);
                                setDataI(e.target.value);
                            }}
                            autoFocus
                        />
                    </div>
                    <div className="boxCol">
                        <label>Documento</label>
                        <input
                            type="text"
                            id="inputDocumento"
                            name="documento"
                            value={documento}
                            onKeyDown={(e) => keyDown(e, 'inputNumeroDoc')}
                            onChange={(e) => setDocumento(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            autoComplete="off"
                        />
                    </div>

                    <div className="boxCol">
                        <label>Nº Documento</label>
                        <input
                            type="text"
                            id="inputNumeroDoc"
                            name="numeroDoc"
                            value={numero}
                            onKeyDown={(e) => keyDown(e, 'inputValorEntrada')}
                            onChange={(e) => setNumero(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            autoComplete="off"
                        />
                    </div>
                    <div className="boxCol">
                        <label>Valor</label>
                        <input
                            type="text"
                            id="inputValorEntrada"
                            name="valor"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            onKeyDown={(e) => keyDown(e, 'inputEntrada')}
                            onBlur={(e) => {
                                e.target.value = converteFloatMoeda(
                                    e.target.value
                                );
                                setValor(e.target.value);
                            }}
                            onFocus={(e) => e.target.select()}
                            autoComplete="off"
                        />
                    </div>
                    <div className="boxCol">
                        <label>Tipo</label>
                        <input
                            type="text"
                            id="inputEntrada"
                            name="tipo"
                            value="entrada"
                            readOnly
                            onKeyDown={(e) => keyDown(e, 'btnGravar')}
                            onFocus={(e) => e.target.select()}
                            autoComplete="off"
                        />
                    </div>
                    {!onEdtit && (
                        <button
                            id="btnGravar"
                            onClick={(e) => {
                                gravarLancamento();
                                listaLancamentoConta();
                            }}
                        >
                            Gravar
                        </button>
                    )}
                    {onEdtit == true && (
                        <button
                            id="btnGravar"
                            onClick={(e) => {
                                alterarLancamento(idLancamento);
                                listaLancamentoConta();
                                setOnEdit(false);
                                document.getElementById('inputData').focus();
                            }}
                        >
                            Alterar
                        </button>
                    )}
                </div>
                <div id="divContainerConta">
                    <div className="gridContaTitulo">
                        <div>Data</div>
                        <div>Documento</div>
                        <div className="alignCenter">Nº Documento</div>
                        <div className="alignRight">Valor</div>
                        <div className="alignCenter">Tipo</div>
                        <div className="alignCenter">Editar</div>
                        <div className="alignCenter">Excluir</div>
                    </div>
                    {lancamentoConta.map((lancamento, index) => (
                        <div className="gridContaLancamento" key={index}>
                            <div>{inverteData(lancamento.data_documento)}</div>
                            <div>{lancamento.documento}</div>
                            <div className="alignCenter">
                                {lancamento.numero_documento}
                            </div>
                            <div className="alignRight">
                                {(
                                    lancamento.valor_documento * 1
                                ).toLocaleString('pt-BR', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                            <div className="alignRight">{lancamento.tipo}</div>
                            <div className="alignCenter">
                                <FiEdit
                                    onClick={(e) =>
                                        editarLancamento(
                                            lancamento.idlancamento
                                        )
                                    }
                                />
                            </div>
                            <div className="alignCenter">
                                <ImBin
                                    onClick={(e) =>
                                        excluirLancamento(
                                            lancamento.idlancamento
                                        )
                                    }
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </form>{' '}
        </>
    );
};
