import { Modal } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ReadyToMint from "./body/ReadyToMint";
import useWeb3, { NoWalletInstalled } from "../../../hooks/useWeb3";
import NoWallet from "./body/NoWallet";
import WalletNotConnected from "./body/WalletNotConnected";
import { toast } from "react-toastify";
import useMunks from "../../../hooks/useMunks";

export const MINT_PRICE = 1;

const MintModal = ({ visible, setVisible }) => {
  const { active, activate, account, web3 } = useWeb3();
  const { claim } = useMunks(web3, account);

  const [mintQuantity, setMintQuantity] = useState(1);
  const [isMinting, setIsMinting] = useState(false);

  const closeHandler = () => {
    setVisible(false);
  };

  const mint = async () => {
    setIsMinting(true);
    try {
      await claim(mintQuantity);
      toast.success("Munks minted");
    } catch (err) {
      toast.error("Whoops! Something went wrong...");
    } finally {
      closeHandler();
      setIsMinting(false);
    }
  };

  const changeQtyHandler = (e) => {
    setMintQuantity(Number(e.target.value));
  };
  const increaseQty = () => {
    setMintQuantity(mintQuantity + 1);
  };
  const decreaseQty = () => {
    if (mintQuantity > 0) setMintQuantity(mintQuantity - 1);
  };

  let body;
  if (web3 instanceof NoWalletInstalled) {
    body = <NoWallet />;
  } else {
    if (active) {
      body = (
        <ReadyToMint
          mint={mint}
          mintPrice={MINT_PRICE}
          mintQuantity={mintQuantity}
          isMinting={isMinting}
          changeQtyHandler={changeQtyHandler}
          decreaseQty={decreaseQty}
          increaseQty={increaseQty}
        />
      );
    } else {
      const connectWallet = async () => {
        try {
          await activate();
        } catch (err) {
          closeHandler();
          toast.error("Sorry, we only work with Fantom here");
        }
      };
      body = <WalletNotConnected activate={connectWallet} />;
    }
  }

  return (
    <div>
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        {body}
      </Modal>
    </div>
  );
};

export default MintModal;
