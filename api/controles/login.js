import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import {} from 'dotenv/config';
import jwt from 'jsonwebtoken';
const SECRET = process.env.SECRET;

function compara() {}

export const loginFactoring = async (req, res) => {
    const { nome } = req.body;
    const { senha } = req.body;
    const sql =
        'Select * from usuarios, permissoes_usuarios, grupos_permissoes where usuarios.nome= ? and permissoes_usuarios.idusuario = usuarios.idusuario AND grupos_permissoes.idgrupo = permissoes_usuarios.idgrupo';

    db.query(sql, [nome], (err, data) => {
        if (err) return res.json(err);

        if (data.length > 0) {
            data.map(async (user) => {
                const senhaOk = await bcrypt.compare(senha, user.senha);
                console.debug(senhaOk);
                if (senhaOk) {
                    const token = jwt.sign(
                        {
                            userID: user.idusuario,
                            nome: user.nome,
                            grupo: user.grupo,
                        },
                        SECRET,
                        { expiresIn: 36000 }
                    ); //300 segundos 5min.
                    return res.json({
                        auth: true,
                        token,
                        factoring: user.idfactoring,
                    });
                } else {
                    return res.status(200).json('Usuário ou senha invalido');
                }
            });
        } else {
            return res.status(200).json('Usuário ou senha invalido');
        }
    });
};
