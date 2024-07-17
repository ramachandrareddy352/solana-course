import * as web3 from "@solana/web3.js";
require("dotenv").config();
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

/*
We’re going to create a script to ping an onchain program that increments a counter each time it has been pinged. This program exists on the Solana Devnet at address ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa. The program stores its data in a specific account at the address Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod.
*/

// ----- STEPS ----- //
// 1) create a transaction
// 2) create an instruction
// 3) add the instruction to the transaction
// 4) send the transaction

const payer = getKeypairFromEnvironment('SECRET_KEY')
const connection = new web3.Connection(web3.clusterApiUrl('devnet'))

const PING_PROGRAM_ADDRESS = new web3.PublicKey('ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa')
const PING_PROGRAM_DATA_ADDRESS =  new web3.PublicKey('Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod')

const transaction = new web3.Transaction()
const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS)
const pingProgramDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS)

// the instruction needs to include the public key for the Ping program and it also needs to include an array with all the accounts that will be read from or written to. In this example program, only the data account referenced above is needed.

const instruction = new web3.TransactionInstruction({
    keys: [
      {
        pubkey: pingProgramDataId,
        isSigner: false,
        isWritable: true
      },
    ],
    programId
})

transaction.add(instruction)

const signature = await web3.sendAndConfirmTransaction(connection, transaction, [payer]);
console.log(`✅ Transaction completed! Signature is ${signature}`)
// Signature is `MxaiC6JDSdyujicufaXL3hsRSyPBkz7o51YfuGCG8vf3xgRJYLaMUYXnGPLEmBMJgr5qv726rQnHw1g7teSNNe1`