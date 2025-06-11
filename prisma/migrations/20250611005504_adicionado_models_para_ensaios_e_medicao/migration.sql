/*
  Warnings:

  - Added the required column `EnsaioFPBuchaId` to the `Equipamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EnsaioFPTrafoId` to the `Equipamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ensaioCorrenteExcitacaoId` to the `Equipamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicaoCaboMuflaId` to the `Equipamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Recomendacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Componente" ADD COLUMN "bitolaCabo" REAL;

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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "EnsaioFPTrafoId" INTEGER NOT NULL,
    "medicaoCaboMuflaId" INTEGER NOT NULL,
    "EnsaioFPBuchaId" INTEGER NOT NULL,
    "ensaioCorrenteExcitacaoId" INTEGER NOT NULL,
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
INSERT INTO "new_Equipamento" ("EnsaioResistorAterramentoId", "createdAt", "descricao", "ensaioChaveSeccionadoraId", "ensaioDisjuntorId", "ensaioTrafoCorrenteId", "ensaioTrafoPotenciaId", "id", "malhaAterramentoSerie", "modelo", "nome", "numeroSerie", "updatedAt") SELECT "EnsaioResistorAterramentoId", "createdAt", "descricao", "ensaioChaveSeccionadoraId", "ensaioDisjuntorId", "ensaioTrafoCorrenteId", "ensaioTrafoPotenciaId", "id", "malhaAterramentoSerie", "modelo", "nome", "numeroSerie", "updatedAt" FROM "Equipamento";
DROP TABLE "Equipamento";
ALTER TABLE "new_Equipamento" RENAME TO "Equipamento";
CREATE UNIQUE INDEX "Equipamento_numeroSerie_key" ON "Equipamento"("numeroSerie");
CREATE TABLE "new_Recomendacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "componenteId" INTEGER NOT NULL,
    "observacao" TEXT NOT NULL,
    "ordemOs" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Recomendacao_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Recomendacao_ordemOs_fkey" FOREIGN KEY ("ordemOs") REFERENCES "Ordem" ("numeroOs") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Recomendacao" ("componenteId", "id", "observacao", "ordemOs") SELECT "componenteId", "id", "observacao", "ordemOs" FROM "Recomendacao";
DROP TABLE "Recomendacao";
ALTER TABLE "new_Recomendacao" RENAME TO "Recomendacao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "MedicaoCaboMufla_componenteID_key" ON "MedicaoCaboMufla"("componenteID");

-- CreateIndex
CREATE UNIQUE INDEX "EnsaioFPTrafo_componenteID_key" ON "EnsaioFPTrafo"("componenteID");

-- CreateIndex
CREATE UNIQUE INDEX "EnsaioFPBucha_componenteID_key" ON "EnsaioFPBucha"("componenteID");

-- CreateIndex
CREATE UNIQUE INDEX "EnsaioCorrenteExcitacao_componenteID_key" ON "EnsaioCorrenteExcitacao"("componenteID");
