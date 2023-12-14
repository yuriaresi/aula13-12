import { randomUUID } from "crypto";


export class Aluno {
    public id: string;
    public nome: string;
    public email: string;
    public senha: string;
    public idade?: number;


    constructor( nome: string, email: string, senha: string, idade?: number) {
        this.id = randomUUID()
        this.nome = nome
        this.email = email
        this.senha = senha
        this.idade = idade
    }
}