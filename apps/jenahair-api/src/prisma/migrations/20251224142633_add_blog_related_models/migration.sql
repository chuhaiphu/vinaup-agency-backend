-- CreateTable
CREATE TABLE "BlogCategory" (
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

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategoryBlog" (
    "id" TEXT NOT NULL,
    "blogCategoryId" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BlogCategoryBlog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
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
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_endpoint_key" ON "BlogCategory"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_parentId_sortOrder_key" ON "BlogCategory"("parentId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategoryBlog_blogCategoryId_blogId_key" ON "BlogCategoryBlog"("blogCategoryId", "blogId");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_endpoint_key" ON "Blog"("endpoint");

-- AddForeignKey
ALTER TABLE "BlogCategory" ADD CONSTRAINT "BlogCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategoryBlog" ADD CONSTRAINT "BlogCategoryBlog_blogCategoryId_fkey" FOREIGN KEY ("blogCategoryId") REFERENCES "BlogCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogCategoryBlog" ADD CONSTRAINT "BlogCategoryBlog_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
