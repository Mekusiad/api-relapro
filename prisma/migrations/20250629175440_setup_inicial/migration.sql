-- CreateTable
CREATE TABLE "Funcionario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "admissao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senha" TEXT NOT NULL,
    "nivelAcesso" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Ordem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numeroOs" TEXT NOT NULL,
    "numeroOrcamento" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "nomeResponsavel" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "localServico" TEXT NOT NULL,
    "descricaoInicial" TEXT NOT NULL,
    "tipoServico" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "previsaoInicio" DATETIME NOT NULL,
    "observacoes" TEXT,
    "conclusao" TEXT,
    "recomendacao" TEXT,
    "previsaoTermino" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "supervisorMatricula" TEXT,
    CONSTRAINT "Ordem_supervisorMatricula_fkey" FOREIGN KEY ("supervisorMatricula") REFERENCES "Funcionario" ("matricula") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Foto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ordemOs" TEXT NOT NULL,
    "componenteId" INTEGER NOT NULL,
    "subestacaoId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "ensaioId" INTEGER NOT NULL,
    "equipamentoId" INTEGER NOT NULL,
    "recomendacaoId" INTEGER NOT NULL,
    CONSTRAINT "Foto_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Foto_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_subestacaoId_fkey" FOREIGN KEY ("subestacaoId") REFERENCES "Subestacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioId_fkey" FOREIGN KEY ("ensaioId") REFERENCES "Ensaio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "Equipamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_recomendacaoId_fkey" FOREIGN KEY ("recomendacaoId") REFERENCES "Recomendacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subestacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "observacoesTecnicasSubestacao" TEXT,
    "ordemOs" TEXT NOT NULL,
    "observacao" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subestacao_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Componente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeEquipamento" TEXT NOT NULL,
    "cliente" TEXT,
    "tag" TEXT,
    "identificacao" TEXT,
    "localizacao" TEXT,
    "tipo" TEXT NOT NULL,
    "modelo" TEXT,
    "fabricante" TEXT,
    "numeroSerie" TEXT,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "meioIsolante" TEXT,
    "anoFabricacao" INTEGER,
    "massaTotal" REAL,
    "potencia" TEXT,
    "correnteNominal" REAL,
    "correntePrimario" REAL,
    "correnteSecundario" REAL,
    "tensaoNominal" REAL,
    "tipoTensaoAt" TEXT,
    "tensaoAt" REAL,
    "tipoTensaoBt" TEXT,
    "tensaoBt" TEXT,
    "volumeOleoIsolante" REAL,
    "temperaturaEnsaio" REAL,
    "impedancia" REAL,
    "frequencia" REAL,
    "umidadeRelativaAr" REAL,
    "exatidao" REAL,
    "circuito" REAL,
    "tipoPressao" TEXT,
    "pressao" REAL,
    "bitolaCabo" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "subestacaoId" INTEGER NOT NULL,
    CONSTRAINT "Componente_subestacaoId_fkey" FOREIGN KEY ("subestacaoId") REFERENCES "Subestacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LogAtividade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "dadosAfetados" JSONB NOT NULL,
    "feitoPor" INTEGER NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Recomendacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "componenteId" INTEGER NOT NULL,
    "observacao" TEXT NOT NULL,
    "subestacaoId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Recomendacao_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Recomendacao_subestacaoId_fkey" FOREIGN KEY ("subestacaoId") REFERENCES "Subestacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ensaio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "dados" JSONB NOT NULL,
    "dataEnsaio" DATETIME,
    "engenheiroResponsavel" TEXT,
    "equipamentosUtilizados" JSONB,
    "componenteId" INTEGER NOT NULL,
    "responsavelMatricula" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ensaio_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ensaio_responsavelMatricula_fkey" FOREIGN KEY ("responsavelMatricula") REFERENCES "Funcionario" ("matricula") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TecnicoOrdem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TecnicoOrdem_A_fkey" FOREIGN KEY ("A") REFERENCES "Funcionario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TecnicoOrdem_B_fkey" FOREIGN KEY ("B") REFERENCES "Ordem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EnsaioToEquipamento" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EnsaioToEquipamento_A_fkey" FOREIGN KEY ("A") REFERENCES "Ensaio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EnsaioToEquipamento_B_fkey" FOREIGN KEY ("B") REFERENCES "Equipamento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_matricula_key" ON "Funcionario"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_usuario_key" ON "Funcionario"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Ordem_numeroOs_key" ON "Ordem"("numeroOs");

-- CreateIndex
CREATE UNIQUE INDEX "Ordem_numeroOrcamento_key" ON "Ordem"("numeroOrcamento");

-- CreateIndex
CREATE UNIQUE INDEX "Equipamento_numeroSerie_key" ON "Equipamento"("numeroSerie");

-- CreateIndex
CREATE UNIQUE INDEX "Ensaio_tipo_componenteId_key" ON "Ensaio"("tipo", "componenteId");

-- CreateIndex
CREATE UNIQUE INDEX "_TecnicoOrdem_AB_unique" ON "_TecnicoOrdem"("A", "B");

-- CreateIndex
CREATE INDEX "_TecnicoOrdem_B_index" ON "_TecnicoOrdem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EnsaioToEquipamento_AB_unique" ON "_EnsaioToEquipamento"("A", "B");

-- CreateIndex
CREATE INDEX "_EnsaioToEquipamento_B_index" ON "_EnsaioToEquipamento"("B");
