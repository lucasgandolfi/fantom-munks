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
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      GoldenScarletSwords,
      web3
    );

    // Check if sword has owner
    contract
      .ownerOf(id)
      .then(() => {
        // Fetch the munk metadata
        fetch(`${process.env.METADATA_URL}/${id}.json`)
          .then((response) => response.json())
          .then((metadata) => {
            res.status(200).json(metadata);
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      })
      .catch(() => {
        res.status(404).json({
          message: "Sword not found yet!",
        });
      });
  } catch (error) {
    res.status(500).json({ error });
  }
}
