import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";
require("dotenv").config();
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const connection = new Connection(clusterApiUrl("devnet"));
console.log(`Connected to solana devnet`)

const senderKeypair =  getKeypairFromEnvironment("SECRET_KEY");  // enter the SECRET_KEY value in .env file

const sender_address = new PublicKey('4y2GC3ieEJUd1vC3rTPUtfw7Dp6KuYznbqMZVBKiJgKR');
const recipient_address = new PublicKey('AuEHLxepJnFXXFmXhGwXEuroW5t1b3PewGyLMhbDycdn');

const transaction = new Transaction()

const amount = 1;  // 1 sol is transfering

// here we are not ending `SOL` we just creating a instruction to send `SOL`
const sendSolInstruction = SystemProgram.transfer({  
  fromPubkey: sender_address,
  toPubkey: recipient_address,
  lamports: LAMPORTS_PER_SOL * amount
})  // it returns a `TransactionInstruction` object from SystemProgram

transaction.add(sendSolInstruction)

const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
// we can confirm the transaction using multiple keypairs

console.log(`signature : ${signature}`);
// 2eUc9hwubf4m8Kh8SdeH8v3erWQ7rNFjNGJ8wyph3VJXsZLPhfUL27o2ZB1B2Qzj3wTadwwwkxiDFyBZ7w19A7Wy