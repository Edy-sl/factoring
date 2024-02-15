import { FiSearch, FiCheck } from 'react-icons/fi';
import './devolucao.css';
import { useState, useRef } from 'react';
import { apiFactoring } from '../../services/api';
import { GravaDevolucao } from '../gravaDevolucao/inde';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TituloTela } from '../titulosTela/tituloTela';

export const Devolucao = () => {
    const ref = useRef();
    const [cheques, setCheques] = useState([]);

    const buscaCheque = async () => {
        const dadosCheques = ref.current;

        await apiFactoring
            .post(
                '/busca-cheque-numero',
                { numero: dadosCheques.cheque.value },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setCheques(data);
                console.log(data);
            })
            .catch();
    };

    const handleNumeroCheuque = (e) => {
        const dadosCheque = ref.current;
        dadosCheque.cheque.value = formataCheque(e);
        console.log(e);
    };

    const formataCheque = (value) => {
        if (!value) return '';
        value = value.replace(/\D/g, '');
        value = value
            .replace(/(\d{6})(\d)/, '$1-$2')
            .replace(/(-\d{1})\d+?$/, '$1');
        return value;
    };

    return (
        <>
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            <div>
                <form className="form" ref={ref}>
                    <TituloTela tituloTela="Devolução" />
                    <div>
                        <label>Nº do Cheque</label>
                        <input
                            type="text"
                            name="cheque"
                            onKeyUp={(e) => handleNumeroCheuque(e.target.value)}
                        />
                        <FiSearch className="icone2" onClick={buscaCheque} />
                    </div>
                </form>
            </div>
            <div className="gridTituloChequeDevolucao">
                <div>Banco</div>
                <div>Cheque</div>
                <div>Valor</div>
                <div>Emitente</div>
                <div>Cliente</div>
                <div>Operação</div>
                <div className="alignCenter">Devolução</div>
            </div>{' '}
            <div id="divGeralDevolucao">
                {cheques.map((cheq, index) => (
                    <div className="gridChequeDevolucao" key={index}>
                        <div>{cheq.nome_banco}</div>
                        <div>{cheq.numero_cheque}</div>
                        <div>{cheq.valor_cheque}</div>
                        <div>{cheq.nome_cheque}</div>
                        <div>{cheq.nome}</div>
                        <div className="alignCenter">{cheq.idbordero}</div>
                        <div className="alignCenter">
                            <GravaDevolucao
                                key={cheq.index}
                                idlancamento={cheq.idlancamento}
                                dataDevolucao={cheq.data_devolucao}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
