import { error } from "console";
import { Request, Response } from "express";
import { erroCampoNaoInformado, erroServidor, notFoud } from "../util/response.helper";
import repository from "../database/prisma.repository";
import { adaptAlunoPrisma } from "../util/aluno.adapter";
import { Avaliacao } from "../models/avaliacao.model";

export class AvaliacaoController {

    // post http://localhost:3333/aluno/:id:avaliacao/
    public async criarAvaliacao(req: Request, res: Response) {

        try {
            //1- entrada
            // ID do aluno
            const { id } = req.params
            const { disciplina, nota } = req.body

            if (!disciplina || !nota) {
                return erroCampoNaoInformado(res)
            }
            //2- processo
            //verificar se o aluno existe, 404 se nao.
            const aluno = await repository.aluno.findUnique(
                {
                    where: {
                        id
                    }
                }
            );
            if (!aluno) {
                return notFoud(res, 'Aluno')
            }

            const alunoBackend = adaptAlunoPrisma(aluno)
            //criar o model backend da avaliacao
            const avaliacao = new Avaliacao(disciplina, nota, alunoBackend)
            // salvar no banco de dados

            const result = await repository.avaliacao.create({
                data: {
                    id: avaliacao.id,
                    disciplina: avaliacao.disciplica,
                    nota: avaliacao.nota,
                    idAluno: avaliacao.aluno.id
                }
            })


            //3- saida
            return res.status(201).send(
                {
                    ok: true,
                    message: 'Avaliação criada com sucesso',
                    data: result
                }
            )


        } catch (erro: any) {
            return erroServidor(res, error)
        }

    }
}