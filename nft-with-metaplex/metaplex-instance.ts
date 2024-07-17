import {Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import * as fs from 'fs';

const connection = new Connection(clusterApiUrl("devnet"));
const wallet = Keypair.generate();

const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      }),
    );
console.log(metaplex);

const buffer = fs.readFileSync("/path/to/image.png");
const file = toMetaplexFile(buffer, "image.png");

const imageUri = await metaplex.storage().upload(file);
console.log(imageUri);

const { uri } = await metaplex.nfts().uploadMetadata({
    name: "My NFT",
    description: "My description",
    image: imageUri,
  });
console.log(uri);

const { nft } = await metaplex.nfts().create(
    {
      uri: uri,
      name: "My NFT",
      sellerFeeBasisPoints: 0,
      isCollection: true
    },
    { commitment: "finalized" },
);
console.log(nft);

const mintAddress = new PublicKey("mintAddress");
console.log(mintAddress);

const updatedNft = await metaplex.nfts().findByMint({ mintAddress});
console.log(updatedNft);

const { response } = await metaplex.nfts().update(
    {
      nftOrSft: updatedNft,
      name: "Updated Name",
      uri: uri,
      sellerFeeBasisPoints: 100,
    },
    { commitment: "finalized" },
);
console.log(response);