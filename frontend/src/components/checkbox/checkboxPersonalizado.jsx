import { useEffect, useState } from 'react';

export const CheckboxPersonalizado = (props) => {
    const [checado, setChecado] = useState(props.chek);

    const toogle = () => {
        setChecado(!checado);
        console.log(checado);
    };

    return (
        <>
            <input
                type="checkbox"
                checked={checado}
                onClick={toogle}
                onChange={(e) => {}}
                readOnly
            />
        </>
    );
};
