-- CreateTable
CREATE TABLE "SectionUICredentials" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "componentKey" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "propertyFormat" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SectionUICredentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DynamicSectionUI" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "sectionUICredentialsId" TEXT,
    "properties" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DynamicSectionUI_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SectionUICredentials_code_key" ON "SectionUICredentials"("code");

-- CreateIndex
CREATE UNIQUE INDEX "DynamicSectionUI_position_key" ON "DynamicSectionUI"("position");

-- AddForeignKey
ALTER TABLE "DynamicSectionUI" ADD CONSTRAINT "DynamicSectionUI_sectionUICredentialsId_fkey" FOREIGN KEY ("sectionUICredentialsId") REFERENCES "SectionUICredentials"("id") ON DELETE SET NULL ON UPDATE CASCADE;
