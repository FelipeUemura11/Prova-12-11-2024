import React, { useState, useEffect } from "react";
import axios from "axios";
import { Aluno } from "../models/Aluno";

const AlunoComponent: React.FC = () => {
  const [aluno, setAluno] = useState<Aluno[]>([]);
  const [nome, setNome] = useState<string>("");
  const [sobrenome, setSobrenome] = useState<string>("");
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
        await axios.post("http://localhost:5228/api/aluno/cadastrar", {
          nome,
          sobrenome,
        });
      }

      // Atualiza a lista de aluno
      const response = await axios.get("http://localhost:5228/api/imc/listar");
      setAluno(response.data);

      // Limpa o formulário
      setNome("");
      setSobrenome("");
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
      setEditandoId(id);
    }
  };

  const handleCancel = () => {
    setNome("");
    setSobrenome("");
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
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {aluno.map((aluno) => (
          <tr key={aluno.id}>
            <td>{aluno.nome}</td>
            <td>{aluno.sobrenome}</td>
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

export default AlunoComponent;
