-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "EnsaioTrafoPotencia_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EnsaioTrafoPotencia" ("componenteID", "createdAt", "id", "observacao", "protecaoTransformador1", "protecaoTransformador2", "protecaoTransformador3", "protecaoTransformador4", "protecaoTransformador5", "protecaoTransformador6", "protecaoTransformadorObservacao", "relacaoCalculadaAtBt", "relacaoMedida1", "relacaoMedida2", "relacaoMedida3", "resistenciaIsolamentoAtxBt", "resistenciaIsolamentoAtxMassa", "resistenciaIsolamentoBtxMassa", "resistenciaOhmicaEnrolamentoAt1", "resistenciaOhmicaEnrolamentoAt2", "resistenciaOhmicaEnrolamentoAt3", "resistenciaOhmicaEnrolamentoBt1", "resistenciaOhmicaEnrolamentoBt2", "resistenciaOhmicaEnrolamentoBt3", "responsavelEnsaioMatricula", "tapComutadorAt", "tapComutadorBt", "updatedAt") SELECT "componenteID", "createdAt", "id", "observacao", "protecaoTransformador1", "protecaoTransformador2", "protecaoTransformador3", "protecaoTransformador4", "protecaoTransformador5", "protecaoTransformador6", "protecaoTransformadorObservacao", "relacaoCalculadaAtBt", "relacaoMedida1", "relacaoMedida2", "relacaoMedida3", "resistenciaIsolamentoAtxBt", "resistenciaIsolamentoAtxMassa", "resistenciaIsolamentoBtxMassa", "resistenciaOhmicaEnrolamentoAt1", "resistenciaOhmicaEnrolamentoAt2", "resistenciaOhmicaEnrolamentoAt3", "resistenciaOhmicaEnrolamentoBt1", "resistenciaOhmicaEnrolamentoBt2", "resistenciaOhmicaEnrolamentoBt3", "responsavelEnsaioMatricula", "tapComutadorAt", "tapComutadorBt", "updatedAt" FROM "EnsaioTrafoPotencia";
DROP TABLE "EnsaioTrafoPotencia";
ALTER TABLE "new_EnsaioTrafoPotencia" RENAME TO "EnsaioTrafoPotencia";
CREATE UNIQUE INDEX "EnsaioTrafoPotencia_componenteID_key" ON "EnsaioTrafoPotencia"("componenteID");
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
    CONSTRAINT "Ordem_supervisorMatricula_fkey" FOREIGN KEY ("supervisorMatricula") REFERENCES "Funcionario" ("matricula") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ordem" ("cliente", "contato", "createdAt", "descricaoInicial", "email", "id", "localServico", "nomeResponsavel", "numeroOs", "previsaoInicio", "previsaoTermino", "status", "supervisorMatricula", "updatedAt") SELECT "cliente", "contato", "createdAt", "descricaoInicial", "email", "id", "localServico", "nomeResponsavel", "numeroOs", "previsaoInicio", "previsaoTermino", "status", "supervisorMatricula", "updatedAt" FROM "Ordem";
DROP TABLE "Ordem";
ALTER TABLE "new_Ordem" RENAME TO "Ordem";
CREATE UNIQUE INDEX "Ordem_numeroOs_key" ON "Ordem"("numeroOs");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
