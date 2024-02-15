import { useEffect, useRef, useState } from 'react';
import {
    converteMoedaFloat,
    converteFloatMoeda,
    keyDown,
} from '../../biblitoteca';
import { FiSearch } from 'react-icons/fi';
import { BuscaClienteNome } from '../buscaCliente';
import { ImCheckboxChecked, ImExit } from 'react-icons/im';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { apiFactoring } from '../../services/api';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../../context/authContext';
import { BuscaClienteNomeDireto } from '../buscaClienteNome';
import { Link } from 'react-router-dom';
import { TituloTela } from '../titulosTela/tituloTela';

export const TaxaCliente = () => {
    const [idCliente, setIdCliente] = useState(0);
    const [formBusca, setFormBusca] = useState();
    const [checkEspecial, setCheckEspecial] = useState('NAO');
    const [limite, setLimite] = useState();

    const [clienteFiltrado, setClienteFiltrado] = useState([]);
    const [formBuscaDireto, setFormBuscaDireto] = useState(false);
    const [clientes, setClientes] = useState([]);

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
        const limite = converteMoedaFloat(dadosTaxa.limite.value);
        await apiFactoring
            .post(
                '/atualiza-taxa-cliente',
                {
                    idCliente: idCliente,
                    taxaJuros: taxaJuros,
                    especial: especial,
                    limite: limite,
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

        dadosCliente.limite.value = '0';
        dadosCliente.taxaJuros.value = '';

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

                        dadosCliente.limite.value = converteFloatMoeda(
                            dados.limite
                        );
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
    };

    const formataTaxa = () => {
        const dadosTaxa = ref.current;
        dadosTaxa.taxaJuros.value = converteFloatMoeda(
            dadosTaxa.taxaJuros.value
        );
    };

    const formataLimite = () => {
        const dadosLimite = ref.current;
        dadosLimite.limite.value = converteFloatMoeda(dadosLimite.limite.value);
    };

    const FiltraCliente = (busca) => {
        let clienteF = [];
        clienteF = clientes.filter((C) =>
            C.nome.toUpperCase().includes(busca.toUpperCase() || C.nome != ' ')
        );
        setClienteFiltrado(clienteF);

        if (clienteF.length == 0) {
            setFormBuscaDireto(false);
        } else {
            setFormBuscaDireto(true);
        }
    };

    const listaClientes = async () => {
        await apiFactoring
            .post(
                '/lista-clientes',
                {},
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setClientes(data);
            })
            .catch((error) => {});
    };

    useEffect(() => {
        listaClientes();
    }, []);

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
                <TituloTela tituloTela="Taxa e Limite" />
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
                                    id="inputCliente"
                                    name="nome"
                                    placeholder=""
                                    onKeyDown={(e) =>
                                        keyDown(
                                            e,
                                            'inputCep',
                                            'cliente',
                                            'inputCliente0'
                                        )
                                    }
                                    onChange={(e) => {
                                        FiltraCliente(e.target.value);
                                    }}
                                    autoComplete="off"
                                />
                                {formBuscaDireto == true && (
                                    <BuscaClienteNomeDireto
                                        clienteFiltrado={clienteFiltrado}
                                        setIdCliente={setIdCliente}
                                        setFormBuscaDireto={setFormBuscaDireto}
                                        setClienteFiltrado={setClienteFiltrado}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="boxRow">
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
                        <div className="boxCol">
                            <label>Limite</label>
                            <input
                                id="inputLimite"
                                type="text"
                                name="limite"
                                placeholder=""
                                onBlur={formataLimite}
                            />
                        </div>
                    </div>
                    <button onClick={gravarTaxa}>Gravar</button>
                </div>
            </form>
        </>
    );
};
