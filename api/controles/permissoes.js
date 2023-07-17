import { db } from '../db.js';

export const getPermissoes = (req, res) => {
    const sql =
        'Select usuarios.idusuario, usuarios.email, grupos_permissoes.grupo from usuarios, permissoes_usuarios, grupos_permissoes where permissoes_usuarios.idusuario = usuarios.idusuario AND grupos_permissoes.idgrupo = permissoes_usuarios.idgrupo order by grupo';
    db.query(sql, [], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(data);
    });
};
