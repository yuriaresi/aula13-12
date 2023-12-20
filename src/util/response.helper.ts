import { Response } from "express";

export function erroServidor(res: Response, error: any) {
    return res.status(500).send(
        {
            ok: false,
            message: error.toString()
        })
};

export function notFoud(res:Response, entidade: string){
    return res.status(404).send(
        {
            ok: false,
            message:`${entidade} não encontrado`
        })
}

export function erroCampoNaoInformado(res:Response){
    return res.status(400).send(
        {
            ok:false,
            message: 'Preencha todos os campos'
        }
    )
}