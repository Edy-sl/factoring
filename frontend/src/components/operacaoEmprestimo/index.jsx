import './formOperacionalEmprestimo.css';
import React from 'react';
export const FormOperacionalEmprestimo = () => {
    return (
        <>
            <form className="formOperacionalEmprestimo">
                <h1>Empréstimo</h1>
                <div className="boxGeralOperacionalEmprestimo">
                    <div className="boxLeft">
                        <label className="labelOperacionalEmprestimo">
                            Cliente
                        </label>
                        <input id="inputCliente" type="text" placeholder="" />
                        <div className="boxRow">
                            <div className="boxCol">
                                <label>Data Base</label>
                                <input type="date" placeholder="" />
                            </div>
                            <div className="boxCol">
                                <label>Juros Mensal</label>
                                <input type="text" placeholder="" />
                            </div>
                            <div className="boxCol">
                                <label>Juros Diario</label>
                                <input type="text" placeholder="" />
                            </div>
                        </div>
                        <div className="boxRow">
                            <div className="boxCol">
                                <label>Vl. Emprestimo</label>
                                <input type="text" placeholder="" />
                            </div>
                            <div className="boxCol">
                                <label>Qtd. Parcelas</label>
                                <input type="text" placeholder="" />
                            </div>
                            <div className="boxCol">
                                <label>Intervalo</label>
                                <input type="text" placeholder="" />
                            </div>
                        </div>
                        <textarea id="obsEmprestimo" />
                    </div>
                    <div className="boxRight">
                        <div className="boxResumoOpE">
                            <div className="boxCol">
                                <label>Emprestimo</label> <input type="text" />
                            </div>
                            <div className="boxCol">
                                <label>Juros</label> <input type="text" />
                            </div>
                            <div className="boxCol">
                                <label>A pagar</label> <input type="text" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};
