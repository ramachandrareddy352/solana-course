import {
    clusterApiUrl,
    sendAndConfirmTransaction,
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
    createAccount,
    createMint,
    createInitializeImmutableOwnerInstruction,
    createInitializeAccountInstruction,
    getAccountLen,
    ExtensionType,
    TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';

(async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const payer = Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction({ signature: airdropSignature, ...(await connection.getLatestBlockhash()) });

    const mintAuthority = Keypair.generate();
    const decimals = 9;
    const mint = await createMint(
        connection,
        payer,
        mintAuthority.publicKey,
        mintAuthority.publicKey,
        decimals,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
    );

    const accountLen = getAccountLen([ExtensionType.ImmutableOwner]);
    const lamports = await connection.getMinimumBalanceForRentExemption(accountLen);

    const owner = Keypair.generate();
    const accountKeypair = Keypair.generate();
    const account = accountKeypair.publicKey;
    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: account,
            space: accountLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        // creating immutable owner for the new token mint account
        createInitializeImmutableOwnerInstruction(account, TOKEN_2022_PROGRAM_ID),
        createInitializeAccountInstruction(account, mint, owner.publicKey, TOKEN_2022_PROGRAM_ID)
    );
    await sendAndConfirmTransaction(connection, transaction, [payer, accountKeypair], undefined);

    // All associated token accounts have the immutable owner extension included, so it's extremely easy to use the extension.
    const associatedAccount = await createAccount(
        connection,
        payer,
        mint,
        owner.publicKey,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
    );
    console.log(associatedAccount);
})();