-- CreateTable
CREATE TABLE "Recomendacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "componenteId" INTEGER NOT NULL,
    "observacao" TEXT NOT NULL,
    "ordemOs" TEXT NOT NULL,
    CONSTRAINT "Recomendacao_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Recomendacao_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Componente" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ordemOs" TEXT NOT NULL,
    CONSTRAINT "Componente_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Componente" ("anoFabricacao", "circuito", "cliente", "createdAt", "exatidao", "fabricante", "id", "localizacao", "massaTotal", "meioIsolante", "modelo", "nomeEquipamento", "numeroSerie", "ordemOs", "potencia", "pressao", "tag", "temperaturaEnsaio", "tensaoAt", "tensaoBt", "tipo", "tipoPressao", "tipoTensaoAt", "tipoTensaoBt", "umidadeRelativaAr", "updatedAt", "volumeOleoIsolante") SELECT "anoFabricacao", "circuito", "cliente", "createdAt", "exatidao", "fabricante", "id", "localizacao", "massaTotal", "meioIsolante", "modelo", "nomeEquipamento", "numeroSerie", "ordemOs", "potencia", "pressao", "tag", "temperaturaEnsaio", "tensaoAt", "tensaoBt", "tipo", "tipoPressao", "tipoTensaoAt", "tipoTensaoBt", "umidadeRelativaAr", "updatedAt", "volumeOleoIsolante" FROM "Componente";
DROP TABLE "Componente";
ALTER TABLE "new_Componente" RENAME TO "Componente";
CREATE UNIQUE INDEX "Componente_numeroSerie_key" ON "Componente"("numeroSerie");
CREATE TABLE "new_EnsaioChaveSeccionadora" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resistenciaContatoA" REAL NOT NULL,
    "resistenciaContatoB" REAL NOT NULL,
    "resistenciaContatoC" REAL NOT NULL,
    "resistenciaIsolamentoA" REAL NOT NULL,
    "resistenciaIsolamentoB" REAL NOT NULL,
    "resistenciaIsolamentoC" REAL NOT NULL,
    "observacao" TEXT NOT NULL,
    "ordemOs" TEXT NOT NULL,
    "responsavelEnsaioMatricula" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnsaioChaveSeccionadora_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EnsaioChaveSeccionadora" ("createdAt", "id", "observacao", "ordemOs", "resistenciaContatoA", "resistenciaContatoB", "resistenciaContatoC", "resistenciaIsolamentoA", "resistenciaIsolamentoB", "resistenciaIsolamentoC", "responsavelEnsaioMatricula", "updatedAt") SELECT "createdAt", "id", "observacao", "ordemOs", "resistenciaContatoA", "resistenciaContatoB", "resistenciaContatoC", "resistenciaIsolamentoA", "resistenciaIsolamentoB", "resistenciaIsolamentoC", "responsavelEnsaioMatricula", "updatedAt" FROM "EnsaioChaveSeccionadora";
