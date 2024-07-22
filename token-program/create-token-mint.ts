import { createMint } from "@solana/spl-token";
import {getExplorerLink, getKeypairFromEnvironment} from "@solana-developers/helpers";
import { Connection, clusterApiUrl } from "@solana/web3.js";
require("dotenv").config();

const user = getKeypairFromEnvironment("SECRET_KEY");;
const connection = new Connection(clusterApiUrl("devnet"));

console.log(`🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`);

// Token Mints are accounts that define a specific token address that are created
const tokenMintAddress = await createMint(connection, user, user.publicKey, user.publicKey, 9);
// createMint(connection: Connection, payer: Signer, mintAuthority: PublicKey, freezeAuthority: PublicKey | null, decimals: number, keypair?: Keypair, confirmOptions?: ConfirmOptions, programId?: PublicKey): Promise<PublicKey>;
// NOTE: if we use decimals as `0` then it is non-fungible token

// payer - the public key of the payer for the transaction
// mintAuthority - the account that is authorized to do the actual minting of tokens from the token mint.
// freezeAuthority - an account authorized to freeze the tokens in a token account. If freezing is not a desired attribute, the parameter can be set to null

const link = getExplorerLink("address", tokenMintAddress.toString(), "devnet");
console.log(`Created a token on solana development network: ${link}`);
// https://explorer.solana.com/address/2Jc9TrVukwj8P37pQEgia5XiPRBj2MtB1GhQp1krETxa?cluster=devnet

// token is created at address => 2Jc9TrVukwj8P37pQEgia5XiPRBj2MtB1GhQp1krETxa
// `4y2GC3ieEJUd1vC3rTPUtfw7Dp6KuYznbqMZVBKiJgKR` this address has power to mint the tokens