import Cors from "cors";
import FantomMunks from "../../../contract/abis/FantomMunks.json";
import { ethers } from "ethers";

export default async function handler(req, res) {
  // Ignore .json extension
  const id = req.query.id.replace(/\D+/g, "");

  await Cors(req, res);

  // Web3 stuff

  const web3 = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_NETWORK_RPC
  );
  // Loading FantomMunks abi
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    FantomMunks,
    web3
  );

  // Check if munk has owner
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
    .catch((err) => {
      res.status(404).json({
        message: "Munk not found yet",
      });
    });
}
