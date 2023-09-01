import { useEffect, useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { apiFactoring } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const GravaDevolucao = ({ idlancamento, dataDevolucao }) => {
    const [dataDev, setDataDev] = useState();

    const gravarDataDevolucao = (nCheque) => {
        console.log(dataDev + ' / ' + nCheque);

        apiFactoring
            .post(
                '/gravar-data-devolucao',
                { idlancamento: nCheque, dataDev: dataDev },
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
        setDataDev(dataDevolucao);
    }, []);

    return (
        <>
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            <input
                type="date"
                name="dt"
                id="dataDev"
                value={dataDev}
                onChange={(e) => setDataDev(e.target.value)}
            />
            <AiFillCheckCircle
                id="checkDev"
                onClick={(e) => gravarDataDevolucao(idlancamento)}
            />
        </>
    );
};
