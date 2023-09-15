import {
    inverteData,
    retornaDataAtual,
    tamanhoMaximo,
} from '../../biblitoteca';

export const impressaoRelEmprestimo = (listagemEmprestimo, nomeRelatorio) => {
    let totalValorEmprestimo = 0;
    let totalJurosEmprestimo = 0;

    const win = window.open('', '', 'heigth=700, width=900');
    win.document.write('<table border="0" width="900">');

    win.document.write('<tr>');
    win.document.write('<td colspan="8">');
    win.document.write(nomeRelatorio);
    win.document.write('</td>');
    win.document.write('</tr>');

    win.document.write('<tr>');
    win.document.write('<td colspan="8">');
    win.document.write(
        '-----------------------------------------------------------------------------------------------------------------------------------------------------------------------'
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

    win.document.write('<td style="text-align : right">');
    win.document.write('Total');
    win.document.write('</td>');

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

    win.document.write('</table>');
    win.document.write('</body>');
    win.document.write('</html>');
    win.print();
    //  win.close();
};
