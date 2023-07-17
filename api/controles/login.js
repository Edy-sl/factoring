import { compare } from 'bcrypt';
import { db } from '../db.js';
import {} from 'dotenv/config';
import jwt from 'jsonwebtoken';
const SECRET = process.env.SECRET;

function compara() {}

export const loginFactoring = async (req, res) => {
    const { email } = req.body;
    const { senha } = req.body;
    const sql =
        'Select * from usuarios, permissoes_usuarios, grupos_permissoes where usuarios.email= ? and permissoes_usuarios.idusuario = usuarios.idusuario AND grupos_permissoes.idgrupo = permissoes_usuarios.idgrupo';

    db.query(sql, [email], (err, data) => {
        if (err) return res.json(err);

        if (data.length > 0) {
            data.map(async (user) => {
                const senhaOk = await compare(senha, user.senha);
                console.debug(senhaOk);
                if (senhaOk) {
                    const token = jwt.sign(
                        {
                            userID: user.idusuario,
                            nome: user.nome,
                            grupo: user.grupo,
                        },
                        SECRET,
                        { expiresIn: 300000 }
                    ); //300 segundos 5min.
                    return res.json({
                        auth: true,
                        token,
                        factoring: user.idfactoring,
                    });
                } else {
                    return res.status(200).json('Email ou senha invalido');
                }
            });
        } else {
            return res.status(200).json('Email ou senha invalido');
        }
    });
};
