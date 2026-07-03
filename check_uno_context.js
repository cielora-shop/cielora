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
      let index = dataStr.toLowerCase().indexOf("uno");
      while (index !== -1) {
        console.log("Match context:", dataStr.substring(index - 20, index + 20));
        index = dataStr.toLowerCase().indexOf("uno", index + 1);
      }
    }
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
