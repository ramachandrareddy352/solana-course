import {
    clusterApiUrl,
    sendAndConfirmTransaction,
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
} from '@solana/web3.js';
import {
    AccountState,
    createInitializeMintInstruction,
    createInitializeDefaultAccountStateInstruction,
    getMintLen,
    updateDefaultAccountState,
    ExtensionType,
    TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';

(async () => {
    const payer = Keypair.generate();

    const mintAuthority = Keypair.generate();
    const freezeAuthority = Keypair.generate();
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;

    const extensions = [ExtensionType.DefaultAccountState];
    const mintLen = getMintLen(extensions);
    const decimals = 9;

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const defaultState = AccountState.Frozen;

    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);
    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mint,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        // below function froze the accounts funds for not to transfer tokens , but it's possible for anyone to create a new token account and transfer the tokens around.
        createInitializeDefaultAccountStateInstruction(mint, defaultState, TOKEN_2022_PROGRAM_ID),
        createInitializeMintInstruction(
            mint,
            decimals,
            mintAuthority.publicKey,
            freezeAuthority.publicKey,
            TOKEN_2022_PROGRAM_ID
        )
    );
    await sendAndConfirmTransaction(connection, transaction, [payer, mintKeypair], undefined);

    // the freeze authority may sign an update_default_account_state instruction to make all accounts unfrozen by default.
    await updateDefaultAccountState(
        connection,
        payer,
        mint,
        AccountState.Initialized,
        freezeAuthority,
        [],
        undefined,
        TOKEN_2022_PROGRAM_ID
    );
})();