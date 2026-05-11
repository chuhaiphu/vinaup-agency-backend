-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'landing',
    "description" TEXT,
    "content" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Vietnam',
    "destinations" TEXT[],
    "endpoint" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "videoUrl" TEXT,
    "videoThumbnailUrl" TEXT,
    "videoPosition" TEXT NOT NULL DEFAULT 'bottom',
    "mainImageUrl" TEXT,
    "additionalImageUrls" TEXT[],
    "additionalImagesPosition" TEXT NOT NULL DEFAULT 'top',
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_endpoint_key" ON "Page"("endpoint");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
