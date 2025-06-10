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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Equipamento_ensaioTrafoPotenciaId_fkey" FOREIGN KEY ("ensaioTrafoPotenciaId") REFERENCES "EnsaioTrafoPotencia" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioTrafoCorrenteId_fkey" FOREIGN KEY ("ensaioTrafoCorrenteId") REFERENCES "EnsaioTrafoCorrente" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioDisjuntorId_fkey" FOREIGN KEY ("ensaioDisjuntorId") REFERENCES "EnsaioDisjuntor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_malhaAterramentoSerie_fkey" FOREIGN KEY ("malhaAterramentoSerie") REFERENCES "MalhaAterramento" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_EnsaioResistorAterramentoId_fkey" FOREIGN KEY ("EnsaioResistorAterramentoId") REFERENCES "EnsaioResistorAterramento" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Equipamento_ensaioChaveSeccionadoraId_fkey" FOREIGN KEY ("ensaioChaveSeccionadoraId") REFERENCES "EnsaioChaveSeccionadora" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Equipamento" ("EnsaioResistorAterramentoId", "createdAt", "descricao", "ensaioChaveSeccionadoraId", "ensaioDisjuntorId", "ensaioTrafoCorrenteId", "ensaioTrafoPotenciaId", "id", "malhaAterramentoSerie", "modelo", "nome", "numeroSerie", "updatedAt") SELECT "EnsaioResistorAterramentoId", "createdAt", "descricao", "ensaioChaveSeccionadoraId", "ensaioDisjuntorId", "ensaioTrafoCorrenteId", "ensaioTrafoPotenciaId", "id", "malhaAterramentoSerie", "modelo", "nome", "numeroSerie", "updatedAt" FROM "Equipamento";
DROP TABLE "Equipamento";
ALTER TABLE "new_Equipamento" RENAME TO "Equipamento";
CREATE UNIQUE INDEX "Equipamento_numeroSerie_key" ON "Equipamento"("numeroSerie");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
