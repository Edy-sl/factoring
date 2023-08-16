import { useEffect, useState } from 'react';
import { apiFactoring } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';

export const CheckboxPersonalizado = (props) => {
    const [checado, setChecado] = useState(props.chek);
    const permissao = props.permissao;
    const usuario = props.usuario;

    const toogle = () => {
        setChecado(!checado);
        atualizaPermissao();
    };

    const atualizaPermissao = async () => {
        await apiFactoring
            .post(
                '/atualiza-permissao',
                { idUsuario: usuario, permissao: permissao, checado: checado },
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
                toast.error(err.response.error);
            });
    };

    return (
        <>
            {' '}
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            <input
                type="checkbox"
                checked={checado}
                onClick={toogle}
                onChange={(e) => {}}
                name={props.usuario}
                permissao={props.permissao}
            />
        </>
    );
};
