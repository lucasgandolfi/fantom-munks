import Cors from "cors";
import FantomMunks from "../../../contract/abis/FantomMunks.json";
import { ethers } from "ethers";

export default async function handler(req, res) {
  try {
    await Cors(req, res);

    const web3 = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_NETWORK_RPC
    );
    // Loading FantomMunks abi
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      FantomMunks,
      web3
    );

    const mintPrice = 1;
    const munksToClaim = 10000;
    const munksAvailable = await contract.totalSupply();

    res.status(200).send({
      mintPrice,
      munksToClaim,
      munksAvailable: munksAvailable.toNumber(),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}
