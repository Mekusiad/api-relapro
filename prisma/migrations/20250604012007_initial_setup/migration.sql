-- CreateTable
CREATE TABLE "Funcionario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "matricula" INTEGER NOT NULL,
    "usuario" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "admissao" DATETIME NOT NULL,
    "senha" TEXT NOT NULL,
    "nivelAcesso" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Ordem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numeroOs" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "nomeResponsavel" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "localServico" TEXT NOT NULL,
    "descricaoInicial" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "previsaoInicio" DATETIME NOT NULL,
    "previsaoTermino" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "supervisorMatricula" INTEGER NOT NULL,
    CONSTRAINT "Ordem_supervisorMatricula_fkey" FOREIGN KEY ("supervisorMatricula") REFERENCES "Funcionario" ("matricula") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Componente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeEquipamento" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "tag" TEXT,
    "localizacao" TEXT,
    "modelo" TEXT,
    "fabricante" TEXT,
    "numeroSerie" TEXT,
    "meioIsolante" TEXT,
    "anoFabricacao" INTEGER,
    "massaTotal" REAL,
    "potencia" TEXT,
    "tipoTensaoAt" TEXT,
    "tensaoAt" REAL,
    "tipoTensaoBt" TEXT,
    "tensaoBt" REAL,
    "volumeOleoIsolante" REAL,
    "temperaturaEnsaio" REAL,
    "umidadeRelativaAr" REAL,
    "exatidao" REAL,
    "circuito" REAL,
    "tipoPressao" TEXT,
    "pressao" REAL,
    "orderOs" TEXT NOT NULL,
    CONSTRAINT "Componente_orderOs_fkey" FOREIGN KEY ("orderOs") REFERENCES "Ordem" ("numeroOs") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnsaioTrafoPotencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tapComutadorAt" TEXT NOT NULL,
    "tapComutadorBt" TEXT NOT NULL,
    "relacaoCalculadaAtBt" REAL NOT NULL,
    "relacaoMedida1" REAL NOT NULL,
    "relacaoMedida2" REAL NOT NULL,
    "relacaoMedida3" REAL NOT NULL,
    "resistenciaOhmicaEnrolamentoAt1" REAL NOT NULL,
    "resistenciaOhmicaEnrolamentoAt2" REAL NOT NULL,
    "resistenciaOhmicaEnrolamentoAt3" REAL NOT NULL,
    "resistenciaOhmicaEnrolamentoBt1" REAL NOT NULL,
    "resistenciaOhmicaEnrolamentoBt2" REAL NOT NULL,
    "resistenciaOhmicaEnrolamentoBt3" REAL NOT NULL,
    "resistenciaIsolamentoAtxBt" REAL NOT NULL,
    "resistenciaIsolamentoAtxMassa" REAL NOT NULL,
    "resistenciaIsolamentoBtxMassa" REAL NOT NULL,
    "observacao" TEXT NOT NULL,
    "protecaoTransformador1" TEXT NOT NULL,
    "protecaoTransformador2" TEXT NOT NULL,
    "protecaoTransformador3" TEXT NOT NULL,
    "protecaoTransformador4" TEXT NOT NULL,
    "protecaoTransformador5" TEXT NOT NULL,
    "protecaoTransformador6" TEXT NOT NULL,
    "protecaoTransformadorObservacao" TEXT NOT NULL,
    "ordemOs" TEXT NOT NULL,
    "dispositivoSerie" TEXT NOT NULL,
    CONSTRAINT "EnsaioTrafoPotencia_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EnsaioTrafoPotencia_dispositivoSerie_fkey" FOREIGN KEY ("dispositivoSerie") REFERENCES "Componente" ("numeroSerie") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnsaioTrafoCorrente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "relacaoMedida" REAL NOT NULL,
    "relacaoOhmica" REAL NOT NULL,
    "resistenciaIsolamentoPxS" INTEGER NOT NULL,
    "resistenciaIsolamentoPxMassa" INTEGER NOT NULL,
    "resistenciaIsolamentoSxMassa" INTEGER NOT NULL,
    "observacao" TEXT NOT NULL,
    "ordemOs" TEXT NOT NULL,
    "dispositivoSerie" TEXT NOT NULL,
    CONSTRAINT "EnsaioTrafoCorrente_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EnsaioTrafoCorrente_dispositivoSerie_fkey" FOREIGN KEY ("dispositivoSerie") REFERENCES "Componente" ("numeroSerie") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnsaioDisjuntor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resistenciaContatoDisjuntorFechadoA" REAL NOT NULL,
    "resistenciaContatoDisjuntorFechadoB" REAL NOT NULL,
    "resistenciaContatoDisjuntorFechadoC" REAL NOT NULL,
    "resistenciaContatoDisjuntorAbertoA" REAL NOT NULL,
    "resistenciaContatoDisjuntorAbertoB" REAL NOT NULL,
    "resistenciaContatoDisjuntorAbertoC" REAL NOT NULL,
    "resistenciaIsolamentoAxMassa" REAL NOT NULL,
    "resistenciaIsolamentoBxMassa" REAL NOT NULL,
    "resistenciaIsolamentoCxMassa" REAL NOT NULL,
    "servico1" BOOLEAN NOT NULL,
    "servico2" BOOLEAN NOT NULL,
    "servico3" BOOLEAN NOT NULL,
    "servico4" BOOLEAN NOT NULL,
    "observacao" TEXT NOT NULL,
    "ordemOs" TEXT NOT NULL,
    "dispositivoSerie" TEXT NOT NULL,
    CONSTRAINT "EnsaioDisjuntor_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EnsaioDisjuntor_dispositivoSerie_fkey" FOREIGN KEY ("dispositivoSerie") REFERENCES "Componente" ("numeroSerie") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MalhaAterramento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resistenciaMalhaAterramento" TEXT,
    "servico1" TEXT,
    "servico2" TEXT,
    "servico3" TEXT,
    "observacao" TEXT,
    "ordemOs" TEXT NOT NULL,
    CONSTRAINT "MalhaAterramento_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnsaioResistorAterramento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resistenciaOhmicaMedida" REAL NOT NULL,
    "resistenciaIsolamento" REAL NOT NULL,
    "observacao" TEXT NOT NULL,
    "ordemOs" TEXT NOT NULL,
    "dispositivoSerie" TEXT NOT NULL,
    CONSTRAINT "EnsaioResistorAterramento_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EnsaioResistorAterramento_dispositivoSerie_fkey" FOREIGN KEY ("dispositivoSerie") REFERENCES "Componente" ("numeroSerie") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnsaioChaveSeccionadora" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resistenciaContatoA" REAL NOT NULL,
    "resistenciaContatoB" REAL NOT NULL,
    "resistenciaContatoC" REAL NOT NULL,
    "resistenciaIsolamentoA" REAL NOT NULL,
    "resistenciaIsolamentoB" REAL NOT NULL,
    "resistenciaIsolamentoC" REAL NOT NULL,
    "observacao" TEXT NOT NULL,
    "ordemOs" TEXT NOT NULL,
    CONSTRAINT "EnsaioChaveSeccionadora_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "ensaioTrafoPotenciaId" INTEGER NOT NULL,
    "ensaioTrafoCorrenteId" INTEGER NOT NULL,
    "ensaioDisjuntorId" INTEGER NOT NULL,
    "malhaAterramentoSerie" INTEGER NOT NULL,
    "EnsaioResistorAterramentoId" INTEGER NOT NULL,
    "ensaioChaveSeccionadoraId" INTEGER NOT NULL,
    CONSTRAINT "Equipamento_ensaioTrafoPotenciaId_fkey" FOREIGN KEY ("ensaioTrafoPotenciaId") REFERENCES "EnsaioTrafoPotencia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioTrafoCorrenteId_fkey" FOREIGN KEY ("ensaioTrafoCorrenteId") REFERENCES "EnsaioTrafoCorrente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioDisjuntorId_fkey" FOREIGN KEY ("ensaioDisjuntorId") REFERENCES "EnsaioDisjuntor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_malhaAterramentoSerie_fkey" FOREIGN KEY ("malhaAterramentoSerie") REFERENCES "MalhaAterramento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_EnsaioResistorAterramentoId_fkey" FOREIGN KEY ("EnsaioResistorAterramentoId") REFERENCES "EnsaioResistorAterramento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioChaveSeccionadoraId_fkey" FOREIGN KEY ("ensaioChaveSeccionadoraId") REFERENCES "EnsaioChaveSeccionadora" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TecnicoOrdem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TecnicoOrdem_A_fkey" FOREIGN KEY ("A") REFERENCES "Funcionario" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TecnicoOrdem_B_fkey" FOREIGN KEY ("B") REFERENCES "Ordem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_matricula_key" ON "Funcionario"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Funcionario_usuario_key" ON "Funcionario"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Ordem_numeroOs_key" ON "Ordem"("numeroOs");

-- CreateIndex
CREATE UNIQUE INDEX "Componente_numeroSerie_key" ON "Componente"("numeroSerie");

-- CreateIndex
CREATE UNIQUE INDEX "Equipamento_numeroSerie_key" ON "Equipamento"("numeroSerie");

-- CreateIndex
CREATE UNIQUE INDEX "_TecnicoOrdem_AB_unique" ON "_TecnicoOrdem"("A", "B");

-- CreateIndex
CREATE INDEX "_TecnicoOrdem_B_index" ON "_TecnicoOrdem"("B");
