import React, { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import FantomMunksAbi from "../contract/abis/FantomMunks.json";

import useWeb3 from "../hooks/useWeb3";
import { ethers } from "ethers";
import Button from "../components/Button";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const MINT_PRICE = Number(process.env.NEXT_PUBLIC_MINT_PRICE);

function Index() {
  const { active, activate, deactivate, account, web3 } = useWeb3();

  const [contract, setContract] = useState(null);
  const [maxMintable, setMaxMintable] = useState(0);
  const [supply, setSupply] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);

  const [mintQuantity, setMintQuantity] = useState(0);

  useEffect(() => {
    activate();
  }, []);

  useEffect(() => {
    if (active && web3) {
      let c = new ethers.Contract(
        contractAddress,
        FantomMunksAbi,
        web3.getSigner(account)
      );

      setContract(c);
      c.totalSupply()
        .then((supply) => {
          setSupply(supply);
        })
        .catch((err) => {
          setSupply(0);
          setMaxMintable(0);
          setContract(null);
          toast.error("Check if you are using Fantom Network", {
            theme: "colored",
          });
        });

      c.maxMintable()
        .then((maxMintable) => {
          setMaxMintable(maxMintable);
        })
        .catch((err) => console.log(err));
    }
  }, [active, web3]);

  async function loadData() {
    let totalSupply = await contract.totalSupply();

    setSupply(totalSupply);

    contract
      .maxMintable()
      .then((maxMintable) => {
        setMaxMintable(maxMintable);
      })
      .catch((err) => console.log(err));
  }

  function claim() {
    if (account) {
      setIsClaiming(true);
      let _price = ethers.utils.parseUnits(
        String(MINT_PRICE * mintQuantity),
        18
      );

      const claimPromise = new Promise((resolve, reject) => {
        contract
          .claim(mintQuantity, {
            value: _price,
          })
          .then((receipt) => {
            console.log(receipt);
            setIsClaiming(false);
            loadData();

            const link = `https://ftmscan.com/tx/${receipt.transactionHash}`;

            resolve(link);
          })
          .catch((err) => {
            console.log("error", err);
          });
      });

      toast.promise(claimPromise, {
        pending: "Claiming...",
        success: {
          render: (link) => `Claimed!`,
        },
        error: "Something went wrong... Try again!",
      });
    }
  }

  const changeQuantity = (operation) => {
    if (operation === "add") {
      if (mintQuantity < maxMintable) {
        setMintQuantity(mintQuantity + 1);
      }
    } else {
      if (mintQuantity > 0) {
        setMintQuantity(mintQuantity - 1);
      }
    }
  };

  return (
    <div className="px-5 sm:max-w-5xl mx-auto sm:h-screen flex flex-col justify-between">
      <div className="py-3 flex sm:flex-row flex-col justify-between items-center">
        <Link href="/">
          <Image src="/assets/logo.png" width="400" height="65" />
        </Link>

        <Button path="/my-munks">My munks</Button>

        <Button onClick={() => activate()}>
          {active
            ? account.substring(0, 6) +
              "..." +
              account.substring(account.length - 4, account.length)
            : "Connect"}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-3 mb-10 sm:mb-0 overflow-y-scroll lg:overflow-y-hidden bg-white px-7 py-4 rounded-3xl">
        <div className="flex flex-col order-5 sm:order-1 w-5/12">
          <div className="flex flex-row justify-evenly mb-5 items-center">
            <Image src="/assets/ancient-munks.png" width={55} height={60} />
            <div>
              <h2 className="text-purple-600">An ancient legend says:</h2>
              <h2 className="font-bold italic text-purple-600">
                For every hand, a blade.
              </h2>
              <h2 className="font-bold italic text-purple-600">
                For every existence, a path.
              </h2>
              <h2 className="font-bold italic text-purple-600">
                Hold to prepare. Wait for the call.
              </h2>
            </div>
            <Image src="/assets/ancient-munks.png" width={55} height={60} />
          </div>

          <div className="order-5 sm:order-1 mb-3 text-sm">
            <p className="font-bold">
              Welcome to the first collection inside the MUNKVERSE. <br />
              This is your gateway to this amazing journey.
              <br />
              Claim your MUNK. Stay safe.
            </p>
            <br />
            <p>
              <span className="font-bold">Mint a MUNK:</span> get a profile-pic
              with cool shapes and colors.
              <br />
              <span className="font-bold">Hold your MUNK:</span> get some cool
              game-asset-like NFTs.
              <br />
              <span className="font-bold">Hold everything:</span> get a
              strategy-game.
            </p>
          </div>

          {active ? (
            <div className="order-1 sm:order-5 flex flex-col items-center">
              <div className="flex flex-row items-center justify-center w-10/12">
                <button
                  className="transition-all duration-500 ease-in-out h-10 bg-purple-600 hover:bg-purple-800 hover:shadow-xl px-4 rounded-xl text-white transform hover:scale-110 hover:z-50 origin-center"
                  onClick={() => changeQuantity("subtract")}
                >
                  -
                </button>
                <input
                  className="transition-all duration-500 ease-in-out hover:shadow-xl p-2 my-2 rounded-xl border-2 border-purple-600 mx-2"
                  type="number"
                  placeholder="Munks quantity"
                  min="0"
                  value={mintQuantity}
                  onChange={(e) => setMintQuantity(e.target.value)}
                />
                <button
                  className="transition-all duration-500 ease-in-out h-10 bg-purple-600 hover:bg-purple-800 hover:shadow-xl px-4 rounded-xl text-white transform hover:scale-110 hover:z-50 origin-center"
                  onClick={() => changeQuantity("add")}
                >
                  +
                </button>
              </div>
              <button
                className={[
                  `${
                    mintQuantity === 0
                      ? "bg-gray-400 hover:bg-gray-600"
                      : "bg-purple-600 hover:bg-purple-800"
                  }`,
                  "transition-all duration-500 ease-in-out h-10 hover:shadow-xl px-4 rounded-xl text-white transform hover:scale-110 hover:z-50 origin-center w-10/12",
                ]}
                disabled={mintQuantity === 0}
                onClick={claim}
              >
                {isClaiming
                  ? "Claiming..."
                  : `Claim (${mintQuantity * MINT_PRICE} FTM)`}
              </button>
            </div>
          ) : (
            <div>Connect your wallet to claim</div>
          )}

          <div className="flex flex-col sm:flex-row my-5 order-2 sm:order-6 justify-between">
            <div className="flex flex-col py-2 sm:py-0 sm:pr-7">
              <span className="font-bold text-xl">10.000</span>
              <span>Munks to be claim</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold py-2 sm:py-0 text-xl">1 FTM</span>
              <span>Mint price</span>
            </div>
            <div className="flex flex-col py-2 sm:py-0 sm:pl-7">
              {active && (
                <>
                  <span className="font-bold text-xl">
                    {maxMintable - supply}
                  </span>
                  <span>Munks available </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="order-1 sm:order-5 w-5/12">
          <div>
            <Image
              src="/assets/munk1.gif"
              alt="munk"
              width="600"
              height="600"
              className="rounded-xl shadow-xl"
            />
          </div>

          <br />
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Index;
