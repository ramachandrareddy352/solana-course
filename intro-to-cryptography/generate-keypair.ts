import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();

console.log(`✅ Generated keypair!`)
console.log(`Publickey : ${keypair.publicKey.toBase58()}`);
console.log(`Secretkey : ${keypair.secretKey.toString()}`);


require("dotenv").config();
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const keypair2 = getKeypairFromEnvironment("SECRET_KEY");  // enter the SECRET_KEY value in .env file

console.log(`✅ Finished! We've loaded our secret key securely, using an env file!`);
console.log(`Publickey : ${keypair2.publicKey.toBase58()}`);
console.log(`Secretkey : ${keypair2.secretKey.toString()}`);