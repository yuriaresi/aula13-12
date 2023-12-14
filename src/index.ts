import express, { Request, Response } from "express";
import { AlunoController } from "./controllers/aluno.controller";





const app = express();
app.use(express.json());

const alunoController = new AlunoController();

// criar um novo aluno
app.post("/aluno", alunoController.criarAluno);

app.get('/aluno/:id',alunoController.obterAluno)









app.listen(3333, () => {
    console.log("A API está rodando!- http://localhost:3333");
});