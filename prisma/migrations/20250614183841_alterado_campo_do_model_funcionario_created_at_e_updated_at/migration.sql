/*
  Warnings:

  - You are about to drop the column `created_at` on the `Funcionario` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Funcionario` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Funcionario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Funcionario" (
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
INSERT INTO "new_Funcionario" ("admissao", "cargo", "id", "matricula", "nivelAcesso", "nome", "senha", "usuario") SELECT "admissao", "cargo", "id", "matricula", "nivelAcesso", "nome", "senha", "usuario" FROM "Funcionario";
DROP TABLE "Funcionario";
ALTER TABLE "new_Funcionario" RENAME TO "Funcionario";
CREATE UNIQUE INDEX "Funcionario_matricula_key" ON "Funcionario"("matricula");
CREATE UNIQUE INDEX "Funcionario_usuario_key" ON "Funcionario"("usuario");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
