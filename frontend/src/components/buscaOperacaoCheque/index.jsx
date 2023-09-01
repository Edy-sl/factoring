import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { apiFactoring } from '../../services/api';
import { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { ImExit } from 'react-icons/im';
import './buscaOperacaoCheque.css';
import { retornaDataAtual, keyDown } from '../../biblitoteca';

export const BuscaOperacao = ({ setIdOperacao, setFormBuscaOperacao }) => {
    const ref = useRef();

    const [operacao, setOperacao] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const buscaBordero = async () => {
        const dadosBusca = ref.current;

        await apiFactoring
            .post(
                '/busca-bordero',
                {
                    dataI: dadosBusca.dataI.value,
                    dataF: dadosBusca.dataF.value,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setOperacao(data);
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const handleSel = (id) => {
        setIdOperacao(id);
        setFormBuscaOperacao(false);
    };

    useEffect(() => {
        const dadosBusca = ref.current;
        dadosBusca.dataI.value = retornaDataAtual();
        dadosBusca.dataF.value = retornaDataAtual();
    }, []);

    return (
        <>
            <div className="divBuscaOperacao">
                <form
                    className="formBuscaOperacao"
                    onSubmit={handleSubmit}
                    ref={ref}
                >
                    <input
                        type="date"
                        id="inputDataI"
                        name="dataI"
                        onKeyDown={(e) => keyDown(e, 'inputDataF')}
                    />
                    <input type="date" id="inputDataF" name="dataF" />
                    <FiSearch className="icone" onClick={buscaBordero} />
                    <ImExit
                        className="icone"
                        onClick={() => setFormBuscaOperacao(false)}
                    />
                </form>

                <div className="divResultadoBuscaOperacao">
                    {operacao.map((oper) => (
                        <div
                            className="divOperacao"
                            key={oper.idbordero}
                            onClick={() => handleSel(oper.idbordero)}
                        >
                            <div id="divIdBordero">{oper.idbordero}</div>
                            <div id="divNome">{oper.nome}</div>
                            <div id="divData">{oper.data}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
