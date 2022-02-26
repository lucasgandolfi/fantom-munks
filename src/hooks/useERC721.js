import { ethers } from "ethers";
import { useEffect, useState } from "react";

const contractAddress =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_GOLDEN_SCARLET_SWORDS;

const useERC721 = (web3, account, contractAbi) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (web3 && !(web3 instanceof Error)) {
      let c = new ethers.Contract(
        contractAddress,
        contractAbi,
        web3.getSigner(account)
      );
      setContract(c);
    }
  }, [web3, account]);

  const getUserTokens = async () => {
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

  const getMetadata = async (id) => {
    if (account) {
      const url = await contract.tokenURI(id);
      const response = await fetch(url);
      if (response.status === 200) {
        let data = await response.json();
        return data;
      }
    }
    return null;
  };

  return {
    contract,
    getUserTokens,
    getMetadata,
  };
};

export default useERC721;
