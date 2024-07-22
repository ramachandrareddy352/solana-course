import {NATIVE_MINT, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createSyncNativeInstruction, getAccount} from "@solana/spl-token";
import {clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction} from "@solana/web3.js";

(async () => {

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const wallet = Keypair.generate();

const airdropSignature = await connection.requestAirdrop(
  wallet.publicKey,
  2 * LAMPORTS_PER_SOL,
);

await connection.confirmTransaction(airdropSignature);

const associatedTokenAccount = await getAssociatedTokenAddress(
  NATIVE_MINT,
  wallet.publicKey
)

// Create token account to hold your wrapped SOL
const ataTransaction = new Transaction()
  .add(
    createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      associatedTokenAccount,
      wallet.publicKey,
      NATIVE_MINT
    )
  );

await sendAndConfirmTransaction(connection, ataTransaction, [wallet]);

// Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
const solTransferTransaction = new Transaction()
  .add(
    SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: associatedTokenAccount,
        lamports: LAMPORTS_PER_SOL
      }),
      createSyncNativeInstruction(
        associatedTokenAccount
    )
  )

await sendAndConfirmTransaction(connection, solTransferTransaction, [wallet]);

const accountInfo = await getAccount(connection, associatedTokenAccount);

console.log(`Native: ${accountInfo.isNative}, Lamports: ${accountInfo.amount}`);

})();