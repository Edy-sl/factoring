import './relatorioEmprestimoData.css';
import { FiSearch } from 'react-Icons/fi';
import { useState, useRef, useEffect } from 'react';
import { apiFactoring } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const RelatorioEmprestimoPorData = () => {
    const ref = useRef();

    const [listagem, setListagem] = useState([]);

    const [dadosEmprestimo, setDadosEmprestimo] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const relatorioPorData = async () => {
        const dadosRelatorio = ref.current;
        var dataI = dadosRelatorio.dataI.value;
        var dataF = dadosRelatorio.dataF.value;

        await apiFactoring
            .post(
                '/relatorio-emprestimo-data',
                {
                    dataI: dataI,
                    dataF: dataF,
                },
                {
                    headers: {
                        'x-access-token': localStorage.getItem('user'),
                    },
                }
            )
            .then(({ data }) => {
                console.log(data);
                setListagem(data);
            })
            .catch(({ data }) => {
                toast.error(data);
            });
    };

    return (
        <>
            {' '}
            <ToastContainer
                autoClose={3000}
                position={toast.POSITION.BOTTOM_LEFT}
            />
            <div className="divRelatorioEmprestimoData">
                <form className="" ref={ref} onSubmit={handleSubmit}>
                    <div className="boxRow">
                        <div className="boxCol">
                            <label>Data Inicial</label>
                            <input type="date" name="dataI" />
                        </div>
                        <div className="boxCol">
                            <label>Data Final</label>
                            <div className="row">
                                <input type="date" name="dataF" />{' '}
                                <FiSearch
                                    className="icone2"
                                    onClick={relatorioPorData}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>{' '}
            <div className="boxCol" id="divContainerLista">
                <div className="divListaTitulo">
                    <div className="alignLeft">Operação</div>
                    <div className="alignLeft">Cliente</div>
                    <div className="alignRight">Parcela</div>
                    <div className="alignCenter">Data</div>
                    <div className="alignRight">Vencimento</div>
                    <div className="alignRight">Valor Total</div>
                    <div className="alignRight">Valor</div>
                    <div className="alignRight">Valor Pago</div>
                </div>
                <div className="divListaRContainer">
                    {' '}
                    {listagem.map((lista, i) => (
                        <div kei={i} className="divListaR">
                            <div className="alignLet">{lista.idemprestimo}</div>
                            <div className="alignLeft">{lista.nome}</div>
                            <div className="alignRight">
                                {lista.parcela}/{lista.quantidade_parcelas}
                            </div>
                            <div className="alignRight">
                                {lista.data_cadastro}
                            </div>
                            <div className="alignRight">{lista.vencimento}</div>
                            <div className="alignRight">
                                {lista.valor_total}
                            </div>
                            <div className="alignRight">{lista.valor}</div>
                            <div className="alignRight">{lista.valor_pago}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
