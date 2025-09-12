
const bcrypt = require("bcrypt");

async function simpleHash(valueToHash) {
   const hashedValue = await bcrypt.hash(valueToHash, 10);
   console.log('hashed: ', hashedValue);
   return hashedValue;
}

simpleHash('xxx');