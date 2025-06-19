# 📘 API - RELAPRO

[![Node.js](https://img.shields.io/badge/node-%5E18.x-green?style=flat&logo=node.js)](https://nodejs.org/)

[![Express](https://img.shields.io/badge/express.js-%5E4.x-black?style=flat&logo=express)](https://expressjs.com/)

[![Prisma](https://img.shields.io/badge/prisma-ORM-blue?style=flat&logo=prisma)](https://www.prisma.io/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-db-blue?style=flat&logo=postgresql)](https://www.postgresql.org/)

[![Deploy: Render](https://img.shields.io/badge/deploy-Render-%2300c7b7?style=flat&logo=render)](https://render.com/)

Sistema de gerenciamento de Ordens de Serviço (OS) voltado para inspeções e manutenções em subestações elétricas. A aplicação oferece autenticação, controle de usuários, gestão de OS, subestações, componentes, ensaios e equipamentos.

---

## 📁 Estrutura do Projeto

```
backend/
├── controllers/
│ ├── homeController.js
│ └── loginController.js
├── middlewares/
│ ├── authMiddleware.js
│ ├── conferirMatriculaMiddleware.js
│ ├── conferirNivelAcessoMiddleware.js
│ └── homeMiddleware.js
├── routes/
│ ├── homeRoutes.js
│ └── loginRoutes.js
├── services/
│ ├── homeServices.js
│ └── loginServices.js
├── utils/
│ ├── errorHandler.js
│ └── validarRelacionamento.js
├── validations/
│ └── schema.js
└── generated/
└── prisma/
└── index.js
```

---

## 🚀 Funcionalidades Principais

### 🔐 Autenticação

- Login de usuários com JWT.

### 👥 Gestão de Funcionários

- Registro, listagem, atualização, exclusão e busca por matrícula.

### 📝 Gestão de Ordens de Serviço (OS)

- Criação, listagem (por nível de acesso), detalhamento, alteração de status.
- Adição e remoção de técnicos e supervisores.
- Exclusão de ordens.

### 🏭 Gestão de Subestações

- Cadastro, atualização, exclusão e listagem.

### 🔧 Gestão de Componentes e Ensaios

- Adição, atualização e exclusão de componentes e ensaios dentro de OS/subestações.

### 🛠️ Gestão de Equipamentos

- Cadastro, edição, exclusão e listagem de equipamentos.

### 🧾 Outros

- Listagem de logs do sistema (acesso ADMIN).
- Dashboard com informações gerais (baseadas no nível de acesso).

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** – Ambiente de execução JavaScript.
- **Express.js** – Framework para criação de APIs REST.
- **JWT** – Autenticação e autorização.
- **Prisma ORM** – Mapeamento objeto-relacional com PostgreSQL.
- **Zod** – Validação de dados no backend.
- **Multer / Cloudinary (futuramente)** – Para upload de imagens (suporte planejado).

---

## ⚙️ Instalação e Execução Local

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/api-relapro.git
cd api-relapro
```

### 2.Instale as dependências

```bash
npm install
# ou
yarn install

```

### 3. Crie o arquivo .env

```bash
PORT=3000
JWT_SECRET=sua_chave_secreta
DATABASE_URL="postgresql://user:password@host:port/database"
```

Substitua os valores conforme seu ambiente.

### 4. Configure o Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Inicie o servidor

```bash
npm start
# ou
npm run dev
```

O servidor estará disponível em: http://localhost:3000

## 📡 Endpoints da API (Resumo)

### 🔐 Autenticação

- POST /api/login

### 📊 Dashboard

- GET /api/home/:matricula/info

- GET /api/home/:matricula/logs

### 👥 Funcionários

- POST /api/home/:matricula/registrar

- GET /api/home/:matricula/funcionarios

- GET /api/home/:matricula/funcionario/:funcionarioMatricula

- PUT /api/home/:matricula/funcionario/:funcionarioMatricula

- DELETE /api/home/:matricula/funcionario/:funcionarioMatricula

### 📝 Ordens de Serviço (OS)

- POST /api/home/:matricula/ordens

- GET /api/home/:matricula/ordens

- GET /api/home/:matricula/ordens/:numeroOs

- PUT /api/home/:matricula/ordens/:numeroOs

- DELETE /api/home/:matricula/os/:numeroOs

### 🛠️ Equipamentos

- POST /api/home/:matricula/equipamentos

- GET /api/home/:matricula/equipamentos

- PUT /api/home/:matricula/equipamentos/:equipamentoId

- DELETE /api/home/:matricula/equipamentos/:equipamentoId

### 🏭 Subestações

- POST /api/home/:matricula/subestacoes

- GET /api/home/:matricula/subestacoes

- PUT /api/home/:matricula/subestacoes/:subestacaoId

- DELETE /api/home/:matricula/subestacoes/:subestacaoId

### 🔩 Componentes e Ensaios

- POST /api/home/:matricula/ordens/:numeroOs/componentes

- PUT /api/home/:matricula/ordens/:numeroOs/componentes/:componenteId

- DELETE /api/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId

- POST /api/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId/ensaio

- DELETE /api/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId/ensaio/:ensaioId

## 🧪 Testes (opcional)

- Se você quiser incluir testes no futuro, considere Jest ou Vitest com supertest.

## 📄 Licença

Este projeto é de código aberto. Sinta-se à vontade para usar, contribuir e adaptar conforme suas necessidades.
