import { useEffect, useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { apiFactoring } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const GravaPagamento = ({ idlancamento, dataPagamento }) => {
    const [dataPag, setDataPagamento] = useState();

    const gravarDataPagamento = (nCheque) => {
        console.log(dataPag + ' / ' + nCheque);

        apiFactoring
            .post(
                '/gravar-data-pagamento',
                { idlancamento: nCheque, dataPag: dataPag },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                toast.success(data);
            })
            .catch((err) => {
                toast.error(Response.err.data);
            });
    };

    useEffect(() => {
        setDataPagamento(dataPagamento);
    }, []);

    return (
        <>
            {' '}
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            <input
                type="date"
                name="dt"
                id="dataPag"
                value={dataPag}
                onChange={(e) => setDataPagamento(e.target.value)}
            />
            <AiFillCheckCircle
                id="checkPag"
                onClick={(e) => gravarDataPagamento(idlancamento)}
            />
        </>
    );
};
