import { createMultisig, createMint, getOrCreateAssociatedTokenAccount, mintTo, getMint } from "@solana/spl-token";
import { getKeypairFromEnvironment} from "@solana-developers/helpers";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
require("dotenv").config();

const user = getKeypairFromEnvironment("SECRET_KEY");;
const connection = new Connection(clusterApiUrl("devnet"));

console.log(`🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`);

const signer1 = Keypair.generate();
const signer2 = Keypair.generate();
const signer3 = Keypair.generate();

console.log(signer1.publicKey.toBase58());
console.log(signer2.publicKey.toBase58());
console.log(signer3.publicKey.toBase58());

const multisigKey = await createMultisig(
    connection,
    user,
    [
      signer1.publicKey,
      signer2.publicKey,
      signer3.publicKey
    ],
    2
);
  
console.log(`Created 2/3 multisig ${multisigKey.toBase58()}`);
// minimum 2 accounts have to accept to confirm the transaction

const mint = await createMint(
    connection,
    user,
    multisigKey,
    multisigKey,
    9
  );

const associatedTokenAccount1 = await getOrCreateAssociatedTokenAccount(connection, user, mint, signer1.publicKey);
const associatedTokenAccount2 = await getOrCreateAssociatedTokenAccount(connection, user, mint, signer1.publicKey);
const associatedTokenAccount3 = await getOrCreateAssociatedTokenAccount(connection, user, mint, signer1.publicKey);


try {
    await mintTo(connection, user, mint, associatedTokenAccount1.address, multisigKey, 1)
} catch (error) {
  console.log(error);
}
// Error: Signature verification failed, One signer is not enough to confirm the transaction

await mintTo(
    connection,
    user,
    mint,
    associatedTokenAccount1.address,
    multisigKey,
    1,
    [
      signer1,
      signer2
    ]
)
// associatedTokenAccount1 will receive the tokens by signing by 1&2 accounts to confirm the transaction

const mintInfo = await getMint(connection, mint)
console.log(`Minted ${mintInfo.supply} token`);
  