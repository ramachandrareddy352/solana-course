import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { transfer, getAccount } from "@solana/spl-token";
require("dotenv").config();

const connection = new Connection(clusterApiUrl("devnet"));
const sender = getKeypairFromEnvironment("SECRET_KEY");

console.log(`🔑 Loaded our keypair securely, using an env file! Our public key is: ${sender.publicKey.toBase58()}`);

// Add the recipient public key here.
const token_recipient_wallet = new PublicKey("AuEHLxepJnFXXFmXhGwXEuroW5t1b3PewGyLMhbDycdn");
const token_sender_wallet = sender.publicKey;

// token mint account from create-token-mint.ts
const tokenMintAccount = new PublicKey("2Jc9TrVukwj8P37pQEgia5XiPRBj2MtB1GhQp1krETxa");

// Our token has 9 decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 9);

console.log(`💸 Attempting to send 1 token from ${sender.publicKey.toBase58()} to ${token_recipient_wallet.toBase58()}`);

// Get or create the source and destination token accounts to store this token
// if the Associated token accounts are not presend for destination address then create it first
const sourceAssociatedTokenAccount = new PublicKey("FF4mh9PUfr3KniYWri2sgDtpUvdFsZTE2TFz5dxYQtDa");
const destinationAssociatedTokenAccount = new PublicKey("GfnPfT1EQAjgW4QLCMMNQWNXLiCrjxTMfsePtCVVN1fd");

// Transfer the tokens
const signature = await transfer(
  connection,
  sender,
  sourceAssociatedTokenAccount,
  destinationAssociatedTokenAccount,
  sender.publicKey,   // here we have to pass the owner of `sourceAssociatedTokenAccount`
  1 * MINOR_UNITS_PER_MAJOR_UNITS
);
// transfer(connection: Connection, payer: Signer, source: PublicKey, destination: PublicKey, owner: Signer | PublicKey, amount: number | bigint, multiSigners?: Signer[], confirmOptions?: ConfirmOptions, programId?: PublicKey): Promise<TransactionSignature>

const explorerLink = getExplorerLink("transaction", signature, "devnet");
console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}!`);
// Transaction confirmed, explorer link is: https://explorer.solana.com/tx/pm6pdvakMLgYjTvAHWog2EexPB32Qv3yC23iwJC912hAkZTSNT7AuYTXSnVMHYUzhntWX3374evCfG5cTYnq3mW?cluster=devnet!


const sourceData = await getAccount(connection, sourceAssociatedTokenAccount);
console.log(sourceData);

const destinationData = await getAccount(connection, destinationAssociatedTokenAccount);
console.log(destinationData);