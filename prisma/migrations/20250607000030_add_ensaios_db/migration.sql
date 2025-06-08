/*
  Warnings:

  - You are about to drop the column `dispositivoSerie` on the `EnsaioDisjuntor` table. All the data in the column will be lost.
  - You are about to drop the column `dispositivoSerie` on the `EnsaioResistorAterramento` table. All the data in the column will be lost.
  - You are about to drop the column `dispositivoSerie` on the `EnsaioTrafoCorrente` table. All the data in the column will be lost.
  - You are about to drop the column `dispositivoSerie` on the `EnsaioTrafoPotencia` table. All the data in the column will be lost.
  - Added the required column `componenteID` to the `EnsaioDisjuntor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `componenteID` to the `EnsaioResistorAterramento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `componenteID` to the `EnsaioTrafoCorrente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `componenteID` to the `EnsaioTrafoPotencia` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnsaioDisjuntor_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EnsaioDisjuntor" ("createdAt", "id", "observacao", "resistenciaContatoDisjuntorAbertoA", "resistenciaContatoDisjuntorAbertoB", "resistenciaContatoDisjuntorAbertoC", "resistenciaContatoDisjuntorFechadoA", "resistenciaContatoDisjuntorFechadoB", "resistenciaContatoDisjuntorFechadoC", "resistenciaIsolamentoAxMassa", "resistenciaIsolamentoBxMassa", "resistenciaIsolamentoCxMassa", "servico1", "servico2", "servico3", "servico4", "updatedAt") SELECT "createdAt", "id", "observacao", "resistenciaContatoDisjuntorAbertoA", "resistenciaContatoDisjuntorAbertoB", "resistenciaContatoDisjuntorAbertoC", "resistenciaContatoDisjuntorFechadoA", "resistenciaContatoDisjuntorFechadoB", "resistenciaContatoDisjuntorFechadoC", "resistenciaIsolamentoAxMassa", "resistenciaIsolamentoBxMassa", "resistenciaIsolamentoCxMassa", "servico1", "servico2", "servico3", "servico4", "updatedAt" FROM "EnsaioDisjuntor";
DROP TABLE "EnsaioDisjuntor";
ALTER TABLE "new_EnsaioDisjuntor" RENAME TO "EnsaioDisjuntor";
CREATE UNIQUE INDEX "EnsaioDisjuntor_componenteID_key" ON "EnsaioDisjuntor"("componenteID");
CREATE TABLE "new_EnsaioResistorAterramento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "resistenciaOhmicaMedida" REAL NOT NULL,
    "resistenciaIsolamento" REAL NOT NULL,
    "observacao" TEXT NOT NULL,
    "componenteID" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnsaioResistorAterramento_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EnsaioResistorAterramento" ("createdAt", "id", "observacao", "resistenciaIsolamento", "resistenciaOhmicaMedida", "updatedAt") SELECT "createdAt", "id", "observacao", "resistenciaIsolamento", "resistenciaOhmicaMedida", "updatedAt" FROM "EnsaioResistorAterramento";
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnsaioTrafoCorrente_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EnsaioTrafoCorrente" ("createdAt", "id", "observacao", "relacaoMedida", "relacaoOhmica", "resistenciaIsolamentoPxMassa", "resistenciaIsolamentoPxS", "resistenciaIsolamentoSxMassa", "updatedAt") SELECT "createdAt", "id", "observacao", "relacaoMedida", "relacaoOhmica", "resistenciaIsolamentoPxMassa", "resistenciaIsolamentoPxS", "resistenciaIsolamentoSxMassa", "updatedAt" FROM "EnsaioTrafoCorrente";
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnsaioTrafoPotencia_componenteID_fkey" FOREIGN KEY ("componenteID") REFERENCES "Componente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EnsaioTrafoPotencia" ("createdAt", "id", "observacao", "protecaoTransformador1", "protecaoTransformador2", "protecaoTransformador3", "protecaoTransformador4", "protecaoTransformador5", "protecaoTransformador6", "protecaoTransformadorObservacao", "relacaoCalculadaAtBt", "relacaoMedida1", "relacaoMedida2", "relacaoMedida3", "resistenciaIsolamentoAtxBt", "resistenciaIsolamentoAtxMassa", "resistenciaIsolamentoBtxMassa", "resistenciaOhmicaEnrolamentoAt1", "resistenciaOhmicaEnrolamentoAt2", "resistenciaOhmicaEnrolamentoAt3", "resistenciaOhmicaEnrolamentoBt1", "resistenciaOhmicaEnrolamentoBt2", "resistenciaOhmicaEnrolamentoBt3", "tapComutadorAt", "tapComutadorBt", "updatedAt") SELECT "createdAt", "id", "observacao", "protecaoTransformador1", "protecaoTransformador2", "protecaoTransformador3", "protecaoTransformador4", "protecaoTransformador5", "protecaoTransformador6", "protecaoTransformadorObservacao", "relacaoCalculadaAtBt", "relacaoMedida1", "relacaoMedida2", "relacaoMedida3", "resistenciaIsolamentoAtxBt", "resistenciaIsolamentoAtxMassa", "resistenciaIsolamentoBtxMassa", "resistenciaOhmicaEnrolamentoAt1", "resistenciaOhmicaEnrolamentoAt2", "resistenciaOhmicaEnrolamentoAt3", "resistenciaOhmicaEnrolamentoBt1", "resistenciaOhmicaEnrolamentoBt2", "resistenciaOhmicaEnrolamentoBt3", "tapComutadorAt", "tapComutadorBt", "updatedAt" FROM "EnsaioTrafoPotencia";
DROP TABLE "EnsaioTrafoPotencia";
ALTER TABLE "new_EnsaioTrafoPotencia" RENAME TO "EnsaioTrafoPotencia";
CREATE UNIQUE INDEX "EnsaioTrafoPotencia_componenteID_key" ON "EnsaioTrafoPotencia"("componenteID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
