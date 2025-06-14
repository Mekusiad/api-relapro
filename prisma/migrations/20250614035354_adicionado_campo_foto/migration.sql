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
    CONSTRAINT "Foto_ensaioResistorAterramentoId_fkey" FOREIGN KEY ("ensaioResistorAterramentoId") REFERENCES "EnsaioChaveSeccionadora" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_malhaAterramentoId_fkey" FOREIGN KEY ("malhaAterramentoId") REFERENCES "MalhaAterramento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_medicaoCaboMuflaId_fkey" FOREIGN KEY ("medicaoCaboMuflaId") REFERENCES "MedicaoCaboMufla" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioFPTrafoId_fkey" FOREIGN KEY ("ensaioFPTrafoId") REFERENCES "EnsaioFPTrafo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioFPBuchaId_fkey" FOREIGN KEY ("ensaioFPBuchaId") REFERENCES "EnsaioFPBucha" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioCorrenteExcitacaoId_fkey" FOREIGN KEY ("ensaioCorrenteExcitacaoId") REFERENCES "EnsaioCorrenteExcitacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_ensaioCorrenteExcitacaoId_fkey" FOREIGN KEY ("ensaioCorrenteExcitacaoId") REFERENCES "Equipamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Foto_recomendacaoId_fkey" FOREIGN KEY ("recomendacaoId") REFERENCES "Recomendacao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
INSERT INTO "new_EnsaioTrafoPotencia" ("componenteID", "createdAt", "id", "observacao", "protecaoTransformador1", "protecaoTransformador2", "protecaoTransformador3", "protecaoTransformador4", "protecaoTransformador5", "protecaoTransformador6", "protecaoTransformadorObservacao", "relacaoCalculadaAtBt", "relacaoMedida1", "relacaoMedida2", "relacaoMedida3", "resistenciaIsolamentoAtxBt", "resistenciaIsolamentoAtxMassa", "resistenciaIsolamentoBtxMassa", "resistenciaOhmicaEnrolamentoAt1", "resistenciaOhmicaEnrolamentoAt2", "resistenciaOhmicaEnrolamentoAt3", "resistenciaOhmicaEnrolamentoBt1", "resistenciaOhmicaEnrolamentoBt2", "resistenciaOhmicaEnrolamentoBt3", "responsavelEnsaioMatricula", "tapComutadorAt", "tapComutadorBt", "updatedAt") SELECT "componenteID", "createdAt", "id", "observacao", "protecaoTransformador1", "protecaoTransformador2", "protecaoTransformador3", "protecaoTransformador4", "protecaoTransformador5", "protecaoTransformador6", "protecaoTransformadorObservacao", "relacaoCalculadaAtBt", "relacaoMedida1", "relacaoMedida2", "relacaoMedida3", "resistenciaIsolamentoAtxBt", "resistenciaIsolamentoAtxMassa", "resistenciaIsolamentoBtxMassa", "resistenciaOhmicaEnrolamentoAt1", "resistenciaOhmicaEnrolamentoAt2", "resistenciaOhmicaEnrolamentoAt3", "resistenciaOhmicaEnrolamentoBt1", "resistenciaOhmicaEnrolamentoBt2", "resistenciaOhmicaEnrolamentoBt3", "responsavelEnsaioMatricula", "tapComutadorAt", "tapComutadorBt", "updatedAt" FROM "EnsaioTrafoPotencia";
DROP TABLE "EnsaioTrafoPotencia";
ALTER TABLE "new_EnsaioTrafoPotencia" RENAME TO "EnsaioTrafoPotencia";
CREATE UNIQUE INDEX "EnsaioTrafoPotencia_componenteID_key" ON "EnsaioTrafoPotencia"("componenteID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
