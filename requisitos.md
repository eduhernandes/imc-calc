# 📋 Levantamento de Requisitos — IMC Calc

**Projeto:** IMC Calc — Calculadora de Índice de Massa Corporal  
**Versão:** 1.0  
**Data:** 17/08/2026  
**Equipe:** Eduardo Hernandes (Fullstack Developer)  
**Finalidade:** Uso educacional em sala de aula  

---

## 1. Visão Geral do Sistema

O **IMC Calc** é uma aplicação web que permite o cadastro de alunos com seus dados físicos (nome, peso e altura), calcula automaticamente o Índice de Massa Corporal (IMC) de acordo com a fórmula da Organização Mundial da Saúde (OMS), armazena os registros em banco de dados e apresenta o histórico de todos os cálculos realizados.

**Fórmula do IMC:**
```
IMC = Peso (kg) / Altura² (m)
```

---

## 2. Stakeholders

| Papel | Descrição |
|---|---|
| Professor | Utiliza o sistema para demonstrar o cálculo de IMC em sala de aula |
| Aluno | Tem seus dados cadastrados e visualiza o resultado do próprio IMC |
| Desenvolvedor | Responsável pelo desenvolvimento e manutenção do sistema |

---

## 3. Requisitos Funcionais

Requisitos funcionais descrevem **o que o sistema deve fazer**.

| ID | Requisito | Prioridade |
|---|---|---|
| RF01 | O sistema deve permitir o cadastro de um registro contendo nome, peso e altura | Alta |
| RF02 | O sistema deve calcular o IMC automaticamente ao submeter o formulário | Alta |
| RF03 | O sistema deve classificar o IMC conforme a tabela da OMS | Alta |
| RF04 | O sistema deve armazenar os registros em banco de dados PostgreSQL | Alta |
| RF05 | O sistema deve listar todos os registros cadastrados em ordem cronológica decrescente | Alta |
| RF06 | O sistema deve exibir o resultado do IMC imediatamente após o cálculo na tela | Média |
| RF07 | O sistema deve permitir a exclusão de um registro pelo usuário | Média |
| RF08 | O sistema deve exibir a data e hora de cada registro na listagem | Média |
| RF09 | O sistema deve apresentar uma tabela de referência da classificação IMC (OMS) | Baixa |
| RF10 | O sistema deve permitir atualizar a listagem de registros manualmente | Baixa |

---

## 4. Requisitos Não Funcionais

Requisitos não funcionais descrevem **como o sistema deve se comportar**.

| ID | Requisito | Categoria |
|---|---|---|
| RNF01 | A interface deve ser responsiva e funcionar em dispositivos móveis e desktops | Usabilidade |
| RNF02 | O sistema deve responder às requisições em menos de 3 segundos | Desempenho |
| RNF03 | A string de conexão com o banco de dados deve ser armazenada em variável de ambiente (.env), nunca exposta no código-fonte | Segurança |
| RNF04 | O sistema deve utilizar conexão SSL para comunicação com o banco de dados Neon | Segurança |
| RNF05 | A tabela do banco de dados deve ser criada automaticamente na inicialização do servidor | Manutenibilidade |
| RNF06 | O sistema deve ser desenvolvido com tecnologias acessíveis (HTML, CSS, JS puro, Node.js) para fins didáticos | Manutenibilidade |
| RNF07 | A interface deve utilizar design dark mode com bom contraste para leitura em sala de aula (projetor) | Usabilidade |
| RNF08 | O sistema deve tratar e exibir mensagens de erro adequadas ao usuário em caso de falha | Confiabilidade |

---

## 5. Regras de Negócio

| ID | Regra |
|---|---|
| RN01 | O peso deve ser informado em quilogramas (kg), com valores entre 1 e 300 |
| RN02 | A altura deve ser informada em metros (m), com valores entre 0,50 e 2,50 |
| RN03 | O nome do aluno é obrigatório e não pode ficar em branco |
| RN04 | A classificação do IMC segue exclusivamente a tabela da OMS (7 faixas) |
| RN05 | O IMC é calculado e armazenado com 2 casas decimais |
| RN06 | Não é permitido editar um registro após seu cadastro — apenas excluir |

### Tabela de Classificação (OMS)

| Faixa de IMC | Classificação |
|---|---|
| < 18,5 | Abaixo do peso |
| 18,5 – 24,9 | Peso normal |
| 25,0 – 29,9 | Sobrepeso |
| 30,0 – 34,9 | Obesidade Grau I |
| 35,0 – 39,9 | Obesidade Grau II |
| ≥ 40,0 | Obesidade Grau III |

