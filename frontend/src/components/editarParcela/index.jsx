import { useEffect, useRef } from 'react';
import './editarParcela.css';
import { apiFactoring } from '../../services/api';
import { ImExit } from 'react-icons/im';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const EditarParcela = ({
    idParcela,
    parcelaN,
    setEditarParcela,
    setRecarregaParcelas,
    recarregaParcelas,
    setValorAtualizado,
    valorAtualizado,
    atualizarEmprestimo,
}) => {
    const ref = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const gravarParcela = async () => {
        const parcela = ref.current;
        await apiFactoring
            .post(
                '/alterar-valor-parcela',
                {
                    parcela: idParcela,
                    valor: parcela.valor.value,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                toast.success(data);
            })
            .catch();
        setRecarregaParcelas(!recarregaParcelas);
    };

    return (
        <div className="divEditarParcela">
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            <form ref={ref} onSubmit={handleSubmit}>
                <div className="boxRow">
                    <label>Parcela Nº {parcelaN}</label>
                    <div id="divIconeExit">
                        <ImExit
                            className="icone"
                            onClick={(e) => {
                                setEditarParcela(false);
                                setRecarregaParcelas(!recarregaParcelas);
                                setValorAtualizado(!valorAtualizado);
                                atualizarEmprestimo();
                            }}
                        />
                    </div>
                </div>
                <div className="boxCol">
                    <label>Valor</label>
                    <input id="inputValor" type="text" name="valor" />
                </div>
                <div id="divBtnGravar">
                    <button onClick={(e) => gravarParcela()}>Gravar</button>
                </div>
            </form>
        </div>
    );
};