DROP TABLE "EnsaioChaveSeccionadora";
ALTER TABLE "new_EnsaioChaveSeccionadora" RENAME TO "EnsaioChaveSeccionadora";
CREATE TABLE "new_EnsaioDisjuntor" (
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
INSERT INTO "new_EnsaioDisjuntor" ("componenteID", "createdAt", "id", "observacao", "resistenciaContatoDisjuntorAbertoA", "resistenciaContatoDisjuntorAbertoB", "resistenciaContatoDisjuntorAbertoC", "resistenciaContatoDisjuntorFechadoA", "resistenciaContatoDisjuntorFechadoB", "resistenciaContatoDisjuntorFechadoC", "resistenciaIsolamentoAxMassa", "resistenciaIsolamentoBxMassa", "resistenciaIsolamentoCxMassa", "responsavelEnsaioMatricula", "servico1", "servico2", "servico3", "servico4", "updatedAt") SELECT "componenteID", "createdAt", "id", "observacao", "resistenciaContatoDisjuntorAbertoA", "resistenciaContatoDisjuntorAbertoB", "resistenciaContatoDisjuntorAbertoC", "resistenciaContatoDisjuntorFechadoA", "resistenciaContatoDisjuntorFechadoB", "resistenciaContatoDisjuntorFechadoC", "resistenciaIsolamentoAxMassa", "resistenciaIsolamentoBxMassa", "resistenciaIsolamentoCxMassa", "responsavelEnsaioMatricula", "servico1", "servico2", "servico3", "servico4", "updatedAt" FROM "EnsaioDisjuntor";
DROP TABLE "EnsaioDisjuntor";
ALTER TABLE "new_EnsaioDisjuntor" RENAME TO "EnsaioDisjuntor";
CREATE UNIQUE INDEX "EnsaioDisjuntor_componenteID_key" ON "EnsaioDisjuntor"("componenteID");
CREATE TABLE "new_EnsaioResistorAterramento" (
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
INSERT INTO "new_EnsaioResistorAterramento" ("componenteID", "createdAt", "id", "observacao", "resistenciaIsolamento", "resistenciaOhmicaMedida", "responsavelEnsaioMatricula", "updatedAt") SELECT "componenteID", "createdAt", "id", "observacao", "resistenciaIsolamento", "resistenciaOhmicaMedida", "responsavelEnsaioMatricula", "updatedAt" FROM "EnsaioResistorAterramento";
DROP TABLE "EnsaioResistorAterramento";
ALTER TABLE "new_EnsaioResistorAterramento" RENAME TO "EnsaioResistorAterramento";
CREATE UNIQUE INDEX "EnsaioResistorAterramento_componenteID_key" ON "EnsaioResistorAterramento"("componenteID");
CREATE TABLE "new_EnsaioTrafoCorrente" (
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
INSERT INTO "new_EnsaioTrafoCorrente" ("componenteID", "createdAt", "id", "observacao", "relacaoMedida", "relacaoOhmica", "resistenciaIsolamentoPxMassa", "resistenciaIsolamentoPxS", "resistenciaIsolamentoSxMassa", "responsavelEnsaioMatricula", "updatedAt") SELECT "componenteID", "createdAt", "id", "observacao", "relacaoMedida", "relacaoOhmica", "resistenciaIsolamentoPxMassa", "resistenciaIsolamentoPxS", "resistenciaIsolamentoSxMassa", "responsavelEnsaioMatricula", "updatedAt" FROM "EnsaioTrafoCorrente";
DROP TABLE "EnsaioTrafoCorrente";
ALTER TABLE "new_EnsaioTrafoCorrente" RENAME TO "EnsaioTrafoCorrente";
CREATE UNIQUE INDEX "EnsaioTrafoCorrente_componenteID_key" ON "EnsaioTrafoCorrente"("componenteID");
CREATE TABLE "new_EnsaioTrafoPotencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tapComutadorAt" TEXT NOT NULL,
    "tapComutadorBt" TEXT NOT NULL,
    "relacaoCalculadaAtBt" REAL NOT NULL,
    "relacaoMedida1" REAL NOT NULL,
    "relacaoMedida2" REAL NOT NULL,
    "relacaoMedida3" REAL NOT NULL,
    "resistenciaOhmicaEnrolamentoAt1" REAL NOT NULL DEFAULT 0,
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
INSERT INTO "new_EnsaioTrafoPotencia" ("componenteID", "createdAt", "id", "observacao", "protecaoTransformador1", "protecaoTransformador2", "protecaoTransformador3", "protecaoTransformador4", "protecaoTransformador5", "protecaoTransformador6", "protecaoTransformadorObservacao", "relacaoCalculadaAtBt", "relacaoMedida1", "relacaoMedida2", "relacaoMedida3", "resistenciaIsolamentoAtxBt", "resistenciaIsolamentoAtxMassa", "resistenciaIsolamentoBtxMassa", "resistenciaOhmicaEnrolamentoAt1", "resistenciaOhmicaEnrolamentoAt2", "resistenciaOhmicaEnrolamentoAt3", "resistenciaOhmicaEnrolamentoBt1", "resistenciaOhmicaEnrolamentoBt2", "resistenciaOhmicaEnrolamentoBt3", "responsavelEnsaioMatricula", "tapComutadorAt", "tapComutadorBt", "updatedAt") SELECT "componenteID", "createdAt", "id", "observacao", "protecaoTransformador1", "protecaoTransformador2", "protecaoTransformador3", "protecaoTransformador4", "protecaoTransformador5", "protecaoTransformador6", "protecaoTransformadorObservacao", "relacaoCalculadaAtBt", "relacaoMedida1", "relacaoMedida2", "relacaoMedida3", "resistenciaIsolamentoAtxBt", "resistenciaIsolamentoAtxMassa", "resistenciaIsolamentoBtxMassa", "resistenciaOhmicaEnrolamentoAt1", "resistenciaOhmicaEnrolamentoAt2", "resistenciaOhmicaEnrolamentoAt3", "resistenciaOhmicaEnrolamentoBt1", "resistenciaOhmicaEnrolamentoBt2", "resistenciaOhmicaEnrolamentoBt3", "responsavelEnsaioMatricula", "tapComutadorAt", "tapComutadorBt", "updatedAt" FROM "EnsaioTrafoPotencia";
DROP TABLE "EnsaioTrafoPotencia";
ALTER TABLE "new_EnsaioTrafoPotencia" RENAME TO "EnsaioTrafoPotencia";
CREATE UNIQUE INDEX "EnsaioTrafoPotencia_componenteID_key" ON "EnsaioTrafoPotencia"("componenteID");
CREATE TABLE "new_Equipamento" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Equipamento_ensaioTrafoPotenciaId_fkey" FOREIGN KEY ("ensaioTrafoPotenciaId") REFERENCES "EnsaioTrafoPotencia" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioTrafoCorrenteId_fkey" FOREIGN KEY ("ensaioTrafoCorrenteId") REFERENCES "EnsaioTrafoCorrente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioDisjuntorId_fkey" FOREIGN KEY ("ensaioDisjuntorId") REFERENCES "EnsaioDisjuntor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_malhaAterramentoSerie_fkey" FOREIGN KEY ("malhaAterramentoSerie") REFERENCES "MalhaAterramento" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_EnsaioResistorAterramentoId_fkey" FOREIGN KEY ("EnsaioResistorAterramentoId") REFERENCES "EnsaioResistorAterramento" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioChaveSeccionadoraId_fkey" FOREIGN KEY ("ensaioChaveSeccionadoraId") REFERENCES "EnsaioChaveSeccionadora" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Equipamento" ("EnsaioResistorAterramentoId", "createdAt", "descricao", "ensaioChaveSeccionadoraId", "ensaioDisjuntorId", "ensaioTrafoCorrenteId", "ensaioTrafoPotenciaId", "id", "malhaAterramentoSerie", "modelo", "nome", "numeroSerie", "updatedAt") SELECT "EnsaioResistorAterramentoId", "createdAt", "descricao", "ensaioChaveSeccionadoraId", "ensaioDisjuntorId", "ensaioTrafoCorrenteId", "ensaioTrafoPotenciaId", "id", "malhaAterramentoSerie", "modelo", "nome", "numeroSerie", "updatedAt" FROM "Equipamento";
DROP TABLE "Equipamento";
ALTER TABLE "new_Equipamento" RENAME TO "Equipamento";
CREATE UNIQUE INDEX "Equipamento_numeroSerie_key" ON "Equipamento"("numeroSerie");
CREATE TABLE "new_MalhaAterramento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resistenciaMalhaAterramento" TEXT,
    "servico1" TEXT,
    "servico2" TEXT,
    "servico3" TEXT,
    "observacao" TEXT,
    "ordemOs" TEXT NOT NULL,
    "responsavelEnsaioMatricula" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MalhaAterramento_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MalhaAterramento" ("createdAt", "id", "observacao", "ordemOs", "resistenciaMalhaAterramento", "responsavelEnsaioMatricula", "servico1", "servico2", "servico3", "updatedAt") SELECT "createdAt", "id", "observacao", "ordemOs", "resistenciaMalhaAterramento", "responsavelEnsaioMatricula", "servico1", "servico2", "servico3", "updatedAt" FROM "MalhaAterramento";
DROP TABLE "MalhaAterramento";
ALTER TABLE "new_MalhaAterramento" RENAME TO "MalhaAterramento";
CREATE TABLE "new_Ordem" (
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
INSERT INTO "new_Ordem" ("cliente", "contato", "createdAt", "descricaoInicial", "email", "id", "localServico", "nomeResponsavel", "numeroOs", "previsaoInicio", "previsaoTermino", "status", "supervisorMatricula", "updatedAt") SELECT "cliente", "contato", "createdAt", "descricaoInicial", "email", "id", "localServico", "nomeResponsavel", "numeroOs", "previsaoInicio", "previsaoTermino", "status", "supervisorMatricula", "updatedAt" FROM "Ordem";
DROP TABLE "Ordem";
ALTER TABLE "new_Ordem" RENAME TO "Ordem";
CREATE UNIQUE INDEX "Ordem_numeroOs_key" ON "Ordem"("numeroOs");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
