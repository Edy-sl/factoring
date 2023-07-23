import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { apiFactoring } from '../../services/api';
import { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-Icons/fi';
import { ImExit } from 'react-icons/im';
import './buscaEmprestimo.css';
import { keyDown, retornaDataAtual } from '../../biblitoteca';

export const BuscaEmprestimo = ({
    setIdEmprestimo,
    setFormBuscaEmprestimo,
}) => {
    const ref = useRef();

    const [emprestimo, setEmprestimo] = useState([]);
    const [dataAtualI, setDataAtualI] = useState();
    const [dataAtualF, setDataAtualF] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const buscaEmprestimo = async () => {
        const dadosBusca = ref.current;

        await apiFactoring
            .post(
                '/busca-emprestimo',
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
                setEmprestimo(data);
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const handleSel = (id) => {
        setIdEmprestimo(id);
        setFormBuscaEmprestimo(false);
    };

    useEffect(() => {
        const dadosBusca = ref.current;
        dadosBusca.dataI.value = retornaDataAtual();
        dadosBusca.dataF.value = retornaDataAtual();
    }, []);

    return (
        <>
            <div className="divBuscaEmprestimo">
                <form
                    className="formBuscaEmprestimo"
                    onSubmit={handleSubmit}
                    ref={ref}
                >
                    <input
                        type="date"
                        id="inputDataI"
                        name="dataI"
                        onKeyDown={(e) => keyDown(e, 'inputDataF')}
                    />
                    <input
                        type="date"
                        id="inputDataF"
                        name="dataF"
                        onKeyDown={(e) => keyDown(e, 'iconeLupa')}
                    />
                    <FiSearch id="iconeLupa" onClick={buscaEmprestimo} />
                    <ImExit
                        id="iconeSair"
                        onClick={() => setFormBuscaEmprestimo(false)}
                    />
                </form>

                <div className="divResultadoBuscaEmprestimo">
                    {emprestimo.map((oper) => (
                        <div
                            className="divEmprestimo"
                            key={oper.idemprestimo}
                            onClick={() => handleSel(oper.idemprestimo)}
                        >
                            <div id="divIdEmprestimo">{oper.idemprestimo}</div>
                            <div id="divNome">{oper.nome}</div>
                            <div id="divData">{oper.data_cadastro}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
