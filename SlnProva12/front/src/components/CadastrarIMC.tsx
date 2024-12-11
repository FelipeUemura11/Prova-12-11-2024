import React, { useState, useEffect } from "react";
import axios from "axios";
import { Aluno } from "../models/Aluno";

const CadastroIMC: React.FC = () => {
  const [aluno, setAluno] = useState<Aluno[]>([]);
  const [nome, setNome] = useState<string>("");
  const [sobrenome, setSobrenome] = useState<string>("");
  const [altura, setAltura] = useState<number>(0);
  const [peso, setPeso] = useState<number>(0);
  const [imc, setImc] = useState<number>(0);
  const [classificacao, setClassificacao] = useState<string>("");
  const [obesidade, setObesidade] = useState<number>(0);
  const [criadoEm, setCriadoEm] = useState<string>("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alunoResponse] = await Promise.all([
          axios.get("http://localhost:5228/api/imc/listar"),
        ]);
        setAluno(alunoResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editandoId !== null) {
        await axios.put(`http://localhost:5228/api/imc/alterar/${editandoId}`, {
          nome,
          sobrenome,
        });
      } else {
        await axios.post("http://localhost:5228/api/imc/cadastrar", {
          peso,
          altura
        });
      }

      // Atualiza a lista de aluno
      const response = await axios.get("http://localhost:5228/api/imc/listar");
      setAluno(response.data);

      // Limpa o formulário
      setNome("");
      setSobrenome("");
      setPeso(0);
      setAltura(0);
      setImc(0);
      setClassificacao("");
      setObesidade(0);
      setCriadoEm("");
      setEditandoId(null);
    } catch (error) {
      console.error("Erro ao salvar Aluno:", error);
    }
  };

  const handleEdit = (id: number) => {
    const a = aluno.find((p) => p.id === id);
    if (a) {
      setNome(a.nome);
      setSobrenome(a.sobrenome);
      setAltura(a.altura);
      setPeso(a.peso);
      setImc(a.imc);
      setClassificacao(a.classificacao);
      setObesidade(a.obesidade);
      setCriadoEm(a.criadoEm);
      setEditandoId(id);
    }
  };

  const handleCancel = () => {
    setNome("");
    setSobrenome("");
    setAltura(0);
    setPeso(0);
    setImc(0);
    setClassificacao("");
    setObesidade(0);
    setCriadoEm("");
    setEditandoId(null);
  };

  return (
  <div>
    <h1>Cadastrar Aluno</h1>

    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Nome:
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Sobrenome
          <input
            type="text"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Peso
          <input
            type="text"
            value={peso}
            onChange={(e) => setPeso(Number(e.target.value))}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Altura
          <input
            type="text"
            value={altura}
            onChange={(e) => setAltura(Number(e.target.value))}
            required
          />
        </label>
      </div>
      <div>
        <label>
          IMC
          <input
            type="text"
            value={imc}
            onChange={(e) => setImc(Number(e.target.value))}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Classificacao
          <input
            type="text"
            value={classificacao}
            onChange={(e) => setClassificacao(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Obesidade
          <input
            type="text"
            value={obesidade}
            onChange={(e) => setImc(Number(e.target.value))}
            required
          />
        </label>
      </div>
      <div>
        <label>
          CriadoEm
          <input
            type="text"
            value={criadoEm}
            onChange={(e) => setCriadoEm(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">{editandoId !== null ? "Editar" : "Adicionar"}</button>
      {editandoId !== null && (
        <button type="button" onClick={handleCancel}>
          Cancelar
        </button>
      )}
    </form>

    <h2>Lista de aluno</h2>
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Sobrenome</th>
          <th>altura</th>
          <th>peso</th>
          <th>IMC</th>
          <th>Classificacao</th>
          <th>Obesidade</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {aluno.map((aluno) => (
          <tr key={aluno.id}>
            <td>{aluno.nome}</td>
            <td>{aluno.sobrenome}</td>
            <td>{aluno.altura}</td>
            <td>{aluno.peso}</td>
            <td>{aluno.imc}</td>
            <td>{aluno.classificacao}</td>
            <td>{aluno.obesidade}</td>
            <td>
              <button onClick={() => handleEdit(aluno.id)}>Editar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

};

export default CadastroIMC;
