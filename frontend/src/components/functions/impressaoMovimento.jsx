import { useState, useRef, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {
    inverteData,
    retornaDataAtual,
    tamanhoMaximo,
} from '../../biblitoteca';

export const impressaoMovimento = (listagemCheque, listagemEmprestimo) => {
    let totalValorCheques = 0;
    let totalJurosCheques = 0;
    let totalValorTaxa = 0;

    let totalValorEmprestimo = 0;
    let totalJurosEmprestimo = 0;

    const win = window.open('', '', 'heigth=700');
    win.document.write('<html>');
    win.document.write('<head >');
    win.document.write('<title></title>');
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(
        '<table border="0" width="900" style="font-size: 14; font-family: courier;  font-weight: 550;">'
    );

    win.document.write('<tr style="font-size: 12;">');
    win.document.write('<td style="text-align : right">');
    win.document.write('Operação');
    win.document.write('</td>');
    win.document.write('<td style="width: 90px; text-align: center;">');
    win.document.write('Banco');
    win.document.write('</td>');

    win.document.write('<td style="width: 90px; text-align: center;">');
    win.document.write('Cheque');
    win.document.write('</td>');

    win.document.write('<td style="text-align: center; width: 140px;">');
    win.document.write('Emitente');
    win.document.write('</td>');

    win.document.write('<td  style="text-align: center; width: 150px;">');
    win.document.write('Cliente');
    win.document.write('</td>');

    win.document.write('<td style="text-align : right; width: 150px;">');
    win.document.write('Data Op.');
    win.document.write('</td>');

    win.document.write('<td style="text-align : right; width: 100px;">');
    win.document.write('Vencimento');
    win.document.write('</td>');

    win.document.write('<td style="text-align : right">');
    win.document.write('Vl.Cheque');
    win.document.write('</td>');

    win.document.write('<td style="text-align : right">');
    win.document.write('Vl.Taxa');
    win.document.write('</td>');

    win.document.write('<td style="text-align : right">');
    win.document.write('Vl.Juros');
    win.document.write('</td>');

    win.document.write('</tr>');

    win.document.write('<tr>');
    win.document.write('<td colspan="10">');
    win.document.write(
        '----------------------------------------------------------------------------------------------------------'
    );
    win.document.write('</td>');
    win.document.write('</tr>');

    listagemCheque.map((cheques) => {
        win.document.write('<tr>');

        win.document.write('<td style="text-align : center">');
        win.document.write(cheques.idbordero);
        win.document.write('</td>');

        win.document.write('<td style="text-align : center">');
        win.document.write(cheques.numero_banco);
        win.document.write('</td>');

        win.document.write('<td>');
        win.document.write(cheques.numero_cheque);
        win.document.write('</td>');

        win.document.write(
            '<td style="text-transform: uppercase; font-size: 12;">'
        );
        win.document.write(tamanhoMaximo(cheques.nome_cheque, 15));
        win.document.write('</td>');

        win.document.write(
            '<td style="text-transform: uppercase; text-align: center; font-size: 12;" >'
        );
        win.document.write(tamanhoMaximo(cheques.nome, 15));
        win.document.write('</td>');

        win.document.write('<td style="text-align : center; font-size: 13;">');
        win.document.write(inverteData(cheques.data));
        win.document.write('</td>');

        win.document.write('<td style="text-align : right; font-size: 13;">');
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
            (cheques.valor_taxa * 1).toLocaleString('pt-BR', {
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
        totalValorTaxa = totalValorTaxa + cheques.valor_taxa * 1;

        console.log(totalJurosCheques);
    });
    win.document.write('<tr>');
    win.document.write('<td colspan="10">');
    win.document.write(
        '----------------------------------------------------------------------------------------------------------'
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
        (totalValorTaxa * 1).toLocaleString('pt-BR', {
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

    //total
    win.document.write('<tr>');
    win.document.write('<td colspan="9"  style="text-align: right">');
    win.document.write('Total Juros + taxas');
    win.document.write('</td>');

    win.document.write('<td style="text-align: right">');
    win.document.write(
        (totalValorTaxa * 1 + totalJurosCheques * 1).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
        })
    );

    win.document.write('</td>');
    win.document.write('</tr>');

    win.document.write('<td colspan="10">');
    win.document.write(
        '----------------------------------------------------------------------------------------------------------'
    );

    win.document.write('</td>');
    win.document.write('</tr>');
    win.document.write('</table>');

    //rel emprestimo
    win.document.write(
        '<table border="0" width="900" style="font-size: 14; font-family: courier;  font-weight: 550;">'
    );

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
        win.document.write(inverteData(emprestimo.data_cadastro));
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

        win.document.write('<td style="text-align : right ">');
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
        '----------------------------------------------------------------------------------------------------------'
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
    win.document.write('<td style="text-align : right font-size: 12">');
    win.document.write(
        (totalValorEmprestimo * 1).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
        })
    );
    win.document.write('</td>');

    win.document.write('<td style="text-align : right font-size: 12">');
    win.document.write(
        (totalJurosEmprestimo * 1).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    );

    win.document.write('</td>');

    win.document.write('</tr>');

    win.document.write('<tr>');
    win.document.write('<td colspan="8">');
    win.document.write(
        '----------------------------------------------------------------------------------------------------------'
    );

    win.document.write('</td>');
    win.document.write('</tr>');

    win.document.write('<tr>');
    win.document.write('<td colspan="7" style="text-align : right  ">');
    win.document.write('Total Juros + taxas');
    win.document.write('</td>');
    win.document.write('<td style="text-align : right ">');
    win.document.write(
        (
            totalJurosEmprestimo * 1 +
            totalValorTaxa * 1 +
            totalJurosCheques * 1
        ).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    );
    win.document.write('</td>');
    win.document.write('</tr>');

    win.document.write('<tr>');
    win.document.write('<td colspan="8">');
    win.document.write(
        '----------------------------------------------------------------------------------------------------------'
    );

    win.document.write('</td>');
    win.document.write('</tr>');

    win.document.write('<tr>');
    win.document.write('<td colspan="7" style="text-align : right  ">');
    win.document.write('Total Cheques + Emprestimos');
    win.document.write('</td>');
    win.document.write('<td style="text-align : right ">');
    win.document.write(
        (totalValorEmprestimo * 1 + totalValorCheques * 1).toLocaleString(
            'pt-BR',
            {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )
    );
    win.document.write('</td>');
    win.document.write('</tr>');

    win.document.write('</table>');
    win.document.write('</body>');
    win.document.write('</html>');
    win.print();
    //  win.close();
};
