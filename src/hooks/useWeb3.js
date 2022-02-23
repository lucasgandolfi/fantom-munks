import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

const injector = new InjectedConnector({
  supportedChainIds: [CHAIN_ID],
});

export class NoWalletInstalled extends Error {}

const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);

  const {
    active,
    activate: web3Activate,
    deactivate,
    account,
  } = useWeb3React();

  const activate = async () => {
    await web3Activate(injector, (err) => {}, true);
  };

  useEffect(() => {
    if (window.ethereum) {
      setWeb3(new ethers.providers.Web3Provider(window.ethereum, "any"));
    } else {
      setWeb3(new NoWalletInstalled());
    }
  }, []);

  return {
    activate,
    deactivate,
    active,
    account,
    web3,
  };
};

export default useWeb3;
