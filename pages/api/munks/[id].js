import Cors from "cors";
import Web3 from "web3";
import FantomMunks from "../../../contract/abis/FantomMunks.json";

export default async function handler(req, res) {
  // Ignore .json extension
  const id = req.query.id.replace(/\D+/g, "");

  await Cors(req, res);

  // Web3 stuff
  const web3provider = new Web3.providers.HttpProvider(
    process.env.NEXT_PUBLIC_NETWORK_RPC
  );
  const web3 = new Web3(web3provider);
  // Loading FantomMunks abi
  const contract = new web3.eth.Contract(
    FantomMunks,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  );

  // Check if munk has owner
  contract.methods
    .ownerOf(id)
    .call()
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
