import {
    inverteData,
    retornaDataAtual,
    tamanhoMaximo,
} from '../../biblitoteca';

export const impressaoRelEmprestimo = (
    listagemEmprestimo,
    nomeRelatorio,
    checkRel,
    totalValorR,
    totalValorRecebido,
    totalValorReceber,
    totalValorJuros
) => {
    const win = window.open('', '', 'heigth=700, width=900');
    win.document.write(
        '<table border="0" width="900" style="font-family: courier; font-size: 14px; font-weight: 550;">'
    );

    win.document.write('<tr>');
    win.document.write('<td colspan="8">');
    win.document.write(nomeRelatorio);
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
            (emprestimo.valor_parcela * 1).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
            })
        );

        win.document.write('</td>');

        win.document.write('<td style="text-align : right">');
        if (checkRel != 'AGRUPADO') {
            win.document.write(
                (
                    (emprestimo.valor_juros / emprestimo.quantidade_parcelas) *
                    1
                ).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            );
        } else {
            win.document.write(
                (emprestimo.valor_juros * 1).toLocaleString('pt-BR', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            );
        }
        win.document.write('</td>');

        win.document.write('</tr>');

        if (emprestimo.tipo_emprestimo == 'veiculo') {
            win.document.write('<tr>');
            win.document.write('<td colspan="5">');
            win.document.write(
                'Veículo: ' +
                    emprestimo.nome_veiculo +
                    '   Placa: ' +
                    emprestimo.placa
            );
            win.document.write('</td>');
            win.document.write('</tr>');
            win.document.write('<tr>');
            win.document.write('<td colspan="8">');
            win.document.write('<br>');

            win.document.write('</td>');
            win.document.write('</tr>');
        }
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

    win.document.write('<td style="text-align : right">');
    win.document.write('Total');
    win.document.write('</td>');

    win.document.write('<td style="text-align : right">');
    win.document.write(
        (totalValorR * 1).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
        })
    );
    win.document.write('</td>');

    win.document.write('<td style="text-align : right">');
    win.document.write(
        (totalValorJuros * 1).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    );

    win.document.write('</table>');
    win.document.write('</body>');
    win.document.write('</html>');
    win.print();
    //  win.close();
};
