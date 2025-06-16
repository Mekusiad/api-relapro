/*
  Warnings:

  - Added the required column `ensaioId` to the `Foto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Ensaio" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "dados" JSONB NOT NULL,
    "componenteId" INTEGER,
    "responsavelMatricula" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ensaio_componenteId_fkey" FOREIGN KEY ("componenteId") REFERENCES "Componente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Foto" (
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
    "ensaioId" INTEGER NOT NULL,
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
    CONSTRAINT "Foto_ensaioId_fkey" FOREIGN KEY ("ensaioId") REFERENCES "Ensaio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_equipamentoId_fkey" FOREIGN KEY ("equipamentoId") REFERENCES "Equipamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_recomendacaoId_fkey" FOREIGN KEY ("recomendacaoId") REFERENCES "Recomendacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Foto" ("componenteId", "createdAt", "descricao", "ensaioChaveSeccionadoraId", "ensaioCorrenteExcitacaoId", "ensaioDisjuntorId", "ensaioFPBuchaId", "ensaioFPTrafoId", "ensaioResistorAterramentoId", "ensaioTrafoCorrenteId", "ensaioTrafoPotenciaId", "equipamentoId", "fotoUrl", "funcionarioId", "id", "malhaAterramentoId", "medicaoCaboMuflaId", "recomendacaoId", "subestacaoId", "updatedAt") SELECT "componenteId", "createdAt", "descricao", "ensaioChaveSeccionadoraId", "ensaioCorrenteExcitacaoId", "ensaioDisjuntorId", "ensaioFPBuchaId", "ensaioFPTrafoId", "ensaioResistorAterramentoId", "ensaioTrafoCorrenteId", "ensaioTrafoPotenciaId", "equipamentoId", "fotoUrl", "funcionarioId", "id", "malhaAterramentoId", "medicaoCaboMuflaId", "recomendacaoId", "subestacaoId", "updatedAt" FROM "Foto";
DROP TABLE "Foto";
ALTER TABLE "new_Foto" RENAME TO "Foto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Ensaio_tipo_componenteId_key" ON "Ensaio"("tipo", "componenteId");
