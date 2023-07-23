import './gridCheque.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiFactoring } from '../../services/api';

export const GridCheque = ({
    idBordero,
    rodaLista,
    setSomaValorCheque,
    setSomaValorLiquido,
    setSomaValorJuros,
    setQuantidadeCheques,
}) => {
    const [lancamentos, setLancamentos] = useState([]);

    const listaCheques = async () => {
        console.log(idBordero);
        await apiFactoring
            .post(
                '/listar-Lancamento',
                { operacao: idBordero },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setLancamentos(data);
                console.log(data);
            })
            .catch();
    };

    const arrayOfObjectsSum = (arr, key) => {
        return arr.reduce((a, b) => a + (b[key] || 0), 0);
    };

    useEffect(() => {
        const valorCheque = arrayOfObjectsSum(lancamentos, 'valor_cheque');
        setSomaValorCheque(valorCheque.toFixed(2));

        const valorLiquido = arrayOfObjectsSum(lancamentos, 'valor_liquido');
        setSomaValorLiquido(valorLiquido.toFixed(2));

        const valorJuros = arrayOfObjectsSum(lancamentos, 'valor_juros');
        setSomaValorJuros(valorJuros.toFixed(2));

        setQuantidadeCheques(lancamentos.length);
    });

    useEffect(() => {
        listaCheques();
    }, [rodaLista]);
    return (
        <>
            <div>
                <div className="gridCheque">
                    <div>Banco</div>
                    <div>Nome do Banco</div>
                    <div>N. Cheque</div>
                    <div>Nome</div>
                    <div>Vencimento</div>
                    <div>Valor do Cheque</div>
                    <div>Dias</div>
                    <div>Valor Juros</div>
                    <div>Valor Liquido</div>
                </div>
                {lancamentos.map((item) => (
                    <div className="gridLinhaCheque" key={item.idlancamento}>
                        <div>{item.numero_banco}</div>
                        <div>{item.nome_banco}</div>
                        <div>{item.numero_cheque}</div>
                        <div>{item.nome_cheque}</div>

                        <div>
                            <input
                                type="date"
                                readOnly
                                value={item.data_vencimento}
                            />
                        </div>

                        <div>{item.valor_cheque}</div>
                        <div>{item.dias}</div>
                        <div>{item.valor_juros}</div>
                        <div>{item.valor_liquido}</div>
                    </div>
                ))}
            </div>
        </>
    );
};
