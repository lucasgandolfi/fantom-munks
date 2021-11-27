import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

const injector = new InjectedConnector({
  supportedChainIds: [Number(process.env.NEXT_PUBLIC_CHAIN_ID)],
});

const useWeb3 = () => {
  const {
    active,
    activate: web3Activate,
    deactivate,
    account,
  } = useWeb3React();

  const activate = async () => {
    try {
      await web3Activate(injector);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    activate,
    deactivate,
    active,
    account,
  };
};

export default useWeb3;
