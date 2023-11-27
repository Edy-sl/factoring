import React, { useState } from 'react';
import './calculadora.css';
export const Calculadora = () => {
    const [displayValue, setDisplayValue] = useState('0');
    const [firstValue, setFirstValue] = useState(null);
    const [operator, setOperator] = useState(null);
    const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);

    const handleNumberClick = (num) => {
        if (waitingForSecondValue) {
            setDisplayValue(String(num));
            setWaitingForSecondValue(false);
        } else {
            setDisplayValue(
                displayValue === '0' ? String(num) : displayValue + num
            );
        }
    };

    const handleOperatorClick = (nextOperator) => {
        const inputValue = parseFloat(displayValue);

        if (firstValue === null) {
            setFirstValue(inputValue);
        } else if (operator) {
            const result = calculate(firstValue, inputValue, operator);
            setDisplayValue(String(result));
            setFirstValue(result);
        }

        setWaitingForSecondValue(true);
        setOperator(nextOperator);
    };

    const calculate = (firstValue, secondValue, operator) => {
        if (operator === '+') {
            return firstValue + secondValue;
        } else if (operator === '-') {
            return firstValue - secondValue;
        } else if (operator === '×') {
            return firstValue * secondValue;
        } else if (operator === '÷') {
            return firstValue / secondValue;
        }
        return secondValue;
    };

    const handleEquals = () => {
        const inputValue = parseFloat(displayValue);

        if (firstValue !== null) {
            const result = calculate(firstValue, inputValue, operator);
            setDisplayValue(String(result));
            setFirstValue(result);
            setOperator(null);
            setWaitingForSecondValue(true);
        }
    };

    const handleClear = () => {
        setDisplayValue('0');
        setFirstValue(null);
        setOperator(null);
        setWaitingForSecondValue(false);
    };

    return (
        <div id="divCalculadora">
            <div className="display">{displayValue}</div>
            <div className="keypad">
                <button onClick={handleClear}>C</button>
                <button onClick={() => handleOperatorClick('÷')}>÷</button>
                <button onClick={() => handleOperatorClick('×')}>×</button>
                <button onClick={() => handleNumberClick(7)}>7</button>
                <button onClick={() => handleNumberClick(8)}>8</button>
                <button onClick={() => handleNumberClick(9)}>9</button>
                <button onClick={() => handleOperatorClick('-')}>-</button>
                <button onClick={() => handleNumberClick(4)}>4</button>
                <button onClick={() => handleNumberClick(5)}>5</button>
                <button onClick={() => handleNumberClick(6)}>6</button>
                <button onClick={() => handleOperatorClick('+')}>+</button>
                <button onClick={() => handleNumberClick(1)}>1</button>
                <button onClick={() => handleNumberClick(2)}>2</button>
                <button onClick={() => handleNumberClick(3)}>3</button>
                <button onClick={handleEquals}>=</button>
                <button onClick={() => handleNumberClick(0)}>0</button>
                <button>.</button>
            </div>
        </div>
    );
};
