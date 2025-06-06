# 📋 Sistema de Gestão de Ordens de Serviço

Sistema backend para controle de ordens de serviço em subestações elétricas, com gerenciamento de funcionários, controle de acesso por níveis e autenticação via JWT.

---

## 🚀 Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL ou MySQL](https://www.postgresql.org/)
- [Zod](https://zod.dev/) — Validações de dados
- [JWT](https://jwt.io/) — Autenticação
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Insomnia](https://insomnia.rest/) — Testes de API

---

## 📁 Estrutura de pastas

```
src/
├── controllers/
│   ├── funcionarioController.js
│   ├── loginController.js
│   ├── ordemController.js
│   └── homeController.js
├── services/
│   ├── funcionarioServices.js
│   ├── ordemServices.js
│   └── homeServices.js
├── middlewares/
│   ├── authMiddleware.js
│   └── nivelAcessoMiddleware.js
├── validations/
│   └── schema.js
├── routes/
│   ├── loginRoutes.js
│   ├── funcionarioRoutes.js
│   ├── ordemRoutes.js
│   └── homeRoutes.js
├── uploads/
├── generated/ (Prisma client)
├── index.js
└── .env
```

---

## 🔑 Níveis de Acesso

- **ADMIN** – acesso total
- **SUPERVISOR** – cria/edita ordens, gerencia técnicos
- **TECNICO** – acesso restrito apenas nas OS na qual foi designado, para inserir dados

---

## 🔐 Autenticação

- JWT (Token expira em 8h)
- Após login, envie o token no header:

```
Authorization: Bearer SEU_TOKEN
```

---

## 📦 Endpoints principais

| Método | Rota                                             | Proteção            | Descrição                                                        |
| ------ | ------------------------------------------------ | ------------------- | ---------------------------------------------------------------- |
| POST   | `/api/login`                                     | ❌                  | Login e geração de token                                         |
| GET    | `/api/home`                                      | ✅                  | Dados do usuário logado                                          |
| GET    | `/api/funcionarios`                              | ✅                  | Lista todos os funcionários                                      |
| GET    | `/api/funcionarios/:id`                          | ✅                  | Detalhes por matrícula                                           |
| POST   | `/api/funcionarios`                              | 🔐 ADMIN/SUPERVISOR | Cadastro                                                         |
| PUT    | `/api/funcionarios/:id`                          | 🔐 ADMIN/SUPERVISOR | Atualização                                                      |
| DELETE | `/api/funcionarios/:id`                          | 🔐 ADMIN/SUPERVISOR | Exclusão                                                         |
| POST   | `/api/ordens`                                    | 🔐 ADMIN/SUPERVISOR | Criação de OS                                                    |
| GET    | `/api/ordens`                                    | ✅                  | Lista todas as OS                                                |
| PUT    | `/api/ordens/:numeroOs`                          | ✅                  | Atualizações por tipo (`add-tecnico`, `trocar-supervisor`, etc.) |
| POST   | `/api/ordens/:numeroOs/componentes`              | ✅                  | Adiciona componente                                              |
| PUT    | `/api/ordens/:numeroOs/componentes/:numeroSerie` | ✅                  | Atualiza componente                                              |

---

## 🧪 Testes com Insomnia

1. Importar o arquivo `rotas-insomnia.json` (fornecido separadamente)
2. Atualizar o valor da variável `{{ token }}` após login

---

## ⚙️ Variáveis de ambiente `.env`

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/banco"
JWT_SECRET="seu_segredo_super_seguro"
PORT=3000
```

---

## 🧰 Scripts úteis

```bash
# Instalar dependências
npm install

# Gerar client do Prisma
npx prisma generate

# Rodar migrations
npx prisma migrate dev

# Iniciar servidor
npm run dev
```

---

## 💬 Exemplo de login

```json
POST /api/login
{
  "usuario": "admin",
  "senha": "admin123"
}
```

---

## 🛠️ Melhorias futuras

- Upload de anexos nas ordens
- Notificações por e-mail
- Painel web com gráficos de OS abertas/concluídas
