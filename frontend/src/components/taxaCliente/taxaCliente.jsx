import { useEffect, useRef, useState } from 'react';
import {
    converteMoedaFloat,
    converteFloatMoeda,
    keyDown,
} from '../../biblitoteca';
import { FiSearch } from 'react-icons/fi';
import { BuscaClienteNome } from '../buscaCliente';
import { ImCheckboxChecked } from 'react-icons/im';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { apiFactoring } from '../../services/api';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../../context/authContext';

export const TaxaCliente = () => {
    const [idCliente, setIdCliente] = useState(0);
    const [formBusca, setFormBusca] = useState();
    const [checkEspecial, setCheckEspecial] = useState('NAO');

    const ref = useRef();

    const exibeFormBusca = () => {
        setFormBusca(!formBusca);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const gravarTaxa = async () => {
        const dadosTaxa = ref.current;
        const idCliente = dadosTaxa.idCliente.value;
        const taxaJuros = converteMoedaFloat(dadosTaxa.taxaJuros.value);
        const especial = dadosTaxa.especial.value;
        await apiFactoring
            .post(
                '/atualiza-taxa-cliente',
                {
                    idCliente: idCliente,
                    taxaJuros: taxaJuros,
                    especial: especial,
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
            .catch((error) => {
                toast.error(error.response.data);
            });
    };

    const buscaClienteCodigo = async () => {
        const dadosCliente = ref.current;

        await apiFactoring
            .post(
                '/busca-cliente-id',
                {
                    idCliente: idCliente,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                if (data.length > 0) {
                    data.map((dados) => {
                        dadosCliente.nome.value = dados.nome;

                        dadosCliente.taxaJuros.value = (
                            dados.taxa_juros * 1
                        ).toLocaleString('pt-BR');

                        setCheckEspecial(dados.especial);
                    });
                }
            });
    };

    const toogle = () => {
        if (checkEspecial == 'NAO') {
            setCheckEspecial('SIM');
        }
        if (checkEspecial == 'SIM') {
            setCheckEspecial('NAO');
        }

        console.log(checkEspecial);
    };

    const formataTaxa = () => {
        const dadosTaxa = ref.current;
        dadosTaxa.taxaJuros.value = converteFloatMoeda(
            dadosTaxa.taxaJuros.value
        );
    };

    useEffect(() => {
        buscaClienteCodigo();
    }, [idCliente]);
    return (
        <>
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            {formBusca == true && (
                <AuthProvider>
                    <BuscaClienteNome
                        setFormBusca={setFormBusca}
                        setIdCliente={setIdCliente}
                    />
                </AuthProvider>
            )}
            <form
                className="form"
                name="formTaxa"
                ref={ref}
                onSubmit={handleSubmit}
            >
                <div className="boxRow">
                    <div className="boxRow">
                        <div className="boxCol">
                            <label>Código</label>

                            <input
                                type="text"
                                id="inputIdCliente"
                                name="idCliente"
                                placeholder=""
                                value={idCliente}
                                onKeyDown={(e) => keyDown(e, 'inputNome')}
                                onChange={(e) => setIdCliente(e.target.value)}
                            />
                        </div>

                        <div className="boxCol">
                            <label>Nome</label>
                            <div className="boxRow">
                                <input
                                    type="text"
                                    id="inputNomeCliTaxa"
                                    name="nome"
                                    placeholder=""
                                />
                                <FiSearch size="25" onClick={exibeFormBusca} />
                            </div>
                        </div>
                    </div>
                    <div className="boxRow">
                        <div className="boxCol">
                            <label>Taxa Mensal</label>
                            <input
                                id="inputTaxaCliente"
                                type="text"
                                name="taxaJuros"
                                placeholder=""
                                onBlur={formataTaxa}
                            />
                        </div>

                        <div className="boxCol">
                            <label>Especial</label>
                            <div className="boxRow">
                                {checkEspecial == 'SIM' ? (
                                    <ImCheckboxChecked
                                        size={25}
                                        onClick={toogle}
                                    />
                                ) : (
                                    <ImCheckboxUnchecked
                                        size={25}
                                        onClick={toogle}
                                    />
                                )}
                                <input
                                    type="text"
                                    id="inputEspecial"
                                    name="especial"
                                    value={checkEspecial}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <button onClick={gravarTaxa}>Gravar</button>
                </div>
            </form>
        </>
    );
};
