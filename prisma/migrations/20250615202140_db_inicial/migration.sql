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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
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
    "supervisorMatricula" INTEGER,
    CONSTRAINT "Ordem_supervisorMatricula_fkey" FOREIGN KEY ("supervisorMatricula") REFERENCES "Funcionario" ("matricula") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Foto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "componenteId" INTEGER NOT NULL,
    "subestacaoId" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "ensaioTrafoPotenciaId" INTEGER NOT NULL,
    "ensaioTrafoCorrenteId" INTEGER NOT NULL,
    "ensaioDisjuntorId" INTEGER NOT NULL,
    "ensaioResistorAterramentoId" INTEGER NOT NULL,
    "ensaioChaveSeccionadoraId" INTEGER NOT NULL,
    "malhaAterramentoId" INTEGER NOT NULL,
    "medicaoCaboMuflaId" INTEGER NOT NULL,
    "ensaioFPTrafoId" INTEGER NOT NULL,
    "ensaioFPBuchaId" INTEGER NOT NULL,
    "ensaioCorrenteExcitacaoId" INTEGER NOT NULL,
    "equipamentoId" INTEGER NOT NULL,
    "recomendacaoId" INTEGER NOT NULL,
    CONSTRAINT "Foto_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_subestacaoId_fkey" FOREIGN KEY ("subestacaoId") REFERENCES "Subestacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioTrafoPotenciaId_fkey" FOREIGN KEY ("ensaioTrafoPotenciaId") REFERENCES "EnsaioTrafoPotencia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioTrafoCorrenteId_fkey" FOREIGN KEY ("ensaioTrafoCorrenteId") REFERENCES "EnsaioTrafoCorrente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioDisjuntorId_fkey" FOREIGN KEY ("ensaioDisjuntorId") REFERENCES "EnsaioDisjuntor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioResistorAterramentoId_fkey" FOREIGN KEY ("ensaioResistorAterramentoId") REFERENCES "EnsaioResistorAterramento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioChaveSeccionadoraId_fkey" FOREIGN KEY ("ensaioChaveSeccionadoraId") REFERENCES "EnsaioChaveSeccionadora" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_malhaAterramentoId_fkey" FOREIGN KEY ("malhaAterramentoId") REFERENCES "MalhaAterramento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_medicaoCaboMuflaId_fkey" FOREIGN KEY ("medicaoCaboMuflaId") REFERENCES "MedicaoCaboMufla" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioFPTrafoId_fkey" FOREIGN KEY ("ensaioFPTrafoId") REFERENCES "EnsaioFPTrafo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioFPBuchaId_fkey" FOREIGN KEY ("ensaioFPBuchaId") REFERENCES "EnsaioFPBucha" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioCorrenteExcitacaoId_fkey" FOREIGN KEY ("ensaioCorrenteExcitacaoId") REFERENCES "EnsaioCorrenteExcitacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "Equipamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_recomendacaoId_fkey" FOREIGN KEY ("recomendacaoId") REFERENCES "Recomendacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subestacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "ordemOs" TEXT NOT NULL,
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
    "localizacao" TEXT,
    "tipo" TEXT NOT NULL,
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
    "bitolaCabo" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "subestacaoId" INTEGER NOT NULL,
    CONSTRAINT "Componente_subestacaoId_fkey" FOREIGN KEY ("subestacaoId") REFERENCES "Subestacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "componenteID" INTEGER NOT NULL,
    "responsavelEnsaioMatricula" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnsaioTrafoPotencia_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "componenteID" INTEGER NOT NULL,
    "responsavelEnsaioMatricula" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnsaioTrafoCorrente_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "componenteID" INTEGER NOT NULL,
    "responsavelEnsaioMatricula" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnsaioDisjuntor_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnsaioResistorAterramento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resistenciaOhmicaMedida" REAL NOT NULL,
    "resistenciaIsolamento" REAL NOT NULL,
    "observacao" TEXT NOT NULL,
    "componenteID" INTEGER NOT NULL,
    "responsavelEnsaioMatricula" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnsaioResistorAterramento_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "subestacaoId" INTEGER NOT NULL,
    "responsavelEnsaioMatricula" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnsaioChaveSeccionadora_subestacaoId_fkey" FOREIGN KEY ("subestacaoId") REFERENCES "Subestacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MalhaAterramento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resistenciaMalhaAterramento" TEXT,
    "servico1" TEXT,
    "servico2" TEXT,
    "servico3" TEXT,
    "observacao" TEXT,
    "subestacaoId" INTEGER NOT NULL,
    "responsavelEnsaioMatricula" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MalhaAterramento_subestacaoId_fkey" FOREIGN KEY ("subestacaoId") REFERENCES "Subestacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MedicaoCaboMufla" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resistenciaIsolamentoX0xMassa" INTEGER NOT NULL,
    "resistenciaIsolamentoX11xMassa" INTEGER NOT NULL,
    "resistenciaIsolamentoX12xMassa" INTEGER NOT NULL,
    "resistenciaIsolamentoX21xMassa" INTEGER NOT NULL,
    "resistenciaIsolamentoX22xMassa" INTEGER NOT NULL,
    "resistenciaIsolamentoX31xMassa" INTEGER NOT NULL,
    "resistenciaIsolamentoX32xMassa" INTEGER NOT NULL,
    "servico1" TEXT NOT NULL,
    "servico2" TEXT NOT NULL,
    "servico3" TEXT NOT NULL,
    "observacao" TEXT NOT NULL,
    "componenteID" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MedicaoCaboMufla_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnsaioFPTrafo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "correnteN1" REAL NOT NULL,
    "correnteN2" REAL NOT NULL,
    "correnteN3" REAL NOT NULL,
    "correnteN4" REAL NOT NULL,
    "correnteN5" REAL NOT NULL,
    "correnteN6" REAL NOT NULL,
    "wattsN1" REAL NOT NULL,
    "wattsN2" REAL NOT NULL,
    "wattsN3" REAL NOT NULL,
    "wattsN4" REAL NOT NULL,
    "wattsN5" REAL NOT NULL,
    "wattsN6" REAL NOT NULL,
    "fatorPotenciaN1" REAL NOT NULL,
    "fatorPotenciaN2" REAL NOT NULL,
    "fatorPotenciaN3" REAL NOT NULL,
    "fatorPotenciaN4" REAL NOT NULL,
    "fatorPotenciaN5" REAL NOT NULL,
    "fatorPotenciaN6" REAL NOT NULL,
    "capacitanciaN1" REAL NOT NULL,
    "capacitanciaN2" REAL NOT NULL,
    "capacitanciaN3" REAL NOT NULL,
    "capacitanciaN4" REAL NOT NULL,
    "capacitanciaN5" REAL NOT NULL,
    "capacitanciaN6" REAL NOT NULL,
    "componenteID" INTEGER NOT NULL,
    CONSTRAINT "EnsaioFPTrafo_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnsaioFPBucha" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "corrente" REAL NOT NULL,
    "watts" REAL NOT NULL,
    "fatorPotencia" REAL NOT NULL,
    "capacitancia" REAL NOT NULL,
    "componenteID" INTEGER NOT NULL,
    CONSTRAINT "EnsaioFPBucha_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnsaioCorrenteExcitacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "correnteH1H3" REAL NOT NULL,
    "correnteH2H1" REAL NOT NULL,
    "correnteH3H2" REAL NOT NULL,
    "componenteID" INTEGER NOT NULL,
    CONSTRAINT "EnsaioCorrenteExcitacao_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "numeroSerie" TEXT NOT NULL,
    "ensaioTrafoPotenciaId" INTEGER,
    "ensaioTrafoCorrenteId" INTEGER,
    "ensaioDisjuntorId" INTEGER,
    "malhaAterramentoSerie" INTEGER,
    "EnsaioResistorAterramentoId" INTEGER,
    "ensaioChaveSeccionadoraId" INTEGER,
    "EnsaioFPTrafoId" INTEGER,
    "medicaoCaboMuflaId" INTEGER,
    "EnsaioFPBuchaId" INTEGER,
    "ensaioCorrenteExcitacaoId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Equipamento_ensaioTrafoPotenciaId_fkey" FOREIGN KEY ("ensaioTrafoPotenciaId") REFERENCES "EnsaioTrafoPotencia" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioTrafoCorrenteId_fkey" FOREIGN KEY ("ensaioTrafoCorrenteId") REFERENCES "EnsaioTrafoCorrente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioDisjuntorId_fkey" FOREIGN KEY ("ensaioDisjuntorId") REFERENCES "EnsaioDisjuntor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_malhaAterramentoSerie_fkey" FOREIGN KEY ("malhaAterramentoSerie") REFERENCES "MalhaAterramento" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_EnsaioResistorAterramentoId_fkey" FOREIGN KEY ("EnsaioResistorAterramentoId") REFERENCES "EnsaioResistorAterramento" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioChaveSeccionadoraId_fkey" FOREIGN KEY ("ensaioChaveSeccionadoraId") REFERENCES "EnsaioChaveSeccionadora" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_EnsaioFPTrafoId_fkey" FOREIGN KEY ("EnsaioFPTrafoId") REFERENCES "EnsaioFPTrafo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_medicaoCaboMuflaId_fkey" FOREIGN KEY ("medicaoCaboMuflaId") REFERENCES "MedicaoCaboMufla" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_EnsaioFPBuchaId_fkey" FOREIGN KEY ("EnsaioFPBuchaId") REFERENCES "EnsaioFPBucha" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioCorrenteExcitacaoId_fkey" FOREIGN KEY ("ensaioCorrenteExcitacaoId") REFERENCES "EnsaioCorrenteExcitacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE UNIQUE INDEX "EnsaioTrafoPotencia_componenteID_key" ON "EnsaioTrafoPotencia"("componenteID");

