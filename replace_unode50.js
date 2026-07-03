const { MongoClient } = require("mongodb");
require('dotenv').config({ path: '.env.local' });
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db(); 
    const storeData = db.collection("storeData");
    
    const docs = await storeData.find({}).toArray();
    
    if (docs.length > 0) {
      const dataStr = JSON.stringify(docs[0]);
      const newDataStr = dataStr.replace(/Ser Unode50/gi, "Discover Cielora").replace(/Unode50/gi, "Cielora");
      
      if (newDataStr !== dataStr) {
        const newData = JSON.parse(newDataStr);
        await storeData.replaceOne({ _id: docs[0]._id }, newData);
        console.log("Replaced 'Unode50' with 'Cielora' and updated the DB.");
      } else {
        console.log("No changes made.");
      }
    }
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
