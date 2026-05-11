-- AlterTable
ALTER TABLE "Tour" ADD COLUMN "likes" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Tour" ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "likes" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Blog" ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TourView" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TourView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogView" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourLike" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TourLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogLike" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TourView_tourId_ipAddress_viewedAt_key" ON "TourView"("tourId", "ipAddress", "viewedAt");

-- CreateIndex
CREATE INDEX "TourView_tourId_ipAddress_viewedAt_idx" ON "TourView"("tourId", "ipAddress", "viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogView_blogId_ipAddress_viewedAt_key" ON "BlogView"("blogId", "ipAddress", "viewedAt");

-- CreateIndex
CREATE INDEX "BlogView_blogId_ipAddress_viewedAt_idx" ON "BlogView"("blogId", "ipAddress", "viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TourLike_tourId_ipAddress_key" ON "TourLike"("tourId", "ipAddress");

-- CreateIndex
CREATE INDEX "TourLike_tourId_ipAddress_idx" ON "TourLike"("tourId", "ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "BlogLike_blogId_ipAddress_key" ON "BlogLike"("blogId", "ipAddress");

-- CreateIndex
CREATE INDEX "BlogLike_blogId_ipAddress_idx" ON "BlogLike"("blogId", "ipAddress");

-- AddForeignKey
ALTER TABLE "TourView" ADD CONSTRAINT "TourView_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogView" ADD CONSTRAINT "BlogView_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourLike" ADD CONSTRAINT "TourLike_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogLike" ADD CONSTRAINT "BlogLike_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
