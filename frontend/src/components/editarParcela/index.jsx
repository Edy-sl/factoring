import { useEffect, useRef } from 'react';
import './editarParcela.css';
import { apiFactoring } from '../../services/api';
import { ImExit } from 'react-icons/im';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { converteMoedaFloat } from '../../biblitoteca';
export const EditarParcela = ({
    idParcela,
    parcelaN,
    setParcelaN,
    setEditarParcela,
    setRecarregaParcelas,
    recarregaParcelas,
    setValorAtualizado,
    valorAtualizado,
    atualizarEmprestimo,
    valorP,
    setValorP,
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
                    valor: converteMoedaFloat(parcela.valor.value),
                    numeroParcela: parcela.parcela.value,
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
                position={toast.POSITION.BOTTOM_CENTER}
            />
            <form ref={ref} onSubmit={handleSubmit}>
                <div className="boxRow">
                    <label>Editar Parcela</label>
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
                    <label>Nº da Parcela</label>
                    <input
                        id="inputValor"
                        value={parcelaN}
                        type="text"
                        name="parcela"
                        onChange={(e) => setParcelaN(e.target.value)}
                    />
                    <label>Valor</label>
                    <input
                        id="inputValor"
                        type="text"
                        name="valor"
                        value={valorP}
                        onChange={(e) => setValorP(e.target.value)}
                    />
                </div>
                <div id="divBtnGravar">
                    <button onClick={(e) => gravarParcela()}>Gravar</button>
                </div>
            </form>
        </div>
    );
};
