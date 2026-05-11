-- CreateTable
CREATE TABLE "DiaryCategory" (
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiaryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryCategoryDiary" (
    "id" TEXT NOT NULL,
    "diaryCategoryId" TEXT NOT NULL,
    "diaryId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DiaryCategoryDiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diary" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Vietnam',
    "destinations" TEXT[],
    "endpoint" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "videoUrl" TEXT,
    "videoThumbnailUrl" TEXT,
    "videoPosition" TEXT NOT NULL DEFAULT 'bottom',
    "mainImageUrl" TEXT,
    "additionalImageUrls" TEXT[],
    "additionalImagesPosition" TEXT NOT NULL DEFAULT 'top',
    "likes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryView" (
    "id" TEXT NOT NULL,
    "diaryId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiaryView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryLike" (
    "id" TEXT NOT NULL,
    "diaryId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiaryLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiaryCategory_endpoint_key" ON "DiaryCategory"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "DiaryCategory_parentId_sortOrder_key" ON "DiaryCategory"("parentId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "DiaryCategoryDiary_diaryCategoryId_diaryId_key" ON "DiaryCategoryDiary"("diaryCategoryId", "diaryId");

-- CreateIndex
CREATE UNIQUE INDEX "Diary_endpoint_key" ON "Diary"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "DiaryView_diaryId_ipAddress_viewedAt_key" ON "DiaryView"("diaryId", "ipAddress", "viewedAt");

-- CreateIndex
CREATE INDEX "DiaryView_diaryId_ipAddress_viewedAt_idx" ON "DiaryView"("diaryId", "ipAddress", "viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DiaryLike_diaryId_ipAddress_key" ON "DiaryLike"("diaryId", "ipAddress");

-- CreateIndex
CREATE INDEX "DiaryLike_diaryId_ipAddress_idx" ON "DiaryLike"("diaryId", "ipAddress");

-- AddForeignKey
ALTER TABLE "DiaryCategory" ADD CONSTRAINT "DiaryCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DiaryCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryCategoryDiary" ADD CONSTRAINT "DiaryCategoryDiary_diaryCategoryId_fkey" FOREIGN KEY ("diaryCategoryId") REFERENCES "DiaryCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryCategoryDiary" ADD CONSTRAINT "DiaryCategoryDiary_diaryId_fkey" FOREIGN KEY ("diaryId") REFERENCES "Diary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diary" ADD CONSTRAINT "Diary_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryView" ADD CONSTRAINT "DiaryView_diaryId_fkey" FOREIGN KEY ("diaryId") REFERENCES "Diary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryLike" ADD CONSTRAINT "DiaryLike_diaryId_fkey" FOREIGN KEY ("diaryId") REFERENCES "Diary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
