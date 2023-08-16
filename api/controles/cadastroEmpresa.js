import { db } from '../db.js';
import {} from 'dotenv/config';
import jwt from 'jsonwebtoken';
const SECRET = process.env.SECRET;

//gravando dados da empresa
export const postFactoring = (req, res) => {
    const { cnpj } = req.body;
    const { ie } = req.body;
    const { razao } = req.body;
    const { cep } = req.body;
    const { rua } = req.body;
    const { numero } = req.body;
    const { bairro } = req.body;
    const { complemento } = req.body;
    const { cidade } = req.body;
    const { uf } = req.body;
    const { telefone } = req.body;
    const { taxaMinima } = req.body;
    //const { id } = req.body;

    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end();
        req.userID = decoded.userID;
        const idUsuario = req.userID;
        const sql =
            'INSERT INTO factoring (cnpj, ie, razao,cep,rua,numero,bairro,complemento,cidade,uf,telefone,taxa_minima) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);';

        db.query(
            sql,
            [
                cnpj,
                ie,
                razao,
                cep,
                rua,
                numero,
                bairro,
                complemento,
                cidade,
                uf,
                telefone,
                taxaMinima,
            ],
            async (err, data) => {
                if (err) return res.json(err);
                AtualizaUsuario(data.insertId, idUsuario);

                const resposta = {
                    idRetorno: data.insertId,
                    mensagem: 'Cadastrado com sucesso!',
                };
                console.log(resposta);
                return res.status(200).json(resposta);
            }
        );
    });

    const AtualizaUsuario = (insertId, idUsuario) => {
        const sql = 'UPDATE usuarios SET idfactoring = ? WHERE idusuario = ?';
        db.query(sql, [insertId, idUsuario], (err, data) => {
            if (err) console.log(err);
            console.log('usuario alterado com sucesso! ');
        });
    };
};

/*//cadastrando a permissao de ADMIN do primeiro usuario do sistema

const permissaoAdminInicial = (idUsuario) => {
    const sql = 'INSERT INTO grupos_permissoes (grupo) VALUES (?)';
    db.query(sql, ['admin'], async (err, data) => {
        permissaoUsuarioAdmin(data.insertId, idUsuario);
    });
};

//cadastrando a permissao do primeiro usuario
const permissaoUsuarioAdmin = (idGrupoPermissao, idUsuario) => {
    const sql2 =
        'INSERT INTO permissoes_usuarios (idgrupo,idusuario) VALUES (?,?)';
    db.query(sql2, [idGrupoPermissao, idUsuario], async (err, data) => {});
};*/

//seleciona factoring
export const postSelecionaFactoring = (req, res) => {
    const { idFactoring } = req.body;
    const sql = 'SELECT * FROM factoring';
    db.query(sql, [idFactoring], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};

export const putAtualizaFactoring = (req, res) => {
    const { cnpj } = req.body;
    const { ie } = req.body;
    const { razao } = req.body;
    const { cep } = req.body;
    const { rua } = req.body;
    const { numero } = req.body;
    const { bairro } = req.body;
    const { complemento } = req.body;
    const { cidade } = req.body;
    const { uf } = req.body;
    const { telefone } = req.body;
    const { taxaMinima } = req.body;
    const { id } = req.body;

    console.log(req);

    const token = req.headers['x-access-token'];

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end();
        req.userID = decoded.userID;
        const idUsuario = req.userID;
        const sql =
            'UPDATE factoring SET cnpj = ?, ie = ?, razao = ?,cep = ?,rua = ?,numero = ?,bairro = ?,complemento = ?,cidade = ?,uf = ?,telefone = ?, taxa_minima = ? WHERE idfactoring = ? ';
        db.query(
            sql,
            [
                cnpj,
                ie,
                razao,
                cep,
                rua,
                numero,
                bairro,
                complemento,
                cidade,
                uf,
                telefone,
                taxaMinima,
                id,
            ],
            async (err, data) => {
                if (err) return res.json(err);
                return res.status(200).json('Cadastro alterado!');
            }
        );
    });
};
