import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Connection, clusterApiUrl, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
require("dotenv").config();

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("SECRET_KEY");

console.log(`🔑 We've loaded our keypair securely, Our public key is: ${user.publicKey.toBase58()}`);

const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const tokenMintAccount = new PublicKey("2Jc9TrVukwj8P37pQEgia5XiPRBj2MtB1GhQp1krETxa");

const metadataData = {
  name: "Rama Chandra Reddy",
  symbol: "TAVANAM",
  // Arweave / IPFS / Pinata etc link using metaplex standard for off-chain data
  uri: "https://crypto.com/price/usd-coin",
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
};

const [metadataPDA, bump] = PublicKey.findProgramAddressSync(
  [Buffer.from("metadata"),  TOKEN_METADATA_PROGRAM_ID.toBuffer(), tokenMintAccount.toBuffer()],
  TOKEN_METADATA_PROGRAM_ID
);

const transaction = new Transaction();

const createMetadataAccountInstruction = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: tokenMintAccount,
      mintAuthority: user.publicKey,
      payer: user.publicKey,
      updateAuthority: user.publicKey
    },
    {
      createMetadataAccountArgsV3: {
        data: metadataData,
        isMutable: true,
        collectionDetails: null
      },
    }
);
// createCreateMetadataAccountV3Instruction(accounts: CreateMetadataAccountV3InstructionAccounts, args: CreateMetadataAccountV3InstructionArgs, programId?: PublicKey): TransactionInstruction

transaction.add(createMetadataAccountInstruction);

const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [user]);

const transactionLink = getExplorerLink("transaction", transactionSignature, "devnet");
console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink}!`);
// Transaction confirmed, explorer link is: https://explorer.solana.com/tx/2ryKfSM6gVZcPoJwHqbsdFRUW63Nqu3rXVBjmbV2Buz4EncpaQQZtgFBPEAGCi31MKT2gp12qmyVsj323zFeRJew?cluster=devnet!