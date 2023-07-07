import './formCliente.css';
export const FormCliente = () => {
    return (
        <>
            <form className="formCliente">
                <h1>Cliente</h1>
                <div className="boxRow">
                    <div className="boxCol">
                        <label>CNPJ/CPF</label>
                        <input id="inputCnpjCpf" type="text" placeholder="" />
                    </div>
                    <div className="boxCol">
                        <label>IE/RG</label>
                        <input id="inputIeRg" type="text" placeholder="" />
                    </div>
                </div>

                <label>Nome</label>

                <input type="text" placeholder="" />

                <label>Cep</label>
                <input id="inputCep" type="text" placeholder="" />

                <div className="boxRow">
                    <div className="boxCol">
                        <label>Rua</label>
                        <input id="inputRua" type="text" placeholder="" />
                    </div>
                    <div className="boxCol">
                        {' '}
                        <label>Número</label>
                        <input id="inputNumero" type="text" placeholder="" />
                    </div>
                </div>

                <div className="boxRow">
                    <div className="boxCol">
                        <label>Complemento</label>
                        <input
                            id="inputComplemento"
                            type="text"
                            placeholder=""
                        />
                    </div>{' '}
                    <div className="boxCol">
                        <label>Bairro</label>
                        <input
                            id="inputBairro"
                            type="text"
                            placeholder="Bairro"
                        />
                    </div>
                </div>
                <div className="boxRow">
                    <div className="boxCol">
                        <label>Cidade</label>
                        <input id="inputCidade" type="text" placeholder="" />
                    </div>
                    <div className="boxCol">
                        <label>UF</label>
                        <select id="selectUf" name="select">
                            <option value="valor1">SP</option>
                            <option value="valor2">Valor 2</option>
                            <option value="valor3">Valor 3</option>
                        </select>
                    </div>
                </div>

                <textarea
                    id="textObservacao"
                    type="text"
                    placeholder="Observação"
                />

                <button type="submite">Salvar</button>
            </form>
        </>
    );
};
