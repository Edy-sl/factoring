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
import { FiSearch } from 'react-icons/fi';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { CheckboxPersonalizado } from '../checkbox/checkboxPersonalizado';

import { AuthProvider } from '../../context/authContext';

export const FormCliente = () => {
    const [formBusca, setFormBusca] = useState();

    const [inputCep, setInputCep] = useState();

    const [vlimpo, setVlimpo] = useState();
    const [onEdit, setOnEdit] = useState();

    const [idCliente, setIdCliente] = useState();

    const [checkEspecial, setCheckEspecial] = useState('NAO');

    const [vTaxaJuros, setTaxaJuros] = useState();

    const [limite, setLimite] = useState();

    const ref = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    let siglas = [
        { uf: 'AC', nome: 'Acre' },
        { uf: 'AL', nome: 'Alagoas' },
        { uf: 'AP', nome: 'Amapá' },
        { uf: 'AM', nome: 'Amazonas' },
        { uf: 'BA', nome: 'Bahia' },
        { uf: 'CE', nome: 'Ceará' },
        { uf: 'DF', nome: 'Distrito Federal' },
        { uf: 'ES', nome: 'Espirito Santo' },
        { uf: 'GO', nome: 'Goiás' },
        { uf: 'MA', nome: 'Maranhão' },
        { uf: 'MS', nome: 'Mato Grosso do Sul' },
        { uf: 'MT', nome: 'Mato Grosso' },
        { uf: 'MG', nome: 'Minas Gerais' },
        { uf: 'PA', nome: 'Pará' },
        { uf: 'PB', nome: 'Paraíba' },
        { uf: 'PR', nome: 'Paraná' },
        { uf: 'PE', nome: 'Pernambuco' },
        { uf: 'PI', nome: 'Piauí' },
        { uf: 'RJ', nome: 'Rio de Janeiro' },
        { uf: 'RN', nome: 'Rio Grande do Norte' },
        { uf: 'RS', nome: 'Rio Grande do Sul' },
        { uf: 'RO', nome: 'Rondônia' },
        { uf: 'RR', nome: 'Roraima' },
        { uf: 'SC', nome: 'Santa Catarina' },
        { uf: 'SP', nome: 'São Paulo' },
        { uf: 'SE', nome: 'Sergipe' },
        { uf: 'TO', nome: 'Tocantins' },
    ];

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

            console.log(respostaCep.data.uf);
        } catch {
            toast.error('Erro ao buscar o CEP!');
        }
    };

    const formataCpfCnpj = () => {
        const dadosCliente = ref.current;
        let vCpfCnpj = dadosCliente.cnpj_cpf.value;

        if (cpfCnpjMask(vCpfCnpj) != undefined) {
            dadosCliente.cnpj_cpf.value = cpfCnpjMask(vCpfCnpj);
        }

        // setVlimpo(cpfCnpj);

        buscaCliente();
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
        const limite = converteMoedaFloat(dadosCliente.limite.value);
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
                        limite: limite,
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
                    cnpjCpf: dadosCliente.cnpj_cpf.value,
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
                        dadosCliente.uf.value = dados.uf;
                        dadosCliente.telefone.value = dados.telefone;
                        dadosCliente.dataNascimento.value =
                            dados.data_nascimento;
                        dadosCliente.observacao.value = dados.observacao;

                        setTaxaJuros(
                            (dados.taxa_juros * 1).toLocaleString('pt-BR')
                        );
                        console.log(vTaxaJuros);
                        setIdCliente(dados.idcliente);
                        setCheckEspecial(dados.especial);
                        setLimite(converteFloatMoeda(dados.limite));

                        setOnEdit(true);
                    });
                } else {
                    setOnEdit(false);
                }
            })
            .catch(({ data }) => {
                toast.error(data);
            });

        //  setVlimpo('');
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
                        dadosCliente.cnpj_cpf.value = dados.cnpj_cpf;

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

                        setTaxaJuros(
                            (dados.taxa_juros * 1).toLocaleString('pt-BR')
                        );
                        console.log(vTaxaJuros);

                        setCheckEspecial(dados.especial);
                        setLimite(converteFloatMoeda(dados.limite));

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

    const formataLimite = () => {
        const dadosLimite = ref.current;
        dadosLimite.limite.value = converteFloatMoeda(dadosLimite.limite.value);
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

    /* useEffect(() => {
        buscaCliente();
    }, [cpfCnpj]);*/

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
                            //  value={cpfCnpj}
                            placeholder=""
                            /*  onChange={(e) => {
                                setCpfCnpj(e.target.value);
                            }}*/
                            onBlur={formataCpfCnpj}
                            onKeyDown={(e) => keyDown(e, 'inputIeRg')}
                            autoComplete="off"
                            onFocus={(e) => e.target.select()}
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
                            autoComplete="off"
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
                            autoComplete="off"
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
                            value={idCliente || ''}
                            onKeyDown={(e) => keyDown(e, 'inputNome')}
                            onChange={(e) => setIdCliente(e.target.value)}
                            autoComplete="off"
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
                                autoComplete="off"
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
                            value={inputCep || ''}
                            onChange={(e) => {
                                setInputCep(e.target.value);
                            }}
                            placeholder=""
                            onBlur={buscaCep}
                            onKeyDown={(e) => keyDown(e, 'inputRua')}
                            autoComplete="off"
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
                            autoComplete="off"
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
                            autoComplete="off"
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
                            autoComplete="off"
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
                            autoComplete="off"
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
                            autoComplete="off"
                        />
                    </div>
                    <div className="boxCol">
                        <label>UF</label>
                        <select
                            id="selectUf"
                            name="uf"
                            onKeyDown={(e) => keyDown(e, 'inputTelefone')}
                            autoComplete="off"
                        >
                            {siglas.map((uf) => (
                                <option key={uf.uf} value={uf.uf}>
                                    {uf.uf}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="boxCol">
                        <label>Telefone</label>
                        <input
                            id="inputTelefone"
                            type="text"
                            name="telefone"
                            placeholder="(000)0000-0000"
                            onKeyDown={(e) => keyDown(e, 'inputTaxaCliente')}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div className="boxRow">
                    <div className="boxCol">
                        <label>Taxa Mensal</label>
                        {onEdit && (
                            <input
                                id="inputTaxaCliente"
                                type="text"
                                name="taxaJuros"
                                placeholder=""
                                autoComplete="off"
                                readOnly
                                value={vTaxaJuros}
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

                    <div className="boxCol">
                        <label>Limite</label>
                        {onEdit && (
                            <input
                                id="inputLimite"
                                type="text"
                                name="limite"
                                placeholder=""
                                autoComplete="off"
                                readOnly
                                value={limite}
                            />
                        )}
                        {!onEdit && (
                            <input
                                id="inputLimite"
                                type="text"
                                name="limite"
                                placeholder=""
                                onKeyDown={(e) => keyDown(e, 'textObservacao')}
                                onBlur={formataLimite}
                            />
                        )}
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
