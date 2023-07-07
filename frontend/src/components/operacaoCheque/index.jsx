import { GridCheque } from '../gridCheque';
import './formOperacaoCheque.css';
export const FormOperacaoCheque = () => {
    return (
        <>
            <form className="formOperacaoCheque">
                <div className="boxOpChequeLeft">
                    {' '}
                    <h1>Cheques</h1>
                    <div className="boxCol">
                        <label>Cliente</label>
                        <input id="inputCliente" type="text" placeholder="" />
                    </div>
                    <div className="boxRow">
                        <div className="boxCol">
                            <label>Data Base</label>
                            <input
                                id="inputDataBase"
                                type="date"
                                placeholder=""
                                onKeyPress={(event) => handleKeyPress(event)}
                            />
                        </div>
                        <div className="boxCol">
                            <label>Tx Ted</label>
                            <input id="inputTxTed" type="text" placeholder="" />
                        </div>
                        <div className="boxCol">
                            <label>Juros Mensal</label>

                            <input
                                id="inputJurosM"
                                type="text"
                                placeholder=""
                            />
                        </div>
                        <div className="boxCol">
                            <label>Juros Diario</label>

                            <input
                                id="inputJurosD"
                                type="text"
                                placeholder=""
                            />
                        </div>
                    </div>
                    <div className="boxRow">
                        <div className="boxCol">
                            <label>Banco</label>
                            <input id="inputNbco" type="text" placeholder="" />
                        </div>
                        <div className="boxCol">
                            <label>Nome do Banco</label>

                            <input id="inputBanco" type="text" placeholder="" />
                        </div>

                        <div className="boxCol">
                            <label>Agencia</label>

                            <input
                                id="inputAgencia"
                                type="text"
                                placeholder=""
                            />
                        </div>

                        <div className="boxCol">
                            <label>Conta</label>

                            <input id="inputConta" type="text" placeholder="" />
                        </div>
                        <div className="boxCol">
                            <label>Nº Cheque</label>

                            <input
                                id="inputNcheque"
                                type="text"
                                placeholder=""
                            />
                        </div>
                    </div>
                    <div className="boxRow">
                        <div className="boxCol">
                            <label>Cpf/Cnpj</label>

                            <input
                                id="inputCpfCnpj"
                                type="text"
                                placeholder=""
                            />
                        </div>
                        <div className="boxCol">
                            <label>Nome do Cheque</label>

                            <input
                                id="inputNomeC"
                                type="text"
                                placeholder="Nome"
                            />
                        </div>
                    </div>
                    <div className="boxRow">
                        <div className="boxCol">
                            <label>Vencimento</label>
                            <input
                                id="inputVencimento"
                                type="date"
                                placeholder=""
                            />
                        </div>
                        <div className="boxCol">
                            <label>Vl. Cheque</label>

                            <input
                                id="inputValorC"
                                type="text"
                                placeholder=""
                            />
                        </div>
                        <div className="boxCol">
                            <label>Dias</label>

                            <input id="inputDias" type="text" placeholder="" />
                        </div>
                        <div className="boxCol">
                            <label>Vl Juros</label>

                            <input
                                id="inputValorJuros"
                                type="text"
                                placeholder=""
                            />
                        </div>
                        <div className="boxCol">
                            <label>Vl Liquido</label>

                            <input
                                id="inputValorLiquido"
                                type="text"
                                placeholder=""
                            />
                        </div>
                    </div>
                    <button>Incluir</button>
                </div>

                <div className="boxOpChequeRight">
                    <h2>Resumo</h2>

                    <div className="boxResumo">
                        <label>Cheques Lançados</label>
                        <input type="text" />
                    </div>

                    <div className="boxResumo">
                        <label>Total Bruto</label>
                        <input type="text" />
                    </div>

                    <div className="boxResumo">
                        <label>Deduções</label>
                        <input type="text" />
                    </div>
                    <div className="boxResumo">
                        <label>Total Juros</label>
                        <input type="text" />
                    </div>
                    <div className="boxResumo">
                        <label>Total Liquido</label>
                        <input type="text" />
                    </div>
                </div>
            </form>
            <GridCheque />
        </>
    );
};
