import { mintTo } from "@solana/spl-token";
import { getExplorerLink, getKeypairFromEnvironment} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
require("dotenv").config();

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("SECRET_KEY");

// Our token has 9 decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 9);

// Subtitute in your token mint account from create-token-mint.ts
const tokenMintPublicKey = new PublicKey("2Jc9TrVukwj8P37pQEgia5XiPRBj2MtB1GhQp1krETxa");

// Substitute in your own, or a friend's token account address, from the create-token-account.ts.
const recipientAssociatedTokenAccount = new PublicKey("FF4mh9PUfr3KniYWri2sgDtpUvdFsZTE2TFz5dxYQtDa");

const transactionSignature = await mintTo(
  connection,
  user,  // transaction fee payer
  tokenMintPublicKey,
  recipientAssociatedTokenAccount,  // the token account that tokens will be minted to
  user,  // the account authorized to mint tokens
  100 * MINOR_UNITS_PER_MAJOR_UNITS   // minting 100 tokens to `FF4mh9PUfr3KniYWri2sgDtpUvdFsZTE2TFz5dxYQtDa` token account address who's the owner of that token account is `4y2GC3ieEJUd1vC3rTPUtfw7Dp6KuYznbqMZVBKiJgKR`
);
// mintTo(connection: Connection, payer: Signer, mint: PublicKey, destination: PublicKey, authority: Signer | PublicKey, amount: number | bigint, multiSigners?: Signer[], confirmOptions?: ConfirmOptions, programId?: PublicKey): Promise<TransactionSignature>

const link = getExplorerLink("transaction", transactionSignature, "devnet");
console.log(`Success! Tokens are minted : ${link}`);
// https://explorer.solana.com/tx/3c1bp29HKKHf5B3gycZYFyBYcxF3UjfTPxzG7VjMxSjDdyuMAjLNK9zGovubDRcKujJJXyzVbzoo8rYFocPspMFJ?cluster=devnet

// Tokens inputs
// 4y2GC3ieEJUd1vC3rTPUtfw7Dp6KuYznbqMZVBKiJgKR => user address
// 2Jc9TrVukwj8P37pQEgia5XiPRBj2MtB1GhQp1krETxa => token mint address(program id)
// FF4mh9PUfr3KniYWri2sgDtpUvdFsZTE2TFz5dxYQtDa => token account address(pda)
// TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA => token program address
