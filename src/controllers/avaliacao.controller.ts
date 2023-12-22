import { error } from "console";
import { Request, Response } from "express";
import { erroCampoNaoInformado, erroServidor, notFoud } from "../util/response.helper";
import repository from "../database/prisma.repository";
import { adaptAlunoPrisma } from "../util/aluno.adapter";
import { Avaliacao } from "../models/avaliacao.model";

export class AvaliacaoController {

    // post http://localhost:3333/aluno/:id/avaliacao/
    public async criarAvaliacao(req: Request, res: Response) {

        try {
            //1- entrada
            // ID do aluno
            const { id } = req.params
            const { disciplina, nota } = req.body
            const {authorization} = req.headers

            if (!disciplina || !nota) {
                return erroCampoNaoInformado(res)
            }
            // verificar seo token de autorizaçao foi informado
            if(!authorization){
                return res.status(401).send({
                    ok:false,
                    message:'token de autenticação nao informado'
                })
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

            //verificar se o token é valido

            if(aluno.token !== authorization){
                res.status(401).send(
                    {ok:false,
                    message: 'Token inválido'}
                )
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

    // listar avaliaçoes de um aluno
    // get http://localhost:3333/aluno/:id/avaliacao/

    public async ListarAvaliacoes(req: Request, res: Response) {
        try {

            // 1- entrada
            const { id } = req.params


            //2- processamento
            // verificar se o aluno existe, se nao é 404

            const aluno = await repository.aluno.findUnique({
                where: { id },
                include: { avalliacoes: true }
            })

            if (!aluno) {
                return notFoud(res, 'Aluno')
            }

            // const avaliacoes = await repository.avaliacao.findMany({
            //     where: { idAluno: id }
            // })

            //3- saida
            return res.status(201).send(
                {
                    ok: true,
                    message: 'Avaliações listadas com sucesso',
                    data: aluno
                }
            )

        } catch (error: any) { erroServidor(res, error) }
    }
    //put http://localhost:3333/aluno/:id/avaliacao/:idAvaliacao
    public async atualizarAvalicao(req: Request, res: Response) {
        try {
            //1- entrada
            const { id, idAvaliacao } = req.params

            const { nota } = req.body

            if (!nota) {
                return erroCampoNaoInformado(res)
            }

            //2- processamento
            // verificar se o aluno e a avaliacao existem, se nao 404
            const aluno = await repository.aluno.findUnique({
                where: { id }
            })

            if (!aluno) { return notFoud(res, 'Aluno') }


            const avaliacao = await repository.avaliacao.findUnique({
                where: { id: idAvaliacao }
            })
            if (!avaliacao) {
                return notFoud(res, 'Avaliacao')
            }

            //atualizar o avaliacao

            const result = await repository.avaliacao.update({
                where: { id: idAvaliacao },
                data: { nota }
            })

            //3- saida

            return res.status(200).send({
                ok: true,
                message: 'Avaliação atualizada com sucesso.',
                data: nota
            })



        } catch (error: any) {
            erroServidor(res, error)

        }
    }
}