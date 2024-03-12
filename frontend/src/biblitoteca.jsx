import extenso from 'extenso';

export const cpfCnpjMask = (value) => {
    const vlimpo = value
        .replace('.', '')
        .replace('.', '')
        .replace('-', '')
        .replace('/', '');

    if (vlimpo.length == 11) {
        return vlimpo
            .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
            .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1'); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
    }
    if (vlimpo.length == 14) {
        return vlimpo
            .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
            .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2') // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1'); // captura os dois últimos 2 números, com um - antes dos dois números
    }
};

export const keyDown = (e, elemento, target, elemento2, elemento3) => {
    if (target == 'emitente' && e.key == 'ArrowDown') {
        if (document.getElementById(elemento2)) {
            document.getElementById(elemento2).focus();
        }
    }

    if (target == 'emitente' && e.key == 'ArrowUp') {
        if (document.getElementById(elemento3)) {
            document.getElementById(elemento3).focus();
        }
    }

    if (target == 'cliente' && e.key == 'ArrowDown') {
        if (document.getElementById(elemento2)) {
            document.getElementById(elemento2).focus();
        }
    }

    if (target == 'cliente' && e.key == 'ArrowUp') {
        if (document.getElementById(elemento3)) {
            document.getElementById(elemento3).focus();
        }
    }

    if (target == 'credor' && e.key == 'ArrowDown') {
        if (document.getElementById(elemento2)) {
            document.getElementById(elemento2).focus();
        }
    }

    if (target == 'credor' && e.key == 'ArrowUp') {
        if (document.getElementById(elemento3)) {
            document.getElementById(elemento3).focus();
        }
    }

    if (target == 'avalista' && e.key == 'ArrowDown') {
        if (document.getElementById(elemento2)) {
            document.getElementById(elemento2).focus();
        }
    }

    if (target == 'avalista' && e.key == 'ArrowUp') {
        if (document.getElementById(elemento3)) {
            document.getElementById(elemento3).focus();
        }
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById(elemento).focus();
        if (document.getElementById(elemento).select) {
            document.getElementById(elemento).select();
        }
    }
};

export const converteMoedaFloat = (valor) => {
    if (valor === '') {
        valor = 0;
    } else {
        // valor = valor.replace(',', '.');
        // valor = parseFloat(valor);

        valor = valor.replace('.', '');
        valor = valor.replace('.', '');

        valor = valor.replace(',', '.');

        valor = parseFloat(valor);
    }
    return valor;
};

export const converteFloatMoeda = (valor) => {
    valor = valor.replace('.', ',');
    //  valor = valor.replace(',', '.');
    // valor = parseFloat(valor);

    return valor;
};

export const retornaDataAtual = () => {
    const data = new Date();
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const atual = ano + '-' + mes + '-' + dia;

    return atual;
};

export const feriadosFixos = (data) => {
    //Array de datas no formato mes/dia.

    //OBS: O primeiro mes é 0 e o último mes é 11

    //se for feriado retorna a data + 1 dia

    var datas_feriado = [
        [0, 1],
        [3, 21],
        [4, 1],
        [8, 7],
        [9, 12],
        [10, 2],
        [10, 15],
        [11, 25],
    ];
    var add_dias = false;
    var mes = parseInt(data.getMonth());
    var dia = parseInt(data.getDate());

    for (let z = 0; z < datas_feriado.length; z++) {
        if (datas_feriado[z][0] == mes && datas_feriado[z][1] == dia) {
            var add_dia = true;

            return add_dia;
        }
    }
};

export const calculaParcelaEmprestimo = (
    intervalo,
    jurosMensal,
    jurosDiario,
    parcelas,
    valorEmprestimo
) => {
    if (intervalo == 0) {
        var juros = parseFloat(jurosMensal);
    } else {
        var juros = parseFloat(jurosDiario);
        var juros = juros * intervalo;
    }

    juros = juros / 100;
    const parcela = parseInt(parcelas);
    let capital = converteMoedaFloat(valorEmprestimo);

    const fator1 = Math.pow(1 + juros, parcela) * juros;
    const fator2 = Math.pow(1 + juros, parcela) - 1;
    let prestacao = (fator1 / fator2) * capital;

    prestacao = prestacao.toFixed(2);
    let valorTotalJuros = prestacao * parcela - capital;
    valorTotalJuros = valorTotalJuros.toFixed(2);

    let valorTotal = prestacao * parcela * '1';
    valorTotal = valorTotal.toFixed(2);

    const calculos = [
        {
            prestacao: prestacao,
            valorTotalJuros: valorTotalJuros,
            valorTotal: valorTotal,
        },
    ];
    return [calculos];
};

export const tamanhoMaximo = (texto, tamanho) => {
    let cortada = texto.substring(0, tamanho);
    return cortada;
};

function zeroFill(n) {
    return n < 10 ? `0${n}` : `${n}`;
}

export const formataDias = (date) => {
    const d = zeroFill(date.getDate());
    const mo = zeroFill(date.getMonth() + 1);
    const y = zeroFill(date.getFullYear());
    const h = zeroFill(date.getHours());
    const mi = zeroFill(date.getMinutes());
    const s = zeroFill(date.getSeconds());
    return `${y}-${mo}-${d}`;
};

export const dataHoraAtual = () => {
    const date = new Date();
    const d = zeroFill(date.getDate());
    const mo = zeroFill(date.getMonth() + 1);
    const y = zeroFill(date.getFullYear());
    const h = zeroFill(date.getHours());
    const mi = zeroFill(date.getMinutes());
    const s = zeroFill(date.getSeconds());
    return `${d}-${mo}-${y} / ${h}:${mi}:${s}`;
};

//formata para dd/mm/aaaa
/*export const formataData = (dataI) => {
    const data = dataI;

    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    var dataFormatada = dia + '/' + mes + '/' + ano;
    return dataFormatada;
};*/

//invert data no padrao xx-xx-xxxx ou xxxx-xx-xx
export const inverteData = (data) => {
    var dataInvertida = data.split('-').reverse().join('-');
    return dataInvertida;
};

export const formatarDataExtenso = (data) => {
    var dataExtenso;

    var day = [
        'Domingo',
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado',
    ][data.getDay()];
    var date = data.getDate() + 1;
    date = extenso(date);

    var month = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
    ][data.getMonth()];
    var year = data.getFullYear();
    year = extenso(year);

    // extenso = `${day}, ${date} de ${month} de ${year}`;
    dataExtenso = `${date} de ${month} de ${year}`;

    return dataExtenso;
};
