import { json } from 'express';
import { db } from '../db.js';

export const getPermissoes = (req, res) => {
    const sql =
        'Select usuarios.idusuario, usuarios.nome, ' +
        'permissoes_usuarios.idpermissoes, ' +
        'grupos_permissoes.grupo from usuarios, ' +
        'permissoes_usuarios, grupos_permissoes ' +
        'where permissoes_usuarios.idusuario = usuarios.idusuario ' +
        'AND grupos_permissoes.idgrupo = permissoes_usuarios.idgrupo order by grupo';
    db.query(sql, [], (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};

export const atualizaPermissao = (req, res) => {
    const { idUsuario } = req.body;
    const { idGrupo } = req.body;
    let sql = '';

    sql = 'delete from permissoes_usuarios where idusuario = ? ';
    db.query(sql, [idUsuario], (err, data) => {});

    sql = 'insert into permissoes_usuarios (idgrupo, idusuario) values (?, ?)';
    db.query(sql, [idGrupo, idUsuario], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Permissão atualizada!');
    });
};

export const excluirPermissao = (req, res) => {
    const { idPermissao } = req.body;
    const sql = 'delete from permissoes_usuarios where idpermissoes = ? ';
    db.query(sql, [idPermissao], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Permissao excluída!');
    });
};

export const listaGrupoPermissao = (req, res) => {
    const sql = 'select * from grupos_permissoes';
    db.query(sql, [], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};
