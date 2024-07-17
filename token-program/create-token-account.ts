import { getOrCreateAssociatedTokenAccount, createAccount, createAssociatedTokenAccount, getMint } from "@solana/spl-token";
import {getExplorerLink, getKeypairFromEnvironment} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
require("dotenv").config();

const connection = new Connection(clusterApiUrl("devnet"));

const user = getKeypairFromEnvironment("SECRET_KEY");
console.log(`🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`);

// Subtitute in your token mint account from create-token-mint.ts
const tokenMintAddress = "2Jc9TrVukwj8P37pQEgia5XiPRBj2MtB1GhQp1krETxa";
const tokenMintPublicKey = new PublicKey(tokenMintAddress);

// Here we are making an associated token account for our own address, but we can make an ATA on any other wallet in devnet!

// --------------------- 1 ---------------------
// getOrCreateAssociatedTokenAccount: This function simplifies the process of ensuring that an associated token account exists for a wallet and token mint. It's useful for applications that need to work with token accounts but don't want to manage the creation process manually.
const tokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,   // who pays fees for this transaction
  tokenMintPublicKey,
  user.publicKey  // owner for th eAssociated token account
);
// (connection: Connection, payer: Signer, mint: PublicKey, owner: PublicKey, allowOwnerOffCurve?: boolean, commitment?: Commitment, confirmOptions?: ConfirmOptions, programId?: PublicKey, associatedTokenProgramId?: PublicKey): Promise<Account>

const link = getExplorerLink("address",tokenAccount.address.toBase58(),"devnet");
console.log(`✅ Created token Account: ${link}`);
// https://explorer.solana.com/address/FF4mh9PUfr3KniYWri2sgDtpUvdFsZTE2TFz5dxYQtDa?cluster=devnet
// Associated token account is created at `FF4mh9PUfr3KniYWri2sgDtpUvdFsZTE2TFz5dxYQtDa`


// --------------------- 2 ---------------------
// createAssociatedTokenAccount: This function is specifically for creating token accounts that adhere to the Associated Token Account (ATA) program. An ATA is a convention that standardizes the mapping of wallet addresses to token accounts, making it easier to manage and interact with tokens.
const tokenAccount2 = await createAssociatedTokenAccount(
  connection,
	user,
	tokenMintPublicKey,
	new PublicKey("AuEHLxepJnFXXFmXhGwXEuroW5t1b3PewGyLMhbDycdn"),
);
console.log(tokenAccount2.toBase58());
// GfnPfT1EQAjgW4QLCMMNQWNXLiCrjxTMfsePtCVVN1fd => token account


// --------------------- 3 ---------------------
// createAccount: This function is a general-purpose account creation function and can be used to create any type of account, not just token accounts.
const tokenAccount3 = await createAccount(
  connection,
  user,
  tokenMintPublicKey,
  new PublicKey("Ezapurmy7RCgNo2F41xSsf6yk5mvtStkoqVQnw9fkaqN"),
)
console.log(tokenAccount3.toBase58());
// 6yfLujpmYKCvShQX7UXrSJjX5AP4BytRsojsmuZVmfF2 => token account

// ------- Read the states of token ----------
const state = await getMint(connection, tokenMintPublicKey);
// address: PublicKey;
// mintAuthority: PublicKey | null;
// supply: bigint;
// decimals: number;
// isInitialized: boolean;
// freezeAuthority: PublicKey | null;
// tlvData: Buffer;

console.log(state);
