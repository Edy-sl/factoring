import './formCliente.css';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { apiCep, apiFactoring } from '../../services/api';
import { useEffect, useRef, useState } from 'react';
import {
    cpfCnpjMask,
    keyDown,
    converteMoedaFloat,
    retornaDataAtual,
    converteFloatMoeda,
} from '../../biblitoteca';
import { BuscaClienteNome } from '../buscaCliente';
import { FiSearch } from 'react-Icons/fi';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { CheckboxPersonalizado } from '../checkbox/checkboxPersonalizado';

import { AuthProvider } from '../../context/authContext';

export const FormCliente = () => {
    const [formBusca, setFormBusca] = useState();

    const [inputCep, setInputCep] = useState();

    const [cpfCnpj, setCpfCnpj] = useState();
    const [vlimpo, setVlimpo] = useState();
    const [onEdit, setOnEdit] = useState();

    const [idCliente, setIdCliente] = useState();

    const [checkEspecial, setCheckEspecial] = useState('NAO');

    const ref = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const buscaCep = async () => {
        const dadosFactoring = ref.current;

        setInputCep(dadosFactoring.cep.value);

        if (inputCep === '') {
            toast.error('Digite um CEP!');
            return;
        }
        try {
            const respostaCep = await apiCep.get(`${inputCep}/json`);

            dadosFactoring.rua.value = respostaCep.data.logradouro;
            dadosFactoring.bairro.value = respostaCep.data.bairro;
            dadosFactoring.cidade.value = respostaCep.data.localidade;
            dadosFactoring.uf.value = respostaCep.data.uf;
        } catch {
            toast.error('Erro ao buscar o CEP!');
        }
    };

    const formataCpfCnpj = () => {
        const dadosCliente = ref.current;
        let vCpfCnpj = dadosCliente.cnpj_cpf.value;

        setCpfCnpj(cpfCnpjMask(vCpfCnpj));
        setVlimpo(cpfCnpj);
    };

    const gravarCliente = () => {
        onEdit == true ? atualizarDadosCliente() : gravarDadosCliente();
    };

    const atualizarDadosCliente = async () => {
        const dadosCliente = ref.current;

        const cnpjCpf = dadosCliente.cnpj_cpf.value;
        const ieRg = dadosCliente.ie_rg.value;
        const nome = dadosCliente.nome.value;
        const cep = dadosCliente.cep.value;
        const rua = dadosCliente.rua.value;
        const numero = dadosCliente.numero.value;
        const bairro = dadosCliente.bairro.value;
        const complemento = dadosCliente.complemento.value;
        const cidade = dadosCliente.cidade.value;
        const uf = dadosCliente.uf.value;
        const telefone = dadosCliente.telefone.value;
        const dataNascimento = dadosCliente.dataNascimento.value;
        const observacao = dadosCliente.observacao.value;
        const taxaJuros = converteMoedaFloat(dadosCliente.taxaJuros.value);
        const especial = dadosCliente.especial.value;

        const idFactoring = localStorage.getItem('factoring');

        if (
            !cnpjCpf ||
            !nome ||
            !rua ||
            !numero ||
            !bairro ||
            !cidade ||
            !uf ||
            !taxaJuros
        ) {
            toast.error('( * ) Campos obrigatórios!');
        } else {
            await apiFactoring
                .post(
                    '/alterar-cliente',
                    {
                        cnpjCpf: cnpjCpf,
                        ieRg: ieRg,
                        nome: nome,
                        cep: cep,
                        rua: rua,
                        numero: numero,
                        bairro: bairro,
                        complemento: complemento,
                        cidade: cidade,
                        uf: uf,
                        telefone: telefone,
                        dataNascimento: dataNascimento,
                        observacao: observacao,
                        taxaJuros: taxaJuros,
                        especial: especial,
                        idFactoring: idFactoring,
                    },
                    {
                        headers: {
                            'x-access-token': localStorage.getItem('user'),
                        },
                    }
                )
                .then(({ data }) => {
                    toast.success('Cliente alterado com sucesso!');
                    setCpfCnpj('');
                    setInputCep('');
                    limpaDadosForm();

                    setOnEdit(false);
                    setCheckEspecial('NAO');
                })
                .catch(({ data }) => toast.error(data));
        }
    };

    const limpaDadosForm = () => {
        if (onEdit == false) {
            setCpfCnpj('');
            setInputCep('');

            setIdCliente(0);
            const dadosCliente = ref.current;
            //  dadosCliente.cnpj_cpf.value = '';
            dadosCliente.ie_rg.value = '';
            dadosCliente.nome.value = '';
            dadosCliente.cep.value = '';
            dadosCliente.rua.value = '';
            dadosCliente.numero.value = '';
            dadosCliente.complemento.value = '';
            dadosCliente.bairro.value = '';
            dadosCliente.cidade.value = '';
            dadosCliente.telefone.value = '';
            dadosCliente.observacao.value = '';
            dadosCliente.taxaJuros.value = '';

            dadosCliente.dataNascimento.value = retornaDataAtual();
        }
    };

    const gravarDadosCliente = async () => {
        const dadosCliente = ref.current;

        const cnpjCpf = dadosCliente.cnpj_cpf.value;
        const ieRg = dadosCliente.ie_rg.value;
        const nome = dadosCliente.nome.value;
        const cep = dadosCliente.cep.value;
        const rua = dadosCliente.rua.value;
        const numero = dadosCliente.numero.value;
        const bairro = dadosCliente.bairro.value;
        const complemento = dadosCliente.complemento.value;
        const cidade = dadosCliente.cidade.value;
        const uf = dadosCliente.uf.value;
        const telefone = dadosCliente.telefone.value;
        const dataNascimento = dadosCliente.dataNascimento.value;
        const observacao = dadosCliente.observacao.value;
        const taxaJuros = converteMoedaFloat(dadosCliente.taxaJuros.value);
        const especial = dadosCliente.especial.value;
        const idFactoring = localStorage.getItem('factoring');

        if (
            !cnpjCpf ||
            !nome ||
            !rua ||
            !numero ||
            !bairro ||
            !cidade ||
            !uf ||
            !taxaJuros
        ) {
            toast.error('( * ) Campos obrigatórios!');
        } else {
            await apiFactoring
                .post(
                    '/cad-cliente',
                    {
                        cnpjCpf: cnpjCpf,
                        ieRg: ieRg,
                        nome: nome,
                        cep: cep,
                        rua: rua,
                        numero: numero,
                        bairro: bairro,
                        complemento: complemento,
                        cidade: cidade,
                        uf: uf,
                        telefone: telefone,
                        dataNascimento: dataNascimento,
                        observacao: observacao,
                        taxaJuros: taxaJuros,
                        especial: especial,
                        idFactoring: idFactoring,
                    },
                    {
                        headers: {
                            'x-access-token': localStorage.getItem('user'),
                        },
                    }
                )
                .then(({ data }) => {
                    if (data.code) {
                        toast.error('Cnpj ou Cpf já cadastrado!');
                    }
                    if (!data.code) {
                        toast.success('Cliente cadastrado com sucesso!');
                    }
                })
                .catch(({ data }) => toast.error(data));
        }
    };

    const buscaCliente = async () => {
        const dadosCliente = ref.current;

        await apiFactoring
            .post(
                '/busca-cliente',
                {
                    cnpjCpf: cpfCnpj,
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
                        dadosCliente.ie_rg.value = dados.ie_rg;
                        dadosCliente.nome.value = dados.nome;
                        setInputCep(dados.cep);
                        dadosCliente.rua.value = dados.rua;
                        dadosCliente.numero.value = dados.numero;
                        dadosCliente.complemento.value = dados.complemento;
                        dadosCliente.bairro.value = dados.bairro;
                        dadosCliente.cidade.value = dados.cidade;
                        dadosCliente.telefone.value = dados.telefone;
                        dadosCliente.dataNascimento.value =
                            dados.data_nascimento;
                        dadosCliente.observacao.value = dados.observacao;
                        dadosCliente.taxaJuros.value = (
                            dados.taxa_juros * 1
                        ).toLocaleString('pt-BR');
                        setIdCliente(dados.idcliente);
                        setCheckEspecial(dados.especial);

                        setOnEdit(true);
                    });
                } else {
                    setOnEdit(false);
                }
            })
            .catch(({ data }) => {
                toast.error(data);
            });

        setVlimpo('');
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
                        setCpfCnpj(dados.cnpj_cpf);

                        dadosCliente.ie_rg.value = dados.ie_rg;
                        dadosCliente.nome.value = dados.nome;
                        setInputCep(dados.cep);
                        dadosCliente.rua.value = dados.rua;
                        dadosCliente.numero.value = dados.numero;
                        dadosCliente.complemento.value = dados.complemento;
                        dadosCliente.bairro.value = dados.bairro;
                        dadosCliente.cidade.value = dados.cidade;
                        dadosCliente.telefone.value = dados.telefone;
                        dadosCliente.dataNascimento.value =
                            dados.data_nascimento;
                        dadosCliente.observacao.value = dados.observacao;
                        dadosCliente.taxaJuros.value = dados.taxa_juros;

                        setCheckEspecial(dados.especial);

                        setOnEdit(true);
                    });
                } else {
                    setOnEdit(false);
                }
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const exibeFormBusca = () => {
        setFormBusca(!formBusca);
    };

    const formataTaxa = () => {
        const dadosTaxa = ref.current;
        dadosTaxa.taxaJuros.value = converteFloatMoeda(
            dadosTaxa.taxaJuros.value
        );
    };

    const toogle = () => {
        if (!onEdit) {
            if (checkEspecial == 'NAO') {
                setCheckEspecial('SIM');
            }
            if (checkEspecial == 'SIM') {
                setCheckEspecial('NAO');
            }
        }
    };

    useEffect(() => {
        buscaCliente();
    }, [vlimpo]);

    useEffect(() => {
        limpaDadosForm();
    }, [onEdit]);

    useEffect(() => {
        buscaCliente();
    }, [cpfCnpj]);

    useEffect(() => {
        buscaClienteCodigo();
    }, [idCliente]);

    return (
        <>
            {formBusca == true && (
                <AuthProvider>
                    <BuscaClienteNome
                        setFormBusca={setFormBusca}
                        setIdCliente={setIdCliente}
                    />
                </AuthProvider>
            )}

            <form className="formCliente" onSubmit={handleSubmit} ref={ref}>
                <ToastContainer
                    autoClose={3000}
                    position={toast.POSITION.BOTTOM_LEFT}
                />
                <h1>Cliente</h1>
                <div className="boxRow">
                    <div className="boxCol">
                        <label>CNPJ/CPF</label>
                        <input
                            id="inputCnpjCpf"
                            name="cnpj_cpf"
                            type="text"
                            value={cpfCnpj}
                            placeholder=""
                            onChange={(e) => {
                                setCpfCnpj(e.target.value);
                            }}
                            onBlur={formataCpfCnpj}
                            onKeyDown={(e) => keyDown(e, 'inputIeRg')}
                        />
                    </div>
                    <div className="boxCol">
                        <label>IE/RG</label>
                        <input
                            id="inputIeRg"
                            type="text"
                            name="ie_rg"
                            placeholder=""
                            onKeyDown={(e) => keyDown(e, 'inputDataNascimento')}
                        />
                    </div>
                    <div className="boxCol">
                        <label>Data Nascimento</label>
                        <input
                            id="inputDataNascimento"
                            type="date"
                            name="dataNascimento"
                            placeholder=""
                            onKeyDown={(e) => keyDown(e, 'inputNome')}
                        />
                    </div>
                </div>

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
                                id="inputNome"
                                name="nome"
                                placeholder=""
                                onKeyDown={(e) => keyDown(e, 'inputCep')}
                            />
                            <FiSearch size="25" onClick={exibeFormBusca} />
                        </div>
                    </div>
                </div>

                <div className="boxRow">
                    <div className="boxCol">
                        <label>Cep</label>
                        <input
                            id="inputCep"
                            type="text"
                            name="cep"
                            value={inputCep}
                            onChange={(e) => {
                                setInputCep(e.target.value);
                            }}
                            placeholder=""
                            onBlur={buscaCep}
                            onKeyDown={(e) => keyDown(e, 'inputRua')}
                        />
                    </div>
                    <div className="boxCol">
                        <label>Rua</label>
                        <input
                            id="inputRua"
                            name="rua"
                            type="text"
                            placeholder=""
                            onKeyDown={(e) => keyDown(e, 'inputNumero')}
                        />
                    </div>
                    <div className="boxCol">
                        {' '}
                        <label>Número</label>
                        <input
                            id="inputNumero"
                            type="text"
                            name="numero"
                            placeholder=""
                            onKeyDown={(e) => keyDown(e, 'inputComplemento')}
                        />
                    </div>
                </div>
                <div className="boxRow">
                    <div className="boxCol">
                        <label>Complemento</label>
                        <input
                            id="inputComplemento"
                            type="text"
                            name="complemento"
                            placeholder=""
                            onKeyDown={(e) => keyDown(e, 'inputBairro')}
                        />
                    </div>
                    <div className="boxCol">
                        <label>Bairro</label>
                        <input
                            id="inputBairro"
                            type="text"
                            name="bairro"
                            placeholder="Bairro"
                            onKeyDown={(e) => keyDown(e, 'inputCidade')}
                        />
                    </div>
                </div>

                <div className="boxRow">
                    <div className="boxCol">
                        <label>Cidade</label>
                        <input
                            id="inputCidade"
                            type="text"
                            name="cidade"
                            placeholder=""
                            onKeyDown={(e) => keyDown(e, 'selectUf')}
                        />
                    </div>
                    <div className="boxCol">
                        <label>UF</label>
                        <select
                            id="selectUf"
                            name="uf"
                            onKeyDown={(e) => keyDown(e, 'inputTelefone')}
                        >
                            <option value="SP">SP</option>
                            <option value="">Valor 2</option>
                            <option value="">Valor 3</option>
                        </select>
                    </div>
                </div>
                <div className="boxRow">
                    <div className="boxCol">
                        <label>Telefone</label>
                        <input
                            id="inputTelefone"
                            type="text"
                            name="telefone"
                            placeholder="(000)0000-0000"
                            onKeyDown={(e) => keyDown(e, 'inputTaxaCliente')}
                        />
                    </div>
                    <div className="boxCol">
                        <label>Taxa Mensal</label>
                        {onEdit && (
                            <input
                                id="inputTaxaCliente"
                                type="text"
                                name="taxaJuros"
                                placeholder=""
                                readOnly
                            />
                        )}
                        {!onEdit && (
                            <input
                                id="inputTaxaCliente"
                                type="text"
                                name="taxaJuros"
                                placeholder=""
                                onKeyDown={(e) => keyDown(e, 'textObservacao')}
                                onBlur={formataTaxa}
                            />
                        )}
                    </div>
                    <div className="boxCol">
                        <label>Especial</label>
                        <div className="boxRow">
                            {checkEspecial == 'SIM' ? (
                                <ImCheckboxChecked size={25} onClick={toogle} />
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
                <textarea
                    id="textObservacao"
                    type="text"
                    name="observacao"
                    placeholder="Observação"
                />
                <button type="submite" onClick={gravarCliente}>
                    {onEdit == true ? 'Alterar' : 'Gravar'}
                </button>
            </form>
        </>
    );
};
