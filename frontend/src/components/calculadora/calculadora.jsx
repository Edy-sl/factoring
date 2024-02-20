import { useState } from 'react';
import './calculadora.css';
export const Calculadora = () => {
    const [valorDigitado, setValorDigitado] = useState('');
    const [soma, setSoma] = useState('');

    const execSoma = () => {
        setSoma(eval(valorDigitado));
    };

    return (
        <div id="divCalculadora">
            <input type="text" id="inputVisorResultado" value={soma} />
            <input type="text" id="inputVisor" value={valorDigitado} />
            <div id="divTeclas">
                <div>
                    <button>%</button>
                </div>
                <div>
                    <button>CE</button>
                </div>
                <div>
                    <button>C</button>
                </div>
                <div>
                    <button>DEL</button>
                </div>
            </div>
            <div id="divTeclas">
                <div>1</div>
                <div>
                    <button onClick={(e) => setSoma(Math.sqrt(valorDigitado))}>
                        x2
                    </button>
                </div>
                <div>3</div>
                <div>4</div>
            </div>
            <div id="divTeclas">
                <div>
                    <button
                        onClick={(e) => setValorDigitado(valorDigitado + '7')}
                    >
                        7
                    </button>
                </div>
                <div>
                    <button>8</button>
                </div>
                <div>
                    <button>9</button>
                </div>
                <div>
                    <button>X</button>
                </div>
            </div>
            <div id="divTeclas">
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>-</div>
            </div>
            <div id="divTeclas">
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>
                    <button
                        onClick={(e) => setValorDigitado(valorDigitado + '+')}
                    >
                        +
                    </button>
                </div>
            </div>
            <div id="divTeclas">
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>
                    <button onClick={(e) => execSoma()}>=</button>
                </div>
            </div>
        </div>
    );
};
