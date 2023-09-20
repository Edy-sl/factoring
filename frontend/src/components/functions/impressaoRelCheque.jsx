import { useState, useRef, useEffect } from 'react';
import {
    inverteData,
    retornaDataAtual,
    tamanhoMaximo,
} from '../../biblitoteca';

export const impressaoRelCheque = (listagemCheque, nomeRelatorio) => {
    let totalValorCheques = 0;
    let totalJurosCheques = 0;
    let totalValorTaxa = 0;

    let totalValorEmprestimo = 0;
    let totalJurosEmprestimo = 0;

    const win = window.open('', '', 'heigth=700, width=900');
    win.document.write('<html>');
    win.document.write('<head >');
    win.document.write('<title></title>');
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write('<table border="0" width="900">');

    win.document.write('<tr>');
    win.document.write('<td colspan="10">');
    win.document.write(nomeRelatorio);
    win.document.write('</td>');
    win.document.write('</tr>');

    win.document.write('<tr>');
    win.document.write('<td colspan="10">');
    win.document.write(
        '-----------------------------------------------------------------------------------------------------------------------------------------------------------------------'
    );
    win.document.write('</td>');
    win.document.write('</tr>');

    win.document.write('<tr>');
    win.document.write('<td style="text-align : right">');
    win.document.write('Operação');
    win.document.write('</td>');
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
    win.document.write('Data Op.');
    win.document.write('</td>');

    win.document.write('<td style="text-align : right">');
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

        win.document.write('<td style="text-transform: uppercase ;">');
        win.document.write(tamanhoMaximo(cheques.nome_cheque, 15));
        win.document.write('</td>');

        win.document.write('<td style="text-transform: uppercase;  " >');
        win.document.write(tamanhoMaximo(cheques.nome, 15));
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

    win.document.write('<td colspan="10">');
    win.document.write(
        '-----------------------------------------------------------------------------------------------------------------------------------------------------------------------'
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

    win.document.write('</table>');

    ////////////////////////////////

    win.document.write('</body>');
    win.document.write('</html>');
    win.print();
    //  win.close();
};
