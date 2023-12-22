import { Request, Response } from "express";
import { erroCampoNaoInformado, erroServidor, notFoud } from "../util/response.helper";
import repository from "../database/prisma.repository";
import { randomUUID } from "crypto";

export class AuthController {


    // post http://localhost:3333/login
    public async login(req: Request, res: Response) {
        try {

            //1- entrada
            const { email, senha } = req.body

            if (!email || !senha) {
                return erroCampoNaoInformado(res)
            }

            //2- processamento
            // buscar o aluno por email + senha

            const aluno = await repository.aluno.findFirst({
                where: {
                    email,
                    senha
                },
                select: {
                    id: true,
                    nome: true
                }
            });
            //401 - erro nao autorizado
            if (!aluno) {
                return res.status(401).send(
                    {
                        ok: false,
                        message: 'Credenciais inválidas'
                    }
                )
            }


            //gerar credencial para o usuario

            const token = randomUUID();

            //salvar o token na tabela de alunos

            await repository.aluno.update({
                where: {
                    id: aluno.id
                },
                data: {
                    token
                }
            })


            //3- saida
            return res.status(200).send(
                {
                    ok: true,
                    message: 'Login realizada com sucesso',
                    data: {
                        id: aluno.id,
                        nome: aluno.nome,
                        token
                    }
                }
            )

        } catch (error) {
            erroServidor(res, error)

        }
    }


}