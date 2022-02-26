import Cors from "cors";
import GoldenScarletSwords from "../../../../contract/abis/GoldenScarletSwords.json";
import { ethers } from "ethers";

export default async function handler(req, res) {
  try {
    // Ignore .json extension
    const id = req.query.id.replace(/\D+/g, "");

    await Cors(req, res);

    // Web3 stuff

    const web3 = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_NETWORK_RPC
    );
    // Loading GoldenScarletSwords abi
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_GOLDEN_SCARLET_SWORDS,
      GoldenScarletSwords,
      web3
    );

    // Check if sword has owner
    let owner;
    try {
      owner = await contract.ownerOf(id);
    } catch (err) {
      console.log("ERR", err);
    }

    if (!owner) {
      res.status(404).json({
        message: "nice try",
      });
    }
    const resp = await fetch(
      `${process.env.METADATA_URL_GOLDEN_SCARLET_SWORDS}/${id}.json`.replace(
        "https://gateway.pinata.cloud/ipfs/",
        "https://ipfs.io/ipfs/"
      )
    );
    const metadata = await resp.json();
    res.status(200).json(metadata);
  } catch (error) {
    res.status(500).json({ error });
  }
}
