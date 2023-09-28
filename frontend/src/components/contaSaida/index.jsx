import { useEffect, useRef } from 'react';
import {
    dataHoraAtual,
    inverteData,
    keyDown,
    retornaDataAtual,
} from '../../biblitoteca';

export const Saida = ({
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
}) => {
    const ref = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const arrayLancamento = [
        {
            documeto: 'venda',
            numero_documento: '123456',
            valor_documento: '250.00',
            data_documento: '2023-09-26',
            tipo: 'entrada',
        },
        {
            documeto: 'venda',
            numero_documento: '32152',
            valor_documento: '1550.00',
            data_documento: '2023-09-26',
            tipo: 'entrada',
        },
    ];

    useEffect(() => {
        const dadosEntrada = ref.current;
        dadosEntrada.data.value = retornaDataAtual();

        setTipo('saida');
    }, []);

    return (
        <>
            <form id="formContaEntrada" onSubmit={handleSubmit} ref={ref}>
                <div>
                    <h1>Saída</h1>
                </div>
                <div className="boxRow">
                    <div className="boxCol">
                        <label>Data</label>
                        <input
                            type="date"
                            id="inputData"
                            name="data"
                            onKeyDown={(e) => keyDown(e, 'inputDocumento')}
                            onChange={(e) => setData(e.target.value)}
                        />
                    </div>
                    <div className="boxCol">
                        <label>Documento</label>
                        <input
                            type="text"
                            id="inputDocumento"
                            name="documento"
                            onKeyDown={(e) => keyDown(e, 'inputNumeroDoc')}
                            onChange={(e) => setDocumento(e.target.value)}
                        />
                    </div>

                    <div className="boxCol">
                        <label>Nº Documento</label>
                        <input
                            type="text"
                            id="inputNumeroDoc"
                            name="numeroDoc"
                            onKeyDown={(e) => keyDown(e, 'inputValorEntrada')}
                            onChange={(e) => setNumero(e.target.value)}
                        />
                    </div>
                    <div className="boxCol">
                        <label>Valor</label>
                        <input
                            type="text"
                            id="inputValorEntrada"
                            name="valor"
                            onKeyDown={(e) => keyDown(e, 'inputEntrada')}
                            onChange={(e) => setValor(e.target.value)}
                        />
                    </div>
                    <div className="boxCol">
                        <label>Tipo</label>
                        <input
                            type="text"
                            id="inputEntrada"
                            name="entrada"
                            value="saida"
                            readOnly
                        />
                    </div>
                    <button onClick={(e) => gravarLancamento()}>Gravar</button>
                </div>
                <div className="gridContaTitulo">
                    <div>Data</div>
                    <div>Documento</div>
                    <div className="alignCenter">Nº Documento</div>
                    <div className="alignRight">Valor</div>
                    <div className="alignRight">Tipo</div>
                </div>
                {arrayLancamento.map((lancamento, index) => (
                    <div className="gridContaLancamento" key={index}>
                        <div>{inverteData(lancamento.data_documento)}</div>
                        <div>{lancamento.documeto}</div>
                        <div className="alignCenter">
                            {lancamento.numero_documento}
                        </div>
                        <div className="alignRight">
                            {(lancamento.valor_documento * 1).toLocaleString(
                                'pt-BR',
                                {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </div>
                        <div className="alignRight">{lancamento.tipo}</div>
                    </div>
                ))}
            </form>{' '}
        </>
    );
};
