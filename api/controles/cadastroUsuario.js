import { db } from '../db.js';
import {} from 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = process.env.SECRET;

//gravar o primeiro usuario Admin
export const postCadUsuario = async (req, res) => {
    const { nome } = req.body;
    const { senha } = req.body;

    const senhaHash = await bcrypt.hash(senha, 8);

    const sqlSelect = 'SELECT * FROM usuarios';
    db.query(sqlSelect, [], (err, data) => {
        if (data.length > 0) {
            /*  const sql = 'INSERT INTO usuarios (nome,senha) VALUES (?,?)';
            db.query(sql, [nome, senhaHash], (err, data) => {
                permissaoOperacionalInicial(data.insertId);
                if (err) return res.json(err);
                return res.status(200).json('Usuario cadastrado com sucesso!');
            });*/
            return res.status(200).json({
                status: 'erro',
                msg: 'Já existe um usário Admin cadastrado!',
            });
        } else {
            const sql = 'INSERT INTO usuarios (nome,senha) VALUES (?,?)';
            db.query(sql, [nome, senhaHash], (err, data) => {
                if (err) return res.json(err);
                permissaoAdminInicial(data.insertId);
                return res.status(200).json('Usuario cadastrado!');
                return res.status(200).json({
                    status: 'erro',
                    msg: 'Usário Admin cadastrado com sucesso!',
                });
            });
        }
    });
};

//cadastrando a permissao de ADMIN do primeiro usuario do sistema

const permissaoAdminInicial = (idUsuario) => {
    const sqlSelect = 'SELECT * FROM grupos_permissoes WHERE `grupo` = ?';
    db.query(sqlSelect, ['admin'], async (err, data) => {
        if (data.length > 0) {
            data.map((grupo) => {
                permissaoUsuarioAdmin(grupo.idgrupo, idUsuario);
            });
        } else {
            const sql = 'INSERT INTO grupos_permissoes (grupo) VALUES (?)';
            db.query(sql, ['admin'], async (err, data) => {
                permissaoUsuarioAdmin(data.insertId, idUsuario);
            });
        }
    });
};

//cadastrando a permissao do primeiro usuario
const permissaoUsuarioAdmin = (idGrupoPermissao, idUsuario) => {
    const sql2 =
        'INSERT INTO permissoes_usuarios (idgrupo,idusuario) VALUES (?,?)';
    db.query(sql2, [idGrupoPermissao, idUsuario], async (err, data) => {});
};

//cadastrando a permissao de OPERACIONAL do primeiro usuario do sistema

const permissaoOperacionalInicial = (idUsuario) => {
    const sqlSelect = 'SELECT * FROM grupos_permissoes WHERE `grupo` = ?';
    db.query(sqlSelect, ['operacional'], async (err, data) => {
        if (data.length > 0) {
            data.map((grupo) => {
                permissaoUsuarioOperacional(grupo.idgrupo, idUsuario);
            });
        } else {
            const sql = 'INSERT INTO grupos_permissoes (grupo) VALUES (?)';
            db.query(sql, ['operacional'], async (err, data) => {
                permissaoUsuarioOperacional(data.insertId, idUsuario);
            });
        }
    });
};

//cadastrando usuarios secundarios
const permissaoUsuarioOperacional = (idGrupoPermissao, idUsuario) => {
    const sql2 =
        'INSERT INTO permissoes_usuarios (idgrupo,idusuario) VALUES (?,?)';
    db.query(sql2, [idGrupoPermissao, idUsuario], async (err, data) => {});
};

//gravar usuario secundario
export const postCadUsuarioSecundario = async (req, res) => {
    const { nome } = req.body;
    const { senha } = req.body;
    const { idFactoring } = req.body;

    const senhaHash = await bcrypt.hash(senha, 8);

    const sql = 'INSERT INTO usuarios (nome,senha,idFactoring) VALUES (?,?,?)';
    db.query(sql, [nome, senhaHash, idFactoring], (err, data) => {
        if (err) return res.json(err);
        permissaoOperacionalInicial(data.insertId);
        return res.status(200).json('Usuario cadastrado!');
    });
};

export const listaUsuarios = (req, res) => {
    const sql = 'select * from usuarios order by nome ';
    db.query(sql, [], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};
