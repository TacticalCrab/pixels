-- CreateTable
CREATE TABLE "CanvasSnapshots" (
    "id" TEXT NOT NULL,
    "canvasData" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "CanvasSnapshots_id_key" ON "CanvasSnapshots"("id");
