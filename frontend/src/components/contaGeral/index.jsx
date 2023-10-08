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

import { FiPrinter, FiSearch } from 'react-icons/fi';
import { ImBin } from 'react-icons/im';

export const ContaMovimento = ({
    data,
    setData,
    dataF,
    setDataF,
    documento,
    setDocumento,
    numero,
    setNumero,
    valor,
    setValor,
    setTipo,
    gravarLancamento,
    alterarLancamento,
    excluirLancamento,
    idCliente,
    nomeCliente,
    listaLancamentoConta,
    lancamentoConta,
    setTab,
    setIdLancamentoEdit,
    idLancamentoEdit,
    setOnEdit,
    onEdit,
    somaSaida,
    somaEntrada,
}) => {
    const ref = useRef();

    const [dataI, setDataI] = useState();

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
    };

    const imprimir = () => {
        const dadosMovimento = ref.current;

        const win = window.open('', '', 'heigth=700, width=700');
        win.document.write('<html>');
        win.document.write('<head >');
        win.document.write('<title></title>');
        win.document.write('</head>');
        win.document.write('<body>');
        win.document.write(
            '<table border="0" style="width: 300px; font-size: 10px">'
        );
        win.document.write('<tr><td colspan="5" style="text-align : right">');
        win.document.write(dataHoraAtual());
        win.document.write('</td></tr>');
        win.document.write('<tr ><td colspan="5" style="text-align : center">');
        win.document.write(
            '----------------------------------------------------------------------------------------'
        );

        win.document.write('<tr>');
        win.document.write(
            '<td colspan="4" style="text-transform: uppercase">'
        );
        var nome2 = nomeCliente.slice(0, 25);
        win.document.write(nome2);
        win.document.write('</td>');

        win.document.write('<td>');
        win.document.write(inverteData(data));
        win.document.write(' / ');
        win.document.write(inverteData(dataF));
        win.document.write('</td>');

        win.document.write('</tr>');

        win.document.write('<tr><td colspan="5" style="text-align : center">');
        win.document.write(
            '----------------------------------------------------------------------------------------'
        );
        win.document.write('</td ></tr >');
        win.document.write('</table>');

        win.document.write(
            '<table border="0" style="width: 300px; font-size: 10px ; text-transform: uppercase">'
        );

        win.document.write('<tr>');

        win.document.write('<td>');
        win.document.write('Data');
        win.document.write('</td>');

        win.document.write('<td>');
        win.document.write('Documento');
        win.document.write('</td>');

        win.document.write('<td  style="text-align : center">');
        win.document.write('Nº Doc.');
        win.document.write('</td>');

        win.document.write('<td  style="text-align : right">');
        win.document.write('Valor');
        win.document.write('</td >');

        win.document.write('<td  style="text-align : center">');
        win.document.write('Tipo');
        win.document.write('</td>');

        win.document.write('</tr>');

        //
        lancamentoConta.map((movimento, index) => {
            win.document.write('<tr>');

            win.document.write('<td>');
            win.document.write(movimento.data_documento);
            win.document.write('</td>');

            win.document.write('<td>');
            win.document.write(movimento.documento);
            win.document.write('</td>');

            win.document.write('<td  style="text-align : center">');
            win.document.write(movimento.numero_documento);
            win.document.write('</td>');

            win.document.write('<td  style="text-align : right">');
            win.document.write(
                (movimento.valor_documento * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                })
            );
            win.document.write('</td >');

            win.document.write('<td  style="text-align : center">');
            win.document.write(movimento.tipo);
            win.document.write('</td>');

            win.document.write('</tr>');
        });

        //

        win.document.write('<tr><td colspan="5" style="text-align : center">');
        win.document.write(
            '----------------------------------------------------------------------------------------'
        );
        win.document.write('</td ></tr >');

        win.document.write('</tr>');
        win.document.write('<td colspan="5" style="text-align : right">');
        win.document.write(
            'Entrada: ' +
                (somaEntrada * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
        );
        win.document.write('</td>');
        win.document.write('</tr>');

        win.document.write('</tr>');
        win.document.write('<td colspan="5" style="text-align : right">');
        win.document.write(
            'Saída: ' +
                (somaSaida * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
        );
        win.document.write('</td>');
        win.document.write('</tr>');

        win.document.write('</table>');

        win.document.write('</body>');
        win.document.write('</html>');
        win.print();
        //  win.close();
    };

    useEffect(() => {
        setTipo('movimento');
    }, [dataF, data, idCliente]);

    useEffect(() => {
        editarLancamento(idLancamentoEdit);
    }, [idLancamentoEdit]);

    return (
        <>
            <form id="formContaEntrada" onSubmit={handleSubmit} ref={ref}>
                <div>
                    <h1>Movimento</h1>
                </div>
                <div className="boxRow">
                    <div className="boxCol">
                        <label>Data Inicial</label>
                        <input
                            type="date"
                            id="inputData"
                            name="data"
                            value={data}
                            onKeyDown={(e) => keyDown(e, 'inputDataF')}
                            onChange={(e) => {
                                setData(e.target.value);
                            }}
                            autoFocus
                        />
                    </div>
                    <div className="boxCol">
                        <label>Data Final</label>
                        <div className="boxRow">
                            <input
                                type="date"
                                id="inputDataF"
                                name="dataF"
                                value={dataF}
                                onKeyDown={(e) => keyDown(e, 'iconeLista')}
                                onChange={(e) => {
                                    setDataF(e.target.value);
                                }}
                                autoFocus
                            />{' '}
                            <FiSearch
                                onClick={listaLancamentoConta}
                                className="icone2"
                            />
                            <FiPrinter
                                className="icone2"
                                onClick={(e) => imprimir()}
                            />
                        </div>
                    </div>
                </div>
                <div id="divContainerConta">
                    <div className="gridContaTitulo">
                        <div>Data</div>
                        <div>Documento</div>
                        <div className="alignCenter">Nº Documento</div>
                        <div className="alignRight">Valor</div>
                        <div className="alignCenter">Tipo</div>
                        <div className="alignCenter"></div>
                        <div className="alignCenter">Excluir</div>
                    </div>
                    {lancamentoConta.map((lancamento, index) => (
                        <div
                            className={
                                lancamento.tipo == 'saida'
                                    ? 'gridContaLancamentoSaida'
                                    : 'gridContaLancamento'
                            }
                            key={index}
                        >
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
                            <div className="alignCenter">{lancamento.tipo}</div>
                            <div className="alignCenter"></div>
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
                <div id="divTotalMovimentoConta">
                    <div>
                        Entrada:{' '}
                        {(somaEntrada * 1).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </div>
                    <div>
                        Saída:{' '}
                        {(somaSaida * 1).toLocaleString('pt-BR', {
                            style: 'decimal',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </div>
                </div>
            </form>{' '}
        </>
    );
};
