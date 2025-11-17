-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinic" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "patientDob" DATETIME NOT NULL,
    "patientMrn" TEXT NOT NULL,
    "icd10" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "episodeId" TEXT NOT NULL,
    "attemptNo" INTEGER NOT NULL,
    "day1Status" TEXT,
    "day2Status" TEXT,
    "day3Status" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "qcReason" TEXT,
    "classification" TEXT,
    "romScore" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Attempt_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SalesRep" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "territory" TEXT NOT NULL,
    "monthlyGoal" INTEGER NOT NULL,
    "aggressiveness" TEXT NOT NULL DEFAULT 'BASE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ClinicAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinic" TEXT NOT NULL,
    "repEmail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClinicAssignment_repEmail_fkey" FOREIGN KEY ("repEmail") REFERENCES "SalesRep" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "repEmail" TEXT,
    "kind" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_repEmail_fkey" FOREIGN KEY ("repEmail") REFERENCES "SalesRep" ("email") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Provider" (
    "npi" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "phone" TEXT,
    "fax" TEXT,
    "email" TEXT,
    "repEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Provider_repEmail_fkey" FOREIGN KEY ("repEmail") REFERENCES "SalesRep" ("email") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProviderNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerNpi" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProviderNote_providerNpi_fkey" FOREIGN KEY ("providerNpi") REFERENCES "Provider" ("npi") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProviderInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerNpi" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProviderInteraction_providerNpi_fkey" FOREIGN KEY ("providerNpi") REFERENCES "Provider" ("npi") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProviderStat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerNpi" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "icd10" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "reimb" INTEGER NOT NULL,
    CONSTRAINT "ProviderStat_providerNpi_fkey" FOREIGN KEY ("providerNpi") REFERENCES "Provider" ("npi") ON DELETE RESTRICT ON UPDATE CASCADE
);
