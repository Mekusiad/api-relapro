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
INSERT INTO "new_Equipamento" ("EnsaioFPBuchaId", "EnsaioFPTrafoId", "EnsaioResistorAterramentoId", "createdAt", "descricao", "ensaioChaveSeccionadoraId", "ensaioCorrenteExcitacaoId", "ensaioDisjuntorId", "ensaioTrafoCorrenteId", "ensaioTrafoPotenciaId", "id", "malhaAterramentoSerie", "medicaoCaboMuflaId", "modelo", "nome", "numeroSerie", "updatedAt") SELECT "EnsaioFPBuchaId", "EnsaioFPTrafoId", "EnsaioResistorAterramentoId", "createdAt", "descricao", "ensaioChaveSeccionadoraId", "ensaioCorrenteExcitacaoId", "ensaioDisjuntorId", "ensaioTrafoCorrenteId", "ensaioTrafoPotenciaId", "id", "malhaAterramentoSerie", "medicaoCaboMuflaId", "modelo", "nome", "numeroSerie", "updatedAt" FROM "Equipamento";
DROP TABLE "Equipamento";
ALTER TABLE "new_Equipamento" RENAME TO "Equipamento";
CREATE UNIQUE INDEX "Equipamento_numeroSerie_key" ON "Equipamento"("numeroSerie");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
