import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AlunoComponent from './components/AlunoComponent';
import CadastrarIMC from './components/CadastrarIMC';

function App() {
  return (
    <div id="app">
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/pages/aluno/cadastrar">Cadastrar Aluno</Link>
            </li>
            <li>
              <Link to="/pages/imc/cadastrar">Cadastrar IMC Aluno</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/Home"
            element={<Home />}
          />
          <Route path="/" element={<AlunoComponent />} />
          <Route
            path="/pages/aluno/cadastrar"
            element={<AlunoComponent />}
          />
          <Route path="/" element={<CadastrarIMC />} />
          <Route
            path="/pages/imc/cadastrar"
            element={<CadastrarIMC />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
