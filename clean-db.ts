import { getDb, saveDb } from "./src/lib/db";

async function cleanPendingOrders() {
  try {
    const db = await getDb();
    if (db.orders) {
      const originalCount = db.orders.length;
      // Filter out ALL pending orders regardless of age for this manual cleanup
      db.orders = db.orders.filter(order => order.status !== "Pending");
      
      const removedCount = originalCount - db.orders.length;
      if (removedCount > 0) {
        await saveDb(db);
        console.log(`Successfully removed ${removedCount} pending orders from the database.`);
      } else {
        console.log("No pending orders found in the database.");
      }
    }
  } catch (err) {
    console.error("Error cleaning database:", err);
  } finally {
    process.exit(0);
  }
}

cleanPendingOrders();
