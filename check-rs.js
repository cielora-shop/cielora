const { MongoClient } = require('mongodb');

async function check() {
  require('dotenv').config({ path: '.env.local' });
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('admin');
    const result = await db.command({ isMaster: 1 });
    console.log("Replica Set Name:", result.setName);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

check();