-- CreateIndex
CREATE UNIQUE INDEX "EnsaioTrafoCorrente_componenteID_key" ON "EnsaioTrafoCorrente"("componenteID");

-- CreateIndex
CREATE UNIQUE INDEX "EnsaioDisjuntor_componenteID_key" ON "EnsaioDisjuntor"("componenteID");

-- CreateIndex
CREATE UNIQUE INDEX "EnsaioResistorAterramento_componenteID_key" ON "EnsaioResistorAterramento"("componenteID");

-- CreateIndex
CREATE UNIQUE INDEX "MedicaoCaboMufla_componenteID_key" ON "MedicaoCaboMufla"("componenteID");

-- CreateIndex
CREATE UNIQUE INDEX "EnsaioFPTrafo_componenteID_key" ON "EnsaioFPTrafo"("componenteID");

-- CreateIndex
CREATE UNIQUE INDEX "EnsaioFPBucha_componenteID_key" ON "EnsaioFPBucha"("componenteID");

-- CreateIndex
CREATE UNIQUE INDEX "EnsaioCorrenteExcitacao_componenteID_key" ON "EnsaioCorrenteExcitacao"("componenteID");

-- CreateIndex
CREATE UNIQUE INDEX "Equipamento_numeroSerie_key" ON "Equipamento"("numeroSerie");

-- CreateIndex
CREATE UNIQUE INDEX "_TecnicoOrdem_AB_unique" ON "_TecnicoOrdem"("A", "B");

-- CreateIndex
CREATE INDEX "_TecnicoOrdem_B_index" ON "_TecnicoOrdem"("B");
