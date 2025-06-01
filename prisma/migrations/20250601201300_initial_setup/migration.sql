-- CreateTable
CREATE TABLE "Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "registration" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "employeeRole" TEXT NOT NULL,
    "hireDate" DATETIME NOT NULL,
    "password" TEXT NOT NULL,
    "accessLevel" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numberOs" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "localService" TEXT NOT NULL,
    "initialDescription" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "previousInitialDate" DATETIME NOT NULL,
    "finishDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "supervisorRegistration" INTEGER NOT NULL,
    CONSTRAINT "Order_supervisorRegistration_fkey" FOREIGN KEY ("supervisorRegistration") REFERENCES "Employee" ("registration") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "dateHour" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    CONSTRAINT "Activity_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Activity_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    "potentialTransformerId" INTEGER NOT NULL,
    CONSTRAINT "Photo_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Photo_potentialTransformerId_fkey" FOREIGN KEY ("potentialTransformerId") REFERENCES "PotentialTransformer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HighTransformer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameEquipment" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "insulatingMedium" TEXT NOT NULL,
    "yearManufacture" INTEGER NOT NULL,
    "totalMass" REAL NOT NULL,
    "power" TEXT NOT NULL,
    "typeAt" TEXT NOT NULL,
    "tensionAt" REAL NOT NULL,
    "typeBt" TEXT NOT NULL,
    "tensionBt" REAL NOT NULL,
    "volumeIsulationOil" REAL NOT NULL,
    "testTemperature" REAL NOT NULL,
    "relativeHumidity" REAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "HighTransformer_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PotentialTransformer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameEquipment" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "insulatingMedium" TEXT NOT NULL,
    "yearManufacture" INTEGER NOT NULL,
    "totalMass" REAL NOT NULL,
    "power" TEXT NOT NULL,
    "typeAt" TEXT NOT NULL,
    "tensionAt" REAL NOT NULL,
    "typeBt" TEXT NOT NULL,
    "tensionBt" REAL NOT NULL,
    "volumeIsulationOil" REAL NOT NULL,
    "testTemperature" REAL NOT NULL,
    "relativeHumidity" REAL NOT NULL,
    "tapComuAt" TEXT NOT NULL,
    "tapComuBt" TEXT NOT NULL,
    "relationCalculateAtBt" REAL NOT NULL,
    "relationMeasure1" REAL NOT NULL,
    "relationMeasure2" REAL NOT NULL,
    "relationMeasure3" REAL NOT NULL,
    "ohmicResistanceWindingAt1" REAL NOT NULL,
    "ohmicResistanceWindingAt2" REAL NOT NULL,
    "ohmicResistanceWindingAt3" REAL NOT NULL,
    "ohmicResistanceWindingBt1" REAL NOT NULL,
    "ohmicResistanceWindingBt2" REAL NOT NULL,
    "ohmicResistanceWindingBt3" REAL NOT NULL,
    "insulationResistanceAtBt" REAL NOT NULL,
    "insulationResistanceAtMass" REAL NOT NULL,
    "insulationResistanceBtMass" REAL NOT NULL,
    "observation" TEXT NOT NULL,
    "transformerProtection1" BOOLEAN NOT NULL,
    "transformerProtection2" BOOLEAN NOT NULL,
    "transformerProtection3" BOOLEAN NOT NULL,
    "transformerProtection4" BOOLEAN NOT NULL,
    "transformerProtection5" BOOLEAN NOT NULL,
    "transformerProtection6" BOOLEAN NOT NULL,
    "transformerProtectionObservation" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "PotentialTransformer_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StrengthTransformer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameEquipment" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "insulatingMedium" TEXT NOT NULL,
    "yearManufacture" INTEGER NOT NULL,
    "totalMass" REAL NOT NULL,
    "power" TEXT NOT NULL,
    "connectionTypeAt" TEXT NOT NULL,
    "highTension" REAL NOT NULL,
    "connectionTypeBt" TEXT NOT NULL,
    "lowTension" REAL NOT NULL,
    "volumeIsulationOil" REAL NOT NULL,
    "testTemperature" REAL NOT NULL,
    "relativeHumidity" REAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "StrengthTransformer_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CurrentTransformer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameEquipment" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "insulatingMedium" TEXT NOT NULL,
    "maxVoltage" REAL NOT NULL,
    "primaryCurrent" REAL NOT NULL,
    "secondCurrent" REAL NOT NULL,
    "testTemperature" REAL NOT NULL,
    "relativeHumidity" REAL NOT NULL,
    "accuracy" TEXT NOT NULL,
    "yearManufacture" INTEGER NOT NULL,
    "relationMeasure" REAL NOT NULL,
    "relationOhmic" REAL NOT NULL,
    "insulationResistancePxS" INTEGER NOT NULL,
    "insulationResistancePxM" INTEGER NOT NULL,
    "insulationResistanceSxM" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "CurrentTransformer_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CircuitBreaker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameEquipment" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "insulatingMedium" TEXT NOT NULL,
    "nominalTension" REAL NOT NULL,
    "currentTension" REAL NOT NULL,
    "testTemperature" REAL NOT NULL,
    "relativeHumidity" REAL NOT NULL,
    "typePressure" TEXT NOT NULL,
    "pressure" REAL NOT NULL,
    "contactResistanceClosedA" REAL NOT NULL,
    "contactResistanceClosedB" REAL NOT NULL,
    "contactResistanceClosedC" REAL NOT NULL,
    "contactResistanceOpenA" REAL NOT NULL,
    "contactResistanceOpenB" REAL NOT NULL,
    "contactResistanceOpenC" REAL NOT NULL,
    "insulationResistanceAxM" REAL NOT NULL,
    "insulationResistanceBxM" REAL NOT NULL,
    "insulationResistanceCxM" REAL NOT NULL,
    "services1" BOOLEAN NOT NULL,
    "services2" BOOLEAN NOT NULL,
    "services3" BOOLEAN NOT NULL,
    "services4" BOOLEAN NOT NULL,
    "observation" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "CircuitBreaker_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GroundingMesh" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "client" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "resistance" TEXT NOT NULL,
    "service1" BOOLEAN NOT NULL,
    "service2" BOOLEAN NOT NULL,
    "observations" TEXT NOT NULL,
    "yearManufacture" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "GroundingMesh_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GroundingResistor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameEquipment" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "tension" INTEGER NOT NULL,
    "nominalCurrent" INTEGER NOT NULL,
    "testTemperature" REAL NOT NULL,
    "relativeHumidity" REAL NOT NULL,
    "frequency" REAL NOT NULL,
    "totalMass" INTEGER NOT NULL,
    "ohmicResistanceMeasurement" REAL NOT NULL,
    "insulationResistance" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "GroundingResistor_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DisconnectorSwitch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameEquipment" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "nominalTension" REAL NOT NULL,
    "nominalCurrent" REAL NOT NULL,
    "testTemperature" REAL NOT NULL,
    "relativeHumidity" REAL NOT NULL,
    "contactResistanceA" REAL NOT NULL,
    "contactResistanceB" REAL NOT NULL,
    "contactResistanceC" REAL NOT NULL,
    "insulationResistanceA" REAL NOT NULL,
    "insulationResistanceB" REAL NOT NULL,
    "insulationResistanceC" REAL NOT NULL,
    "observation" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "DisconnectorSwitch_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "highTransformerId" INTEGER NOT NULL,
    "potentialTransformerId" INTEGER NOT NULL,
    "strengthTransformerId" INTEGER NOT NULL,
    "currentTransformerId" INTEGER NOT NULL,
    "circuitBreakerId" INTEGER NOT NULL,
    "groundingMeshId" INTEGER NOT NULL,
    "groundingResistorId" INTEGER NOT NULL,
    "disconnectorSwitchId" INTEGER NOT NULL,
    CONSTRAINT "Equipment_groundingMeshId_fkey" FOREIGN KEY ("groundingMeshId") REFERENCES "HighTransformer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipment_potentialTransformerId_fkey" FOREIGN KEY ("potentialTransformerId") REFERENCES "PotentialTransformer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipment_disconnectorSwitchId_fkey" FOREIGN KEY ("disconnectorSwitchId") REFERENCES "StrengthTransformer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipment_currentTransformerId_fkey" FOREIGN KEY ("currentTransformerId") REFERENCES "CurrentTransformer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipment_circuitBreakerId_fkey" FOREIGN KEY ("circuitBreakerId") REFERENCES "CircuitBreaker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipment_groundingMeshId_fkey" FOREIGN KEY ("groundingMeshId") REFERENCES "GroundingMesh" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipment_groundingResistorId_fkey" FOREIGN KEY ("groundingResistorId") REFERENCES "GroundingResistor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Equipment_disconnectorSwitchId_fkey" FOREIGN KEY ("disconnectorSwitchId") REFERENCES "DisconnectorSwitch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TechnicianOrders" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TechnicianOrders_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TechnicianOrders_B_fkey" FOREIGN KEY ("B") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_registration_key" ON "Employee"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_username_key" ON "Employee"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Order_numberOs_key" ON "Order"("numberOs");

-- CreateIndex
CREATE UNIQUE INDEX "HighTransformer_serialNumber_key" ON "HighTransformer"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PotentialTransformer_serialNumber_key" ON "PotentialTransformer"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StrengthTransformer_serialNumber_key" ON "StrengthTransformer"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentTransformer_serialNumber_key" ON "CurrentTransformer"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CircuitBreaker_serialNumber_key" ON "CircuitBreaker"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GroundingResistor_serialNumber_key" ON "GroundingResistor"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DisconnectorSwitch_serialNumber_key" ON "DisconnectorSwitch"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_serialNumber_key" ON "Equipment"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_TechnicianOrders_AB_unique" ON "_TechnicianOrders"("A", "B");

-- CreateIndex
CREATE INDEX "_TechnicianOrders_B_index" ON "_TechnicianOrders"("B");
