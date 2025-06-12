/*
  Warnings:

  - You are about to drop the column `ordemOs` on the `Componente` table. All the data in the column will be lost.
  - You are about to drop the column `ordemOs` on the `EnsaioChaveSeccionadora` table. All the data in the column will be lost.
  - You are about to drop the column `ordemOs` on the `MalhaAterramento` table. All the data in the column will be lost.
  - You are about to drop the column `ordemOs` on the `Recomendacao` table. All the data in the column will be lost.
  - Added the required column `subestacaoId` to the `Componente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subestacaoId` to the `EnsaioChaveSeccionadora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subestacaoId` to the `MalhaAterramento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subestacaoId` to the `Recomendacao` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Subestacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "ordemOs" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subestacao_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE CASCADE ON UPDATE CASCADE
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
    "bitolaCabo" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "subestacaoId" INTEGER NOT NULL,
    CONSTRAINT "Componente_subestacaoId_fkey" FOREIGN KEY ("subestacaoId") REFERENCES "Subestacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Componente" ("anoFabricacao", "bitolaCabo", "circuito", "cliente", "createdAt", "exatidao", "fabricante", "id", "localizacao", "massaTotal", "meioIsolante", "modelo", "nomeEquipamento", "numeroSerie", "potencia", "pressao", "tag", "temperaturaEnsaio", "tensaoAt", "tensaoBt", "tipo", "tipoPressao", "tipoTensaoAt", "tipoTensaoBt", "umidadeRelativaAr", "updatedAt", "volumeOleoIsolante") SELECT "anoFabricacao", "bitolaCabo", "circuito", "cliente", "createdAt", "exatidao", "fabricante", "id", "localizacao", "massaTotal", "meioIsolante", "modelo", "nomeEquipamento", "numeroSerie", "potencia", "pressao", "tag", "temperaturaEnsaio", "tensaoAt", "tensaoBt", "tipo", "tipoPressao", "tipoTensaoAt", "tipoTensaoBt", "umidadeRelativaAr", "updatedAt", "volumeOleoIsolante" FROM "Componente";
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
    "subestacaoId" INTEGER NOT NULL,
    "responsavelEnsaioMatricula" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EnsaioChaveSeccionadora_subestacaoId_fkey" FOREIGN KEY ("subestacaoId") REFERENCES "Subestacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EnsaioChaveSeccionadora" ("createdAt", "id", "observacao", "resistenciaContatoA", "resistenciaContatoB", "resistenciaContatoC", "resistenciaIsolamentoA", "resistenciaIsolamentoB", "resistenciaIsolamentoC", "responsavelEnsaioMatricula", "updatedAt") SELECT "createdAt", "id", "observacao", "resistenciaContatoA", "resistenciaContatoB", "resistenciaContatoC", "resistenciaIsolamentoA", "resistenciaIsolamentoB", "resistenciaIsolamentoC", "responsavelEnsaioMatricula", "updatedAt" FROM "EnsaioChaveSeccionadora";
DROP TABLE "EnsaioChaveSeccionadora";
ALTER TABLE "new_EnsaioChaveSeccionadora" RENAME TO "EnsaioChaveSeccionadora";
CREATE TABLE "new_MalhaAterramento" (
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
INSERT INTO "new_MalhaAterramento" ("createdAt", "id", "observacao", "resistenciaMalhaAterramento", "responsavelEnsaioMatricula", "servico1", "servico2", "servico3", "updatedAt") SELECT "createdAt", "id", "observacao", "resistenciaMalhaAterramento", "responsavelEnsaioMatricula", "servico1", "servico2", "servico3", "updatedAt" FROM "MalhaAterramento";
DROP TABLE "MalhaAterramento";
ALTER TABLE "new_MalhaAterramento" RENAME TO "MalhaAterramento";
CREATE TABLE "new_Recomendacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "componenteId" INTEGER NOT NULL,
    "observacao" TEXT NOT NULL,
    "subestacaoId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Recomendacao_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Recomendacao_subestacaoId_fkey" FOREIGN KEY ("subestacaoId") REFERENCES "Subestacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Recomendacao" ("componenteId", "createdAt", "id", "observacao", "updatedAt") SELECT "componenteId", "createdAt", "id", "observacao", "updatedAt" FROM "Recomendacao";
DROP TABLE "Recomendacao";
ALTER TABLE "new_Recomendacao" RENAME TO "Recomendacao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
