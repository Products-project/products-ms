-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAr" DATETIME NOT NULL
);
INSERT INTO "new_Products" ("createdAt", "description", "id", "name", "price", "updatedAr") SELECT "createdAt", "description", "id", "name", "price", "updatedAr" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE INDEX "Products_active_idx" ON "Products"("active");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
