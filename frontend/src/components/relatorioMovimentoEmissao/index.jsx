import { FiSearch, FiPrinter } from 'react-Icons/fi';
import { useState, useRef, useEffect } from 'react';
import { apiFactoring } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GridChequeRelatorio } from '../gridRelatorioCheques';
import {
    converteFloatMoeda,
    inverteData,
    retornaDataAtual,
    tamanhoMaximo,
} from '../../biblitoteca.jsx';
import { GridRelatorioEmprestimo } from '../gridRelatorioEmprestimo';

export const RelatorioMovimentoPorEmissao = () => {
    const ref = useRef();

    const [listagemCheque, setListagemCheque] = useState([]);
    const [listagemEmprestimo, setListagemEmprestimo] = useState([]);

    const [dadosCheque, setDadosCheque] = useState([]);

    const [checkRel, setCheckRel] = useState('GERAL');

    const [dataIni, setDataIni] = useState(retornaDataAtual());
    const [dataFim, setDataFim] = useState(retornaDataAtual());

    let totalValorCheques = 0;
    let totalJurosCheques = 0;

    let totalValorEmprestimo = 0;
    let totalJurosEmprestimo = 0;

    const [idParcela, setIdParcela] = useState(0);
    const [parcelaN, setParcelaN] = useState(0);

    const [atualizaParcelas, setAtualizaParcelas] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const relatorioPorData = async () => {
        const dadosRelatorio = ref.current;
        var dataI = dadosRelatorio.dataI.value;
        var dataF = dadosRelatorio.dataF.value;

        await apiFactoring
            .post(
                '/relatorio-movimento-cheque-emissao',
                {
                    dataI: dataI,
                    dataF: dataF,
                    status: checkRel,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                console.log(data);
                setListagemCheque(data);
            })
            .catch(({ data }) => {
                toast.error(data);
            });

        await apiFactoring
            .post(
                '/relatorio-movimento-emprestimo-emissao',
                {
                    dataI: dataI,
                    dataF: dataF,
                    tipoRel: checkRel,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                console.log(data);
                setListagemEmprestimo(data);
                console.log(data);
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const imprimir = () => {
        const dadosRelatorio = ref.current;
        totalJurosCheques = 0;
        totalValorCheques = 0;

        totalValorEmprestimo = 0;
        totalJurosEmprestimo = 0;

        const win = window.open('', '', 'heigth=700, width=900');
        win.document.write('<html>');
        win.document.write('<head >');
        win.document.write('<title></title>');
        win.document.write('</head>');
        win.document.write('<body>');
        win.document.write('<table border="0" width="900">');

        win.document.write('<tr>');
        win.document.write('<td>');
        win.document.write('Banco');
        win.document.write('</td>');

        win.document.write('<td>');
        win.document.write('N. Cheque');
        win.document.write('</td>');

        win.document.write('<td>');
        win.document.write('Emitente');
        win.document.write('</td>');

        win.document.write('<td>');
        win.document.write('Cliente');
        win.document.write('</td>');

        win.document.write('<td style="text-align : right">');
        win.document.write('Operação');
        win.document.write('</td>');

        win.document.write('<td style="text-align : right">');
        win.document.write('Data Op.');
        win.document.write('</td>');

        win.document.write('<td style="text-align : right">');
        win.document.write('Vencimento');
        win.document.write('</td>');

        win.document.write('<td style="text-align : right">');
        win.document.write('Vl.Cheque');
        win.document.write('</td>');

        win.document.write('<td style="text-align : right">');
        win.document.write('Vl.Juros');
        win.document.write('</td>');

        win.document.write('</tr>');

        listagemCheque.map((cheques) => {
            win.document.write('<tr>');
            win.document.write('<td>');
            win.document.write(cheques.numero_banco);
            win.document.write('</td>');

            win.document.write('<td>');
            win.document.write(cheques.numero_cheque);
            win.document.write('</td>');

            win.document.write('<td style="text-transform: uppercase ;">');
            win.document.write(tamanhoMaximo(cheques.nome_cheque, 15));
            win.document.write('</td>');

            win.document.write('<td style="text-transform: uppercase;  " >');
            win.document.write(tamanhoMaximo(cheques.nome, 15));
            win.document.write('</td>');

            win.document.write('<td style="text-align : right">');
            win.document.write(cheques.idbordero);
            win.document.write('</td>');

            win.document.write('<td style="text-align : right">&nbsp;&nbsp;');
            win.document.write(inverteData(cheques.data));
            win.document.write('</td>');

            win.document.write('<td style="text-align : right">&nbsp;&nbsp;');
            win.document.write(inverteData(cheques.data_vencimento));
            win.document.write('</td>');

            win.document.write('<td style="text-align : right">&nbsp;&nbsp;');
            win.document.write(
                (cheques.valor_cheque * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            );
            win.document.write('</td>');

            win.document.write('<td style="text-align : right">&nbsp;&nbsp;');
            win.document.write(
                (cheques.valor_juros * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            );
            win.document.write('</td>');

            win.document.write('</tr>');
            totalJurosCheques = totalJurosCheques + cheques.valor_juros * 1;
            totalValorCheques = totalValorCheques + cheques.valor_cheque * 1;

            console.log(totalJurosCheques);
        });
        win.document.write('<tr>');
        win.document.write('<td colspan="9">');
        win.document.write(
            '-----------------------------------------------------------------------------------------------------------------------------------------------------------------------'
        );
        win.document.write('</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td>');
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write('</td>');

        win.document.write('<td>');
        win.document.write('</td>');

        win.document.write('<td>');
        win.document.write('</td>');
        win.document.write('<td style="text-align : right">');
        win.document.write(
            (totalValorCheques * 1).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
            })
        );
        win.document.write('</td>');

        win.document.write('<td style="text-align : right">');
        win.document.write(
            (totalJurosCheques * 1).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
            })
        );

        win.document.write('</td>');
        win.document.write('</tr>');

        win.document.write('<td colspan="9">');
        win.document.write(
            '-----------------------------------------------------------------------------------------------------------------------------------------------------------------------'
        );
        win.document.write('</td>');
        win.document.write('</tr>');
        win.document.write('</table>');

        //rel emprestimo
        win.document.write('<table border="01" width="900">');

        win.document.write('<tr>');
        win.document.write('<td>');
        win.document.write('Operação');
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write('Cliente');
        win.document.write('</td>');
        win.document.write('<td style="text-align : right">');
        win.document.write('Parcela');
        win.document.write('</td>');
        win.document.write('<td style="text-align : right">');
        win.document.write('Emissão');
        win.document.write('</td>');
        win.document.write('<td style="text-align : right">');
        win.document.write('Vencimento');
        win.document.write('</td>');
        win.document.write('<td style="text-align : right">');
        win.document.write('Empréstimo');
        win.document.write('</td>');

        win.document.write('<td style="text-align : right">');
        win.document.write('Vl. Parcela');
        win.document.write('</td>');
        win.document.write('<td style="text-align : right">');
        win.document.write('Vl. Juros');
        win.document.write('</td>');
        win.document.write('</tr>');

        listagemEmprestimo.map((emprestimo) => {
            win.document.write('<tr>');
            win.document.write('<td>');
            win.document.write(emprestimo.idemprestimo);
            win.document.write('</td>');

            win.document.write('<td style="text-transform: uppercase; ">');
            win.document.write(tamanhoMaximo(emprestimo.nome, 15));
            win.document.write('</td>');

            win.document.write('<td style="text-align : right">');
            win.document.write(
                emprestimo.parcela + '/' + emprestimo.quantidade_parcelas
            );
            win.document.write('</td>');

            win.document.write('<td style="text-align : right">');
            win.document.write(emprestimo.data_cadastro);
            win.document.write('</td>');

            win.document.write('<td style="text-align : right">');
            win.document.write(inverteData(emprestimo.vencimento));
            win.document.write('</td>');

            win.document.write('<td style="text-align : right">');
            win.document.write(
                (emprestimo.valor_total * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            );
            win.document.write('</td style="text-align : right">');

            win.document.write('<td style="text-align : right">');
            win.document.write(
                (emprestimo.valor * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            );
            win.document.write('</td>');

            win.document.write('<td style="text-align : right">');
            win.document.write(
                (
                    emprestimo.valor_juros / emprestimo.quantidade_parcelas
                ).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            );
            win.document.write('</td>');

            win.document.write('</tr>');

            totalValorEmprestimo = totalValorEmprestimo + emprestimo.valor * 1;
            totalJurosEmprestimo =
                totalJurosEmprestimo +
                emprestimo.valor_juros / emprestimo.quantidade_parcelas;
        });
        win.document.write('<tr>');
        win.document.write('<td colspan="8">');
        win.document.write(
            '-----------------------------------------------------------------------------------------------------------------------------------------------------------------------'
        );
        win.document.write('</td>');
        win.document.write('</tr>');

        win.document.write('<tr>');
        win.document.write('<td>');
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write('</td>');
        win.document.write('</td>');
        win.document.write('<td>');
        win.document.write('<td style="text-align : right">');
        win.document.write(
            (totalValorEmprestimo * 1).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
            })
        );
        win.document.write('</td>');

        win.document.write('<td style="text-align : right">');
        win.document.write(
            (totalJurosEmprestimo * 1).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );

        win.document.write('</td>');

        win.document.write('</tr>');

        win.document.write('<td colspan="8">');
        win.document.write(
            '-----------------------------------------------------------------------------------------------------------------------------------------------------------------------'
        );

        win.document.write('</td>');
        win.document.write('</tr>');

        win.document.write('</table>');
        win.document.write('</body>');
        win.document.write('</html>');
        win.print();
        //  win.close();
    };

    return (
        <>
            {' '}
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
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
                <div id="divTituloRelatorio">
                    <label>Realtório por Data de Emissão</label>
                </div>
                <form className="" ref={ref} onSubmit={handleSubmit}>
                    <div className="boxRow" id="divFiltroMovimentoEmissao">
                        <div className="boxCol">
                            <label>Geral</label>
                        </div>

                        <div className="boxCol" id="divCheckbox">
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
                                <FiSearch
                                    className="icone2"
                                    onClick={checkRel && relatorioPorData}
                                />{' '}
                                <FiPrinter
                                    className="icone2"
                                    onClick={imprimir}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <GridChequeRelatorio listagem={listagemCheque} />
            <GridRelatorioEmprestimo listagem={listagemEmprestimo} />
        </>
    );
};
