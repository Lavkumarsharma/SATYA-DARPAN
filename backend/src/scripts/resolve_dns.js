const dns = require('dns');
const mongoose = require('mongoose');

const srvRecord = '_mongodb._tcp.satyadarpan.0xflrrn.mongodb.net';

console.log('Resolving SRV records for:', srvRecord);

// Set custom DNS (Google) directly to avoid Windows DNS resolution issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

dns.resolveSrv(srvRecord, async (err, addresses) => {
  if (err) {
    console.error('SRV Resolution Failed:', err);
    process.exit(1);
  }
  await connectToResolved(addresses);
});

async function connectToResolved(addresses) {
  console.log('Resolved Addresses:', addresses);
  // Build standard connection string without specifying replicaSet so driver auto-detects it
  const hosts = addresses.map(addr => `${addr.name}:${addr.port}`).join(',');
  const uri = `mongodb://satya-darpan:satyadarpan@${hosts}/satyadarpan?ssl=true&authSource=admin`;
  
  console.log('Attempting to connect with direct URI:', uri);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('SUCCESS: Connected to Atlas using direct host connection!');
    
    // Save this working URI to .env
    const fs = require('fs');
    const envPath = 'd:\\सत्यदर्पण\\backend\\.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/MONGO_URI=.*/, `MONGO_URI=${uri}`);
    fs.writeFileSync(envPath, envContent);
    console.log('Saved working MONGO_URI to backend/.env!');
    
    process.exit(0);
  } catch (connectErr) {
    console.error('Connection to direct hosts failed:', connectErr.message);
    process.exit(1);
  }
}
