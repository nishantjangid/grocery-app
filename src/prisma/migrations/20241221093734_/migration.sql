-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_groceryId_fkey";

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_groceryId_fkey" FOREIGN KEY ("groceryId") REFERENCES "Grocery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
