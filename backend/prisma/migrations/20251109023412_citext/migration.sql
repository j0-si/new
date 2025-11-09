-- CreateExtension
CREATE EXTENSION IF NOT EXISTS citext;

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "accesses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "authorId" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" CITEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
