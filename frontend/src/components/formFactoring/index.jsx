import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './formFactoring.css';
import { Icons, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/authContext';
import { apiCep, apiFactoring } from '../../services/api';
import { cpfCnpjMask, keyDown, converteMoedaFloat } from '../../biblitoteca';

export const FormFactoring = () => {
    const { setFactoring } = useContext(AuthContext);

    const [inputCep, setInputCep] = useState('');

    const ref = useRef();

    const [cnpj, setCnpj] = useState();

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

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const gravarFactoring = () => {
        localStorage.getItem('factoring') != 'null'
            ? atualizarDadosFactoring()
            : gravarDadosFactoring();
    };

    const gravarDadosFactoring = async () => {
        const dadosFactoring = ref.current;
        let cnpj = dadosFactoring.cnpj.value;
        let ie = dadosFactoring.ie.value;
        let razao = dadosFactoring.razao.value;
        let cep = dadosFactoring.cep.value;
        let rua = dadosFactoring.rua.value;
        let numero = dadosFactoring.numero.value;
        let bairro = dadosFactoring.bairro.value;
        let complemento = dadosFactoring.complemento.value;
        let cidade = dadosFactoring.cidade.value;
        let uf = dadosFactoring.uf.value;
        let telefone = dadosFactoring.telefone.value;
        let taxaMinima = converteMoedaFloat(dadosFactoring.taxaMinima.value);

        if (
            !cnpj ||
            !ie ||
            !razao ||
            !cep ||
            !rua ||
            !numero ||
            !bairro ||
            !cidade ||
            !uf
        ) {
            toast.error('( * ) Campos obrigatórios!');
        } else {
            await apiFactoring
                .post(
                    '/cad-factoring',
                    {
                        cnpj: cnpj,
                        ie: ie,
                        razao: razao,
                        cep: cep,
                        rua: rua,
                        numero: numero,
                        bairro: bairro,
                        complemento: complemento,
                        cidade: cidade,
                        uf: uf,
                        telefone: telefone,
                        taxaMinima: taxaMinima,
                    },
                    {
                        headers: {
                            'x-access-token': localStorage.getItem('user'),
                        },
                    }
                )
                .then(({ data }) => {
                    localStorage.setItem('factoring', data.idRetorno);
                    setFactoring(data.idRetorno);
                    toast.success(data.mensagem);
                })
                .catch(({ data }) => toast.error('Não foi possível gravar!'));
        }
    };

    const atualizarDadosFactoring = async () => {
        const dadosFactoring = ref.current;
        let cnpj = dadosFactoring.cnpj.value;
        let ie = dadosFactoring.ie.value;
        let razao = dadosFactoring.razao.value;
        let cep = dadosFactoring.cep.value;
        let rua = dadosFactoring.rua.value;
        let numero = dadosFactoring.numero.value;
        let bairro = dadosFactoring.bairro.value;
        let complemento = dadosFactoring.complemento.value;
        let cidade = dadosFactoring.cidade.value;
        let uf = dadosFactoring.uf.value;
        let telefone = dadosFactoring.telefone.value;
        let taxaMinima = converteMoedaFloat(dadosFactoring.taxaMinima.value);
        let id = localStorage.getItem('factoring');

        if (
            !cnpj ||
            !ie ||
            !razao ||
            !cep ||
            !rua ||
            !numero ||
            !bairro ||
            !cidade ||
            !uf
        ) {
            toast.error('( * ) Campos obrigatórios!');
        } else {
            await apiFactoring
                .put(
                    '/atualizar-factoring',
                    {
                        cnpj: cnpj,
                        ie: ie,
                        razao: razao,
                        cep: cep,
                        rua: rua,
                        numero: numero,
                        bairro: bairro,
                        complemento: complemento,
                        cidade: cidade,
                        uf: uf,
                        telefone: telefone,
                        taxaMinima: taxaMinima,
                        id: id,
                    },
                    {
                        headers: {
                            'x-access-token': localStorage.getItem('user'),
                        },
                    }
                )
                .then(({ data }) => {
                    data != 'bloqueado'
                        ? toast.success(data)
                        : toast.error('Usuário não autorizado!');
                })
                .catch(({ data }) => toast.error(data));
        }
    };

    const DadosFactoring = async () => {
        const dados = await apiFactoring
            .post(
                '/seleciona-factoring',
                {
                    idFactoring: localStorage.getItem('factoring'),
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                data.map((dados) => {
                    localStorage.setItem('factoring', dados.idfactoring);

                    setInputCep(dados.cep);

                    const dadosFactoring = ref.current;
                    dadosFactoring.cnpj.value = dados.cnpj;
                    dadosFactoring.ie.value = dados.ie;
                    dadosFactoring.razao.value = dados.razao;
                    dadosFactoring.cep.value = dados.cep;
                    dadosFactoring.rua.value = dados.rua;
                    dadosFactoring.numero.value = dados.numero;
                    dadosFactoring.bairro.value = dados.bairro;
                    dadosFactoring.complemento.value = dados.complemento;
                    dadosFactoring.cidade.value = dados.cidade;
                    dadosFactoring.uf.value = dados.uf;
                    dadosFactoring.telefone.value = dados.telefone;
                    dadosFactoring.taxaMinima.value = dados.taxa_minima;
                });
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    useEffect(() => {
        DadosFactoring();
    }, []);

    const buscaCep = async () => {
        const dadosFactoring = ref.current;

        setInputCep(dadosFactoring.cep.value);

        if (inputCep === '') {
            toast.error('Digite um CEP!');
            return;
        }
        try {
            const respostaCep = await apiCep.get(`${inputCep}/json`);
            console.log(respostaCep);

            dadosFactoring.rua.value = respostaCep.data.logradouro;
            dadosFactoring.bairro.value = respostaCep.data.bairro;
            dadosFactoring.cidade.value = respostaCep.data.localidade;
            dadosFactoring.uf.value = respostaCep.data.uf;
        } catch {
            toast.error('Erro ao buscar o CEP!');
        }
    };

    const formataCnpj = () => {
        const dadosFactoring = ref.current;

        setCnpj(cpfCnpjMask(dadosFactoring.cnpj.value));
    };

    return (
        <>
            <form className="formFactoring" onSubmit={handleSubmit} ref={ref}>
                <ToastContainer
                    autoClose={3000}
                    position={toast.POSITION.BOTTOM_LEFT}
                />
                <h1>Factoring</h1>
                <div className="boxRow">
                    <div className="boxCol">
                        <label>CNPJ</label>
                        <input
                            id="inputCnpj"
                            name="cnpj"
                            type="text"
                            placeholder=""
                            value={cnpj}
                            onChange={(e) => {
                                setCnpj(e.target.value);
                            }}
                            onBlur={formataCnpj}
                            onKeyDown={(e) => keyDown(e, 'inputIe')}
                        />
                    </div>
                    <div className="boxCol">
                        <label>IE</label>
                        <input
                            id="inputIe"
                            name="ie"
                            type="text"
                            placeholder=""
                            onKeyDown={(e) => keyDown(e, 'inputRazao')}
                        />
                    </div>
                </div>
                <label>Razão</label>
                <input
                    type="text"
                    id="inputRazao"
                    name="razao"
                    placeholder=""
                    onKeyDown={(e) => keyDown(e, 'inputCep')}
                />
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
                            type="text"
                            name="rua"
                            placeholder=""
                            onKeyDown={(e) => keyDown(e, 'inputNumero')}
                        />
                    </div>
                    <div className="boxCol">
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
                            {siglas.map((uf) => (
                                <option key={uf.uf} value={uf.uf}>
                                    {uf.uf}
                                </option>
                            ))}
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
                            onKeyDown={(e) => keyDown(e, 'inputTaxaMinima')}
                        />
                    </div>
                    <div className="boxCol">
                        <label>Taxa Mínima</label>
                        <input
                            id="inputTaxaMinima"
                            type="text"
                            name="taxaMinima"
                            placeholder="0.00"
                            onKeyDown={(e) => keyDown(e, 'inputCnpj')}
                        />
                    </div>
                </div>
                <button type="submite" onClick={gravarFactoring}>
                    Salvar
                </button>
            </form>
        </>
    );
};
