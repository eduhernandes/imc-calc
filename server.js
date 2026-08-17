require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicializa a tabela ao subir o servidor
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS registros_imc (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      peso NUMERIC(5,2) NOT NULL,
      altura NUMERIC(4,2) NOT NULL,
      imc NUMERIC(5,2) NOT NULL,
      classificacao VARCHAR(50) NOT NULL,
      criado_em TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('✅ Tabela verificada/criada no banco Neon.');
}

// Calcula o IMC e retorna a classificação
function calcularImc(peso, altura) {
  const imc = peso / (altura * altura);
  let classificacao;
  if (imc < 18.5) classificacao = 'Abaixo do peso';
  else if (imc < 25.0) classificacao = 'Peso normal';
  else if (imc < 30.0) classificacao = 'Sobrepeso';
  else if (imc < 35.0) classificacao = 'Obesidade Grau I';
  else if (imc < 40.0) classificacao = 'Obesidade Grau II';
  else classificacao = 'Obesidade Grau III';
  return { imc: parseFloat(imc.toFixed(2)), classificacao };
}

// POST /api/registros - Cadastrar novo registro
app.post('/api/registros', async (req, res) => {
  try {
    const { nome, peso, altura } = req.body;

    if (!nome || !peso || !altura) {
      return res.status(400).json({ erro: 'Nome, peso e altura são obrigatórios.' });
    }

    const { imc, classificacao } = calcularImc(Number(peso), Number(altura));

    const result = await pool.query(
      `INSERT INTO registros_imc (nome, peso, altura, imc, classificacao)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nome, peso, altura, imc, classificacao]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao salvar no banco de dados.' });
  }
});

// GET /api/registros - Listar todos os registros
app.get('/api/registros', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM registros_imc ORDER BY criado_em DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar registros.' });
  }
});

// DELETE /api/registros/:id - Deletar um registro
app.delete('/api/registros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM registros_imc WHERE id = $1', [id]);
    res.json({ mensagem: 'Registro deletado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao deletar registro.' });
  }
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
});
