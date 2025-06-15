```markdown
## Estrutura do Projeto

A estrutura do projeto está organizada da seguinte forma:

- **controllers/**
  - `homeController.js`
  - `loginController.js`
- **middlewares/**
  - `authMiddleware.js`
  - `conferirMatriculaMiddleware.js`
  - `conferirNivelAcessoMiddleware.js`
  - `homeMiddleware.js`
- **routes/**
  - `homeRoutes.js`
  - `loginRoutes.js`
- **services/**
  - `homeServices.js`
  - `loginServices.js`
- **utils/**
  - `conferirMatriculas.js` (Não fornecido, mas referenciado)
  - `errorHandler.js` (Não fornecido, mas referenciado)
- **validations/**
  - `schema.js` (Não fornecido, mas referenciado)
- **generated/**
  - **prisma/**
    - `index.js`
```

## Funcionalidades Principais (Baseadas nos arquivos `homeController.js` e `homeServices.js`)

O sistema oferece as seguintes funcionalidades principais:

### Autenticação

- Login de usuários.

### Gestão de Funcionários

- Registro de novos funcionários.
- Listagem de funcionários.
- Atualização de dados de funcionários.
- Exclusão de funcionários.
- Busca de funcionários por matrícula.

### Gestão de Ordens de Serviço (OS)

- Criação de novas ordens de serviço.
- Listagem de ordens de serviço (filtradas por funcionário/supervisor).
- Detalhamento de ordens de serviço por funcionário.
- Atualização do status de ordens de serviço.
- Adicionar e remover técnicos a uma OS.
- Trocar supervisor de uma OS.
- Exclusão de ordens de serviço.

### Gestão de Componentes

- Adicionar componentes a uma OS.
- Atualizar componentes de uma OS.
- Excluir componentes de uma OS.
- Listar componentes de uma subestação.
- Adicionar e excluir ensaios a componentes.

### Gestão de Equipamentos

- Cadastro de novos equipamentos.
- Listagem de equipamentos.
- Atualização de dados de equipamentos.
- Exclusão de equipamentos.

### Gestão de Subestações

- Adicionar novas subestações.
- Remover subestações.
- Atualizar dados de subestações.
- Listar subestações.

### Outros

- Listagem de logs de sistema (acesso restrito a ADMIN).
- Obtenção de informações gerais da "home" (estatísticas de OS baseadas no nível de acesso).

## Tecnologias Utilizadas (Inferidas)

- **Node.js**: Ambiente de execução JavaScript.
- **Express.js**: Framework web para Node.js.
- **JWT (JSON Web Tokens)**: Para autenticação e autorização.
- **Prisma ORM**: Para interação com o banco de dados.
- **Zod**: Para validação de esquemas de dados (inferido pelos arquivos `homeMiddleware.js` e `loginServices.js` que usam `.safeParse()`).

## Configuração e Instalação (Exemplo - Pode variar)

Para configurar e rodar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**

    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd [NOME_DA_PASTA]
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (exemplo):

    ```
    DATABASE_URL="postgresql://user:password@host:port/database"
    JWT_SECRET="sua_chave_secreta_jwt"
    PORT=3000
    ```

    _Substitua os valores pelos dados do seu banco de dados e por uma chave secreta forte para o JWT._

4.  **Configurar e Rodar o Prisma:**
    Certifique-se de que seu banco de dados esteja configurado e que o Prisma possa acessá-lo via `DATABASE_URL`.
    Gere o cliente Prisma:

    ```bash
    npx prisma generate
    ```

    Execute as migrações (se houver):

    ```bash
    npx prisma migrate dev
    ```

5.  **Iniciar o Servidor:**
    ```bash
    npm start
    # ou (se usar nodemon para desenvolvimento)
    npm run dev
    ```

O servidor estará rodando em `http://localhost:PORT` (ou a porta que você configurou).

## Rotas da API (Exemplos)

Abaixo estão alguns exemplos de rotas baseadas nos arquivos `homeRoutes.js` e `loginRoutes.js`. Para a lista completa e detalhes dos parâmetros, consulte os arquivos `homeRoutes.js` e `homeMiddleware.js`.

### Autenticação

- `POST /api/login` - Realiza o login do usuário.

### Home / Dashboard

- `GET /api/home/:matricula/info` - Obtém informações e estatísticas da home para um funcionário.
- `GET /api/home/:matricula/logs` - Lista os logs do sistema (requer nível de acesso ADMIN).

### Funcionários

- `POST /api/home/:matricula/registrar` - Registra um novo funcionário (requer ADMIN).
- `GET /api/home/:matricula/funcionarios` - Lista todos os funcionários (requer ADMIN/SUPERVISOR).
- `GET /api/home/:matricula/funcionario/:funcionarioMatricula` - Busca um funcionário por matrícula(requer ADMIN/SUPERVISOR).
- `PUT /api/home/:matricula/funcionario/:funcionarioMatricula` - Atualiza dados de um funcionário (requer ADMIN).
- `DELETE /api/home/:matricula/funcionario/:funcionarioMatricula` - Exclui um funcionário (requer ADMIN).

### Ordens de Serviço (OS)

- `POST /api/home/:matricula/os` - Cria uma nova OS(requer ADMIN)
- `GET /api/home/:matricula/ordens` - Lista as ordens de serviço de um funcionário.
- `GET /api/home/:matricula/ordens/:numeroOs` - Detalha uma ordem de serviço.
- `PUT /api/home/:matricula/ordens/:numeroOs` - Adiciona/Remove técnico, troca funcionário, atualiza STATUS da OS.
- `DELETE /api/home/:matricula/os/:numeroOs` - Exclui uma OS (requer ADMIN).

### Equipamentos

- `POST /api/home/:matricula/equipamentos` - Cadastra um equipamento (requer ADMIN).
- `GET /api/home/:matricula/equipamentos` - Lista todos os equipamentos.
- `PUT /api/home/:matricula/equipamentos/:equipamentoId` - Atualiza um equipamento (requer ADMIN).
- `DELETE /api/home/:matricula/equipamentos/:equipamentoId` - Exclui um equipamento (requer ADMIN).

### Subestações

- `POST /api/home/:matricula/subestacoes` - Adiciona uma subestação (requer ADMIN).
- `GET /api/home/:matricula/subestacoes` - Lista subestações.
- `PUT /api/home/:matricula/subestacoes/:subestacaoId` - Atualiza dados de uma subestação (requer ADMIN/SUPERVISOR).
- `DELETE /api/home/:matricula/subestacoes/:subestacaoId` - Remove uma subestação (requer ADMIN).

### Componentes e Ensaios

- `POST /api/home/:matricula/ordens/:numeroOs/componentes` - Adiciona um componente a uma OS.
- `PUT /api/home/:matricula/ordens/:numeroOs/componentes/:componenteId` - Atualiza um componente.
- `DELETE /api/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId` - Exclui um componente.
- `POST /api/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId/ensaio` - Adiciona um ensaio a um componente.
- `DELETE /api/home/:matricula/ordens/:numeroOs/subestacoes/:subestacaoId/componentes/:componenteId/ensaio/:ensaioId` - Exclui um ensaio de um componente.

---
