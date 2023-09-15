import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { apiFactoring } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import { ImBin } from 'react-icons/im';
import { CheckboxPersonalizado } from '../checkbox/checkboxPersonalizado';

import './permissoes.css';

export const Permissoes = () => {
    const [arrayGrupos, setArrayGrupos] = useState([]);
    const [arrayUsuarios, setArrayUsuarios] = useState([]);
    const [arrayListPermissoes, setArrayListaPermissoes] = useState([]);

    let arrayPermissoes = [];

    const [varIdUsuario, setVarIdUsuario] = useState();
    const [varIdGrupo, setVarIdGrupo] = useState();

    const ref = useRef();

    //permissoes carregadas na grid
    const buscaPermissoes = async () => {
        setArrayListaPermissoes([]);
        arrayPermissoes = [];
        await apiFactoring
            .post(
                '/permissoes',
                {},
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                arrayPermissoes = [];
                data.map((p) => {
                    arrayPermissoes = [...arrayPermissoes, p];
                });
            })
            .catch(({ err }) => {
                toast.error(err.response.error);
            });
        setArrayListaPermissoes(arrayPermissoes);
    };

    //usuarios carregados no select
    const listaUsuarios = async () => {
        await apiFactoring
            .post(
                '/lista-usuarios',
                {},
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setArrayUsuarios(data);
            })
            .catch(({ err }) => {
                toast.error(err.response.data);
            });
    };

    //grupos carregados no select
    const listaGrupoPermissao = async () => {
        await apiFactoring
            .post(
                '/lista-grupos-permissao',
                {},
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                setArrayGrupos(data);
            })
            .catch(({ err }) => {
                toast.error(err.response.data);
            });
    };

    const excluirPermissao = async (idPermissao) => {
        await apiFactoring
            .post(
                '/excluir-permissao',
                { idPermissao: idPermissao },
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
                toast.error(err.response.data);
            });

        buscaPermissoes();
    };

    const aplicarPermissao = async () => {
        await apiFactoring
            .post(
                '/aplicar-permissao',
                { idGrupo: varIdGrupo, idUsuario: varIdUsuario },
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
                toast.error(err.response.data);
            });
        buscaPermissoes();
    };

    useEffect(() => {
        listaGrupoPermissao();
        listaUsuarios();
        buscaPermissoes();
    }, []);

    return (
        <>
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            ></ToastContainer>
            <div className="divPermissoes">
                <select onChange={(e) => setVarIdUsuario(e.target.value)}>
                    <option>USUÁRIO</option>
                    {arrayUsuarios.map((usu, index) => (
                        <option key={index} value={usu.idusuario}>
                            {usu.nome}
                        </option>
                    ))}
                </select>

                <select onChange={(e) => setVarIdGrupo(e.target.value)}>
                    <option>GRUPO</option>
                    {arrayGrupos.map((grupo, index) => (
                        <option key={index} value={grupo.idgrupo}>
                            {grupo.grupo}
                        </option>
                    ))}
                </select>
                <button onClick={aplicarPermissao}>Aplicar</button>
            </div>
            <div id="divGeralPermissao">
                {arrayListPermissoes.map((permissoes, index) => (
                    <div className="gridPermissoes" key={index}>
                        <div>{permissoes.nome}</div>
                        <div>{permissoes.grupo}</div>
                        <div className="alignRight">
                            <ImBin
                                className="icone2"
                                onClick={(e) =>
                                    excluirPermissao(permissoes.idpermissoes)
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
