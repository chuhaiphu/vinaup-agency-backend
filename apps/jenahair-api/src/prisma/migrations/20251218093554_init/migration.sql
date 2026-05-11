-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourCategory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "videoUrl" TEXT,
    "videoThumbnailUrl" TEXT,
    "videoPosition" TEXT NOT NULL DEFAULT 'bottom',
    "mainImageUrl" TEXT,
    "endpoint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TourCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourCategoryTour" (
    "id" TEXT NOT NULL,
    "tourCategoryId" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TourCategoryTour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "targetType" TEXT,
    "targetId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Vietnam',
    "destinations" TEXT[],
    "endpoint" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationDays" DOUBLE PRECISION NOT NULL DEFAULT 7,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT 'new',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "videoUrl" TEXT,
    "videoThumbnailUrl" TEXT,
    "videoPosition" TEXT NOT NULL DEFAULT 'bottom',
    "mainImageUrl" TEXT,
    "additionalImageUrls" TEXT[],
    "additionalImagesPosition" TEXT NOT NULL DEFAULT 'top',
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AppConfig_key_key" ON "AppConfig"("key");

-- CreateIndex
CREATE UNIQUE INDEX "TourCategory_endpoint_key" ON "TourCategory"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "TourCategory_parentId_sortOrder_key" ON "TourCategory"("parentId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "TourCategoryTour_tourCategoryId_tourId_key" ON "TourCategoryTour"("tourCategoryId", "tourId");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_parentId_sortOrder_key" ON "Menu"("parentId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Tour_endpoint_key" ON "Tour"("endpoint");

-- AddForeignKey
ALTER TABLE "TourCategory" ADD CONSTRAINT "TourCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "TourCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourCategoryTour" ADD CONSTRAINT "TourCategoryTour_tourCategoryId_fkey" FOREIGN KEY ("tourCategoryId") REFERENCES "TourCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourCategoryTour" ADD CONSTRAINT "TourCategoryTour_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
