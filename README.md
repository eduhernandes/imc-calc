# ⚖️ IMC Calc — Calculadora de Índice de Massa Corporal

Aplicação web para cálculo e registro de IMC (Índice de Massa Corporal), desenvolvida para uso em sala de aula. Permite cadastrar nome, peso e altura dos alunos, calcular o IMC automaticamente e armazenar os registros em banco de dados na nuvem.

---

## 🖥️ Demonstração

> Acesse localmente em: **http://localhost:3000**

---

## 📋 Funcionalidades

- ✅ Cadastro de nome, peso (kg) e altura (m)
- 🧮 Cálculo automático do IMC (`peso / altura²`)
- 🏷️ Classificação conforme tabela da OMS (6 categorias)
- 💾 Armazenamento persistente em banco de dados PostgreSQL (Neon)
- 📋 Listagem de todos os registros com data/hora
- 🗑️ Exclusão individual de registros
- 📊 Tabela de referência da OMS integrada na página

---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia | Versão | Descrição |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | Ambiente de execução JavaScript |
| [Express](https://expressjs.com/) | 4.x | Framework web para API REST |
| [pg](https://node-postgres.com/) | 8.x | Driver PostgreSQL para Node.js |
| [dotenv](https://github.com/motdotla/dotenv) | 16.x | Gerenciamento de variáveis de ambiente |
| [cors](https://github.com/expressjs/cors) | 2.x | Middleware para Cross-Origin Resource Sharing |

### Frontend
| Tecnologia | Descrição |
|---|---|
| HTML5 | Estrutura da interface |
| CSS3 (Vanilla) | Estilização — dark mode, gradientes, animações |
| JavaScript (ES6+) | Lógica do lado do cliente, consumo da API |
| Google Fonts (Inter) | Tipografia moderna |

### Banco de Dados
| Tecnologia | Descrição |
|---|---|
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional |
| [Neon Tech](https://neon.tech/) | Plataforma serverless PostgreSQL na nuvem |

---

## 📁 Estrutura do Projeto

```
imc-calc/
├── server.js          # Servidor Express + rotas da API
├── db.js              # Configuração da conexão com o banco
├── .env               # Variáveis de ambiente (não versionar!)
├── package.json       # Dependências e scripts do projeto
├── README.md          # Documentação do projeto
└── public/
    ├── index.html     # Página principal
    ├── style.css      # Estilos (dark mode)
    └── app.js         # Lógica do frontend
```

---

## 🚀 Como Executar

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior)
- Conta no [Neon Tech](https://neon.tech/) com banco criado

### Passos

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd imc-calc

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Edite o arquivo .env com sua string de conexão Neon:
# DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
# PORT=3000

# 4. Inicie o servidor
npm start
```

Acesse **http://localhost:3000** no navegador.

---

## 🗄️ Banco de Dados

A tabela `registros_imc` é criada automaticamente ao iniciar o servidor.

```sql
CREATE TABLE IF NOT EXISTS registros_imc (
  id           SERIAL PRIMARY KEY,
  nome         VARCHAR(100)  NOT NULL,
  peso         NUMERIC(5,2)  NOT NULL,
  altura       NUMERIC(4,2)  NOT NULL,
  imc          NUMERIC(5,2)  NOT NULL,
  classificacao VARCHAR(50)  NOT NULL,
  criado_em    TIMESTAMP     DEFAULT NOW()
);
```

---

## 📊 Classificação do IMC (OMS)

| IMC | Classificação |
|---|---|
| < 18,5 | Abaixo do peso |
| 18,5 – 24,9 | Peso normal |
| 25,0 – 29,9 | Sobrepeso |
| 30,0 – 34,9 | Obesidade Grau I |
| 35,0 – 39,9 | Obesidade Grau II |
| ≥ 40,0 | Obesidade Grau III |

---

## 👥 Equipe

| Nome | Função |
|---|---|
| Eduardo Hernandes | Fullstack Developer |

---

## 📄 Licença

Este projeto foi desenvolvido para fins **educacionais**.

---

> Feito com ❤️ para uso em sala de aula
