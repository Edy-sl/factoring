import { ImExit } from 'react-icons/im';
import { Link } from 'react-router-dom';
import './tituloTela.css';

export const TituloTela = (props) => {
    return (
        <div className="divTituloTela">
            <h1>{props.tituloTela}</h1>
            <Link to="/" id="linkSair">
                <ImExit id="iconeExitTitulo" />
            </Link>
        </div>
    );
};
