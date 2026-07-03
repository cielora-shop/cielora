const { MongoClient } = require("mongodb");
require('dotenv').config({ path: '.env.local' });
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db(); 
    const storeData = db.collection("storeData");
    
    // storeData likely has a single document with all products
    const docs = await storeData.find({}).toArray();
    let unoFound = false;
    let unoCount = 0;
    
    if (docs.length > 0) {
      const data = docs[0];
      const dataStr = JSON.stringify(data);
      if (dataStr.toLowerCase().includes("uno")) {
        console.log("Found 'uno' in storeData!");
        
        // Let's replace 'Unod50' with 'Cielora' and 'UNO' with 'Cielora'
        const newDataStr = dataStr.replace(/Unod50/gi, "Cielora").replace(/UNO de 50/gi, "Cielora").replace(/UNO/g, "Cielora").replace(/uno de 50/gi, "Cielora").replace(/\buno\b/gi, "Cielora");
        
        if (newDataStr !== dataStr) {
          const newData = JSON.parse(newDataStr);
          await storeData.replaceOne({ _id: data._id }, newData);
          console.log("Replaced 'uno' with 'Cielora' and updated the DB.");
        }
      } else {
        console.log("No 'uno' found in storeData.");
      }
    }
    
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
