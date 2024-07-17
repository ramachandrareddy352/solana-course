import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL, TransactionSignature } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
console.log(`Connected to solana devnet`)

const address = new PublicKey('4y2GC3ieEJUd1vC3rTPUtfw7Dp6KuYznbqMZVBKiJgKR');
const balance = await connection.getBalance(address);
const balanceInSol = balance / LAMPORTS_PER_SOL;

console.log(`The balance of the account at ${address} is ${balanceInSol} SOL`); 

// to interact with solana/web3js goto `https://solana-labs.github.io/solana-web3.js`

let slot = await connection.getSlot();
console.log(slot);
 
let blockTime = await connection.getBlockTime(slot);
console.log(blockTime);
 