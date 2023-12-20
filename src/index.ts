import express, { Request, Response } from "express";
import { AlunoController } from "./controllers/aluno.controller";
import { AvaliacaoController } from "./controllers/avaliacao.controller";





const app = express();
app.use(express.json());

const alunoController = new AlunoController();
const avaliacaoController = new AvaliacaoController()

// criar um novo aluno
app.post("/aluno", alunoController.criarAluno);

app.get('/aluno/:id',alunoController.obterAluno)

app.delete('/aluno/:id', alunoController.deletarAluno)

app.put ('/aluno/:id', alunoController.atualizarAluno)

app.get('/aluno', alunoController.listarALunos)


//Rotas de Avaliacao
app.post('/aluno/:id/avaliacao',avaliacaoController.criarAvaliacao)


app.listen(3333, () => {
    console.log("A API está rodando!- http://localhost:3333");
});