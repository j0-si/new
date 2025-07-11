-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "idLowercase" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caseSensitive" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "accessLimit" INTEGER,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);
