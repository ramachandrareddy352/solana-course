import { closeAccount} from "@solana/spl-token";
import {clusterApiUrl, Connection, Keypair, PublicKey} from "@solana/web3.js";

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const wallet = Keypair.generate();

const walletBalance = await connection.getBalance(wallet.publicKey);

console.log(`Balance before unwrapping 1 WSOL: ${walletBalance}`)

const associatedTokenAccount = new PublicKey("YOUR TOKEN ADDRESS");

await closeAccount(connection, wallet, associatedTokenAccount, wallet.publicKey, wallet);

const walletBalancePostClose = await connection.getBalance(wallet.publicKey);

console.log(`Balance after unwrapping 1 WSOL: ${walletBalancePostClose}`)

/*
Balance before unwrapping 1 WSOL: 997950720
Balance after unwrapping 1 WSOL: 1999985000
*/