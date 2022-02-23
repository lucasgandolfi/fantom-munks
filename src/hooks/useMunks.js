import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { MINT_PRICE } from "../components/munks/MintModal";

import FantomMunksAbi from "../../contract/abis/FantomMunks.json";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const useMunks = (web3, account) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (web3) {
      let c = new ethers.Contract(
        contractAddress,
        FantomMunksAbi,
        web3.getSigner(account)
      );
      setContract(c);
    }
  }, [web3, account]);

  const claim = async (quantity) => {
    if (account && quantity > 0) {
      const price = ethers.utils.parseUnits(String(MINT_PRICE * quantity));
      const tx = await contract.claim(Number(quantity), {
        value: price,
      });
      const receipt = await tx.wait();
      return receipt.status;
    }
  };

  const getUserMunks = async () => {
    if (account) {
      const tokens = [];
      let index = 0;
      const owner = account;
      const balance = await contract.balanceOf(owner);
      for (let i = 0; i < balance; i++) {
        const token = await contract.tokenOfOwnerByIndex(owner, index);
        tokens.push(token);
        index++;
      }

      return tokens;
    }
  };

  const getMunkMetadata = async (munkId) => {
    const response = await fetch(`/api/munks/${munkId}.json`);
    if (response.status === 200) {
      let data = await response.json();
      data = {
        ...data,
        id: munkId,
      };
      return data;
    } else if (munkId > 0 && response.status === 500) {
      return await getMunkMetadata(munkId);
    }
    return null;
  };

  return {
    contract,
    claim,
    getUserMunks,
    getMunkMetadata,
  };
};

export default useMunks;
