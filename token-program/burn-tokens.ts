import { burn, getAccount } from "@solana/spl-token";
import { getExplorerLink, getKeypairFromEnvironment} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
require("dotenv").config();

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("SECRET_KEY");

// Our token has 9 decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 9);

// Subtitute in your token mint account from create-token-mint.ts
const tokenMintAccount = new PublicKey("2Jc9TrVukwj8P37pQEgia5XiPRBj2MtB1GhQp1krETxa");

// Substitute in your own, or a friend's token account address, based on the previous step.
const recipientAssociatedTokenAccount = new PublicKey("FF4mh9PUfr3KniYWri2sgDtpUvdFsZTE2TFz5dxYQtDa");

const transactionSignature = await burn(
  connection,
  user,
  recipientAssociatedTokenAccount,
  tokenMintAccount,
  user,   // here we have to pass the owner of `recipientAssociatedTokenAccount`
  1 * MINOR_UNITS_PER_MAJOR_UNITS
);
// burn(connection: Connection, payer: Signer, account: PublicKey, mint: PublicKey, owner: Signer | PublicKey, amount: number | bigint, multiSigners?: Signer[], confirmOptions?: ConfirmOptions, programId?: PublicKey): Promise<TransactionSignature>

const link = getExplorerLink("transaction", transactionSignature, "devnet");
console.log(`✅ Success! Burned Tokens : ${link}`);
// Burned Tokens : https://explorer.solana.com/tx/36LqEe9xCCmo69hi6D5hZpQX5xc1dHvZSVbC3AXvXmRgtBy9U1wHG9mH1usGfBEbSP6fsXbcjKkBw6d5VS6ZPhes?cluster=devnet

const accountData = await getAccount(connection, recipientAssociatedTokenAccount);
console.log(accountData);