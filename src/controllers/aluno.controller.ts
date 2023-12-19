import { Request, Response } from "express";
import { Aluno } from "../models/aluno.model";
import repository from "../database/prisma.repository";

export class AlunoController {
    //Criar um novo aluno
    public async criarAluno(req: Request, res: Response) {


        try {
            //1- entrada
            const { nome, email, senha, idade } = req.body

            if (!nome || !email || !senha) {
                return res.status(400).send({
                    ok: false,
                    messagem: "Os campos obrigatorios não foram informados."
                })
            }

            //2- processamento
            const aluno = new Aluno(nome, email, senha, idade)
            const result = await repository.aluno.create(
                {
                    data: aluno
                });

            //3- saida

            return res.status(201).send(
                {
                    ok: true,
                    message: "Aluno criado com sucesso!",
                    data: result
                });

        }
        catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString()
            })
        }

    }

    //Obter um aluno pelo ID
    public async obterAluno(req: Request, res: Response) {
        try {
            //1- entrada
            const { id } = req.params

            //2- processamento
            const aluno = await repository.aluno.findUnique(
                {
                    where: {
                        id
                    }
                });

            if (!aluno) {
                return res.status(404).send({
                    ok: false,
                    message: 'Aluno não encontrado'
                })
            }

            //3- saida
            return res.status(200).send(
                {
                    ok: true,
                    message: 'usuario obtido com sucesso',
                    data: aluno
                }
            )

        }
        catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString()
            })
        }
    }

    // DELETE- deletar um aluno

    public async deletarAluno(req: Request, res: Response) {
        try {
            //1- entrada
            const { id } = req.params;

            //2- processamento
            // verificar se o aluno existe, se não existe 404
            const aluno = await repository.aluno.findUnique({
                where: {
                    id
                }
            });

            if (!aluno) {
                return res.status(404).send({
                    ok: false,
                    message: 'Aluno não encontrado'
                })
            }

            // deletar o aluno

            await repository.aluno.delete({
                where: {
                    id
                }
            })

            //3- saida
            return res.status(200).send({
                ok: true,
                message: 'Aluno deletado com sucesso.'
            })


        } catch (error: any) {
            return res.status(500).send({
                ok: false,
                message: error.toString()
            })
        }
    }

    // PUT - atualizar um aluno

    public async atualizarAluno(req: Request, res: Response) {
        try {
            //-1 entrada
            const { id } = req.params
            const { nome, idade } = req.body;

            if (!nome && !idade) {
                return res.status(400).send(
                    {
                        ok: false,
                        message: 'Informe ao menos um campo para atualizar'
                    }
                )
            };

            //-2 processamento
            //verificar se o aluno existe
            const aluno = await repository.aluno.findUnique(
                {
                    where: { id }
                });

            if (!aluno) {
                return res.send(404).send({
                    ok: false,
                    message: 'Aluno não existe'
                })
            }

            //atualizar os dados do aluno
          const result =  await repository.aluno.update({
                where: { id },
                data: {
                    nome,
                    idade
                }
            });
            

            //-3 saida
            return res.status(200).send({
                ok:true,
                message:'Aluno atualizado com sucesso',
                data: result
            })
        } catch (error: any) {
            return res.status(500).send(
                {
                    ok: false,
                    message: error.toString()
                }
            )
        }
    }

    public async listarALunos (req:Request, res:Response){
        try{
            res.status(200).send(
                await repository.aluno.findMany()
            )
        }catch (error: any) {
            return res.status(500).send(
                {
                    ok: false,
                    message: error.toString()
                }
            )
        }
    }
}