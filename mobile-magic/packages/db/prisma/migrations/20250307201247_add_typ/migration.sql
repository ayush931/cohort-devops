-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('MOBILE', 'WEB');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "type" "ProjectType" NOT NULL DEFAULT 'WEB';
