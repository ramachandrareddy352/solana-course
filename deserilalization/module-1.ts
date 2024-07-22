import * as borsh from '@coral-xyz/borsh'
import * as web3 from '@solana/web3.js'

const connection = new web3.Connection(web3.clusterApiUrl('devnet'))

const programId = new web3.PublicKey("CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN");

const accounts = connection.getProgramAccounts(programId).then(accounts => {
    accounts.map(({ pubkey, account }) => {
        console.log('Account:', pubkey.toBase58())
        console.log('Data buffer:', account.data)
    })
})

console.log("------")
console.log(accounts);