import { db } from '../db.js';
import {} from 'dotenv/config';
import jwt from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
const SECRET = process.env.SECRET;

//gravando dados do Login do Delivery
export const postCadUsuario = async (req, res) => {
    const { email } = req.body;
    const { senha } = req.body;

    const senhaHash = await hash(senha, 8);

    const sqlSelect = 'SELECT * FROM usuarios';
    db.query(sqlSelect, [], (err, data) => {
        if (data.length > 0) {
            const sql = 'INSERT INTO usuarios (email,senha) VALUES (?,?)';
            db.query(sql, [email, senhaHash], (err, data) => {
                permissaoOperacionalInicial(data.insertId);
                if (err) return res.json(err);
                return res.status(200).json('Usuario cadastrado com sucesso!');
            });
        } else {
            const sql = 'INSERT INTO usuarios (email,senha) VALUES (?,?)';
            db.query(sql, [email, senhaHash], (err, data) => {
                permissaoAdminInicial(data.insertId);
                if (err) return res.json(err);
                return res.status(200).json('Usuario cadastrado com sucesso!');
            });
        }
    });

    /* const sql = 'INSERT INTO usuarios (email,senha) VALUES (?,?)';
    db.query(sql, [email, senhaHash], (err, data) => {
        if (err) return res.json(err);
        const sql2 = 'SELECT * FROM usuario';
        db.query(sql2, (err, data) => {
            if (data.length > 0) {
                return res.status(200).json('Cadastrado com sucesso!');
            } else {
                permissaoAdminInicial(data.insertId);
                return res
                    .status(200)
                    .json('Usuario e permissões cadastrados!');
            }
        });
    });*/
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
