import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { apiFactoring } from '../../services/api';
import { toast } from 'react-toastify';
import { CheckboxPersonalizado } from '../checkbox/checkboxPersonalizado';

export const Permissoes = () => {
    const [vpermissoes, setVpermissoes] = useState([]);

    const ref = useRef();

    const buscaPermissoes = async () => {
        const dados = await apiFactoring
            .get('/permissoes', {
                headers: {
                    'x-access-token': localStorage.getItem('user'),
                },
            })
            .then(({ data }) => {
                setVpermissoes(data);
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    const checarPermissao = () => {
        const vlPermissao = ref.current;
        console.log(vlPermissao);
    };

    useEffect(() => {
        buscaPermissoes();
    }, []);

    return (
        <div>
            {vpermissoes.map((item) => (
                <div key={item.idusuario}>
                    {item.nome} - ADMIN
                    {item.grupo == 'admin' && (
                        <CheckboxPersonalizado chek={true} />
                    )}
                    {item.grupo != 'admin' && (
                        <CheckboxPersonalizado chek={false} />
                    )}
                    {'   '}OPERACIONAL
                    {item.grupo == 'operacional' && (
                        <CheckboxPersonalizado chek={true} />
                    )}
                    {item.grupo != 'operacional' && (
                        <CheckboxPersonalizado chek={false} />
                    )}
                </div>
            ))}
        </div>
    );
};
