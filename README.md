# 🛠️ Sistema de Gestão de Ordens de Serviço

Este é um sistema backend construído em **Node.js** com **Express** e **Prisma ORM**, utilizado para gerenciar ordens de serviço (OS), técnicos, supervisores e ensaios de componentes em uma empresa que realiza manutenções técnicas.

## 🔐 Autenticação

- Autenticação via **JWT**
- Middleware `verifyToken` protege as rotas autenticadas.
- Tokens têm validade de **8 horas**

---

## 📁 Estrutura de Diretórios

```
.
├── controllers/
│   ├── homeController.js       # Lógica das funcionalidades protegidas
│   └── loginController.js      # Autenticação de usuários
├── routes/
│   ├── homeRoutes.js           # Rotas protegidas (funcionários, OS, componentes)
│   └── loginRoutes.js          # Rota pública de login
├── services/
│   └── homeServices.js         # Regras de negócio (cadastrar, editar, listar, remover)
├── middlewares/
│   └── authMiddleware.js       # Middleware para validar token JWT
├── utils/
│   ├── conferirMatriculas.js   # Validação de acesso por matrícula
│   └── errorHandler.js         # Tratamento centralizado de erros
├── validations/
│   └── schema.js               # Esquemas de validação com Zod (ex: login)
└── .env                        # Contém JWT_SECRET
```

---

## 🧪 Funcionalidades

### Login (`POST /login`)

- Valida usuário e senha
- Retorna token JWT

---

### Funcionários

| Método   | Rota                                            | Ação                                   |
| -------- | ----------------------------------------------- | -------------------------------------- |
| `GET`    | `/home/:matricula/funcionarios`                 | Lista funcionários (Admin/Supervisor)  |
| `POST`   | `/home/:matricula/funcionarios`                 | Cria novo funcionário (Admin)          |
| `PUT`    | `/home/:matricula/funcionarios/:outraMatricula` | Atualiza dados de funcionário          |
| `DELETE` | `/home/:matricula/funcionarios/:outraMatricula` | Remove funcionário (exceto a si mesmo) |
| `GET`    | `/home/:matricula/funcionarios/:outraMatricula` | Detalhes de um funcionário             |

---

### Ordens de Serviço

| Método | Rota                                | Ação                                                                |
| ------ | ----------------------------------- | ------------------------------------------------------------------- |
| `GET`  | `/home/:matricula/ordens`           | Lista OSs visíveis por nível de acesso                              |
| `POST` | `/home/:matricula/ordens`           | Cria nova OS                                                        |
| `PUT`  | `/home/:matricula/ordens/:numeroOs` | Atualiza OS (adicionar/remover técnico, mudar status ou supervisor) |
| `GET`  | `/home/:matricula/ordens/:numeroOs` | Detalhes da OS                                                      |

---

### Componentes e Ensaios

| Método | Rota                                                                 | Ação                                 |
| ------ | -------------------------------------------------------------------- | ------------------------------------ |
| `POST` | `/home/:matricula/ordens/:numeroOs/componentes`                      | Adiciona componente à OS             |
| `PUT`  | `/home/:matricula/ordens/:numeroOs/componentes/:componenteId`        | Atualiza componente                  |
| `GET`  | `/home/:matricula/ordens/:numeroOs/componentes`                      | Lista componentes da OS              |
| `POST` | `/home/:matricula/ordens/:numeroOs/componentes/:componenteId/ensaio` | Registra ensaio de trafo de corrente |

---

## 🧾 Requisitos de Acesso

- `ADMIN`: Acesso total
- `SUPERVISOR`: Gerencia OSs e funcionários sob sua supervisão
- `TECNICO`: Acesso apenas às OSs em que está vinculado

---

## 🧰 Tecnologias Utilizadas

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (sugerido)
- Zod (validação)
- JWT (autenticação)
- dotenv

---

## 🔧 Configuração

1. Clone o repositório
2. Configure o arquivo `.env` com:

```env
JWT_SECRET=seuSegredoJWT
```

3. Gere os modelos Prisma:

```bash
npx prisma generate
```

4. Inicie o servidor:

```bash
npm start
```

---

## ✍️ Autor

Desenvolvido para controle interno de ordens de serviço técnicas, com foco em segurança e controle de acesso.