---

## 6. Casos de Uso

### UC01 — Calcular e Registrar IMC

| Campo | Descrição |
|---|---|
| **Ator** | Professor / Aluno |
| **Pré-condição** | O servidor deve estar em execução e conectado ao banco de dados |
| **Fluxo Principal** | 1. Usuário preenche nome, peso e altura no formulário; 2. Usuário clica em "Calcular IMC"; 3. Sistema valida os campos; 4. Sistema calcula o IMC e a classificação; 5. Sistema armazena o registro no banco; 6. Sistema exibe o resultado na tela; 7. Sistema atualiza a tabela de registros |
| **Fluxo Alternativo** | 3a. Se algum campo estiver vazio ou inválido, o sistema exibe mensagem de erro e não prossegue |
| **Pós-condição** | Registro salvo no banco e resultado exibido ao usuário |

---

### UC02 — Visualizar Histórico de Registros

| Campo | Descrição |
|---|---|
| **Ator** | Professor / Aluno |
| **Pré-condição** | Existir ao menos um registro cadastrado |
| **Fluxo Principal** | 1. Ao carregar a página, o sistema busca todos os registros; 2. Sistema exibe a tabela com nome, peso, altura, IMC, classificação e data |
| **Fluxo Alternativo** | 1a. Se não houver registros, o sistema exibe mensagem informativa |
| **Pós-condição** | Tabela exibida com os registros existentes |

---

### UC03 — Excluir Registro

| Campo | Descrição |
|---|---|
| **Ator** | Professor |
| **Pré-condição** | Existir ao menos um registro na tabela |
| **Fluxo Principal** | 1. Usuário clica em "Excluir" em um registro; 2. Sistema solicita confirmação; 3. Usuário confirma; 4. Sistema remove o registro do banco; 5. Sistema atualiza a tabela |
| **Fluxo Alternativo** | 3a. Usuário cancela — nenhuma alteração é feita |
| **Pós-condição** | Registro removido do banco de dados |

---

## 7. Modelo de Dados

### Tabela: `registros_imc`

| Coluna | Tipo | Restrição | Descrição |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Identificador único, gerado automaticamente |
| `nome` | VARCHAR(100) | NOT NULL | Nome do aluno |
| `peso` | NUMERIC(5,2) | NOT NULL | Peso em quilogramas |
| `altura` | NUMERIC(4,2) | NOT NULL | Altura em metros |
| `imc` | NUMERIC(5,2) | NOT NULL | Valor calculado do IMC |
| `classificacao` | VARCHAR(50) | NOT NULL | Classificação OMS correspondente |
| `criado_em` | TIMESTAMP | DEFAULT NOW() | Data e hora do registro |

---

## 8. Interfaces do Sistema

### 8.1 Tela Principal (`/`)

- **Formulário de cadastro:** campos Nome, Peso e Altura
- **Área de resultado:** exibe IMC e classificação com badge colorido após o cálculo
- **Tabela de registros:** histórico com opção de exclusão
- **Tabela de referência OMS:** painel visual para consulta rápida

### 8.2 API REST

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/registros` | Lista todos os registros |
| `POST` | `/api/registros` | Cria um novo registro |
| `DELETE` | `/api/registros/:id` | Remove um registro pelo ID |

---

## 9. Restrições e Limitações

- O sistema **não possui autenticação** — projetado para uso controlado em sala de aula
- Não é possível **editar** registros após o cadastro
- O sistema depende de **conexão com a internet** para acessar o banco Neon
- A string de conexão **não deve ser versionada** no repositório (`.env` no `.gitignore`)

---

## 10. Critérios de Aceitação

| ID | Critério |
|---|---|
| CA01 | Ao preencher nome, peso e altura e clicar em calcular, o IMC deve ser exibido corretamente |
| CA02 | O registro deve aparecer na tabela imediatamente após o cálculo |
| CA03 | A classificação exibida deve estar de acordo com a tabela da OMS |
| CA04 | Ao excluir um registro, ele deve desaparecer da tabela sem recarregar a página |
| CA05 | Campos obrigatórios vazios devem impedir o envio do formulário |
| CA06 | O sistema deve funcionar corretamente em navegadores modernos (Chrome, Firefox, Edge) |

---

> 📝 Documento elaborado para fins **educacionais** — IMC Calc v1.0
