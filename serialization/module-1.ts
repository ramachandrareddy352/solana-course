import * as borsh from '@coral-xyz/borsh'
import * as web3 from '@solana/web3.js'
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
const BN = require('bn.js');
require("dotenv").config();

const equipPlayerSchema = borsh.struct([
  borsh.u8('variant'),
  borsh.u16('playerId'),
  borsh.u256('itemId')
])

const buffer = Buffer.alloc(1000)
equipPlayerSchema.encode({ variant: 2, playerId: 1435, itemId: new BN('737498', 10) }, buffer)

const instructionBuffer = buffer.slice(0, equipPlayerSchema.getSpan(buffer))

const endpoint = web3.clusterApiUrl('devnet')
const connection = new web3.Connection(endpoint)

const senderKeypair =  getKeypairFromEnvironment("SECRET_KEY");  // enter the SECRET_KEY value in .env file

const transaction = new web3.Transaction()
const instruction = new web3.TransactionInstruction({
  keys: [
    {
      pubkey: senderKeypair.publicKey,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: playerInfoAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    }
  ],
  data: instructionBuffer,
  programId: PROGRAM_ID
})

transaction.add(instruction)

web3.sendAndConfirmTransaction(connection, transaction, [senderKeypair]).then((txid) => {
  console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
})