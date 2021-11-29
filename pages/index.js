import React, { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";

import FantomMunksAbi from "../contract/abis/FantomMunks.json";

import "react-toastify/dist/ReactToastify.css";
import useWeb3 from "../hooks/useWeb3";

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
    if (active) {
      let c = new web3.eth.Contract(FantomMunksAbi, contractAddress);
      setContract(c);
      c.methods
        .totalSupply()
        .call()
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

      c.methods
        .maxMintable()
        .call()
        .then((maxMintable) => {
          setMaxMintable(maxMintable);
        })
        .catch((err) => console.log(err));
    }
  }, [active]);

  function handleClaim() {
    claim();
  }

  async function loadData() {
    let totalSupply = await contract.methods.totalSupply().call();

    setSupply(totalSupply);

    contract.methods
      .maxMintable()
      .call()
      .then((maxMintable) => {
        setMaxMintable(maxMintable);
      })
      .catch((err) => console.log(err));
  }

  function claim() {
    if (account) {
      setIsClaiming(true);
      let _price = web3.utils.toWei(String(MINT_PRICE * mintQuantity));

      const claimPromise = new Promise((resolve, reject) => {
        contract.methods
          .claim(mintQuantity)
          .send({
            to: contractAddress,
            from: account,
            value: _price,
          })
          .once("error", (err) => {
            console.log(err);
            setIsClaiming(false);
            reject();
          })
          .then((receipt) => {
            console.log(receipt);
            setIsClaiming(false);
            loadData();

            const link = `https://ftmscan.com/tx/${receipt.transactionHash}`;

            resolve(link);
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
        <h1 className="text-3xl sm:text-5xl font-extrabold text-purple-800">
          FANTOM MUNKS
        </h1>

        <Link href="/my-munks">
          <a className="transition-all duration-500 ease-in-out text-purple-600 hover:text-purple-800 transform hover:scale-110">
            My Munks
          </a>
        </Link>

        <button
          className="transition-all duration-500 ease-in-out h-10 bg-purple-600 hover:bg-purple-800 hover:shadow-xl px-4 rounded-xl text-white sm:w-auto w-full mt-3 sm:mt-0 transform hover:scale-110"
          onClick={() => activate()}
        >
          {active
            ? account.substring(0, 6) +
              "..." +
              account.substring(account.length - 4, account.length)
            : "Connect"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between mt-10 mb-10 sm:mb-0 overflow-y-scroll lg:overflow-y-hidden">
        <div className="flex flex-col order-5 sm:order-1">
          <div className="order-5 sm:order-1 mb-3">
            <span className="font-bold text-lg">
              This is the first collection created inside the{" "}
              <span className="text-purple-800 font-bold">MUNKVERSE.</span>
            </span>
            <br />
            <br />
            What is the{" "}
            <span className="text-purple-800 font-bold">MUNKVERSE</span>?
            <br />
            It's just where all Munks live.
            <br />
            Munk is a character created by 16 years old's mind around 2008.
            <br />
            I've never stopped drawing this same character.
            <br />
            Now I think it's perfect for NFTs.
            <br />
            I hope you stick around to see more.
            <br />
            <br />
            This would not be possible without the amazing project:
            <br />
            <a
              className="text-blue-600"
              href="https://www.fantomchess.com"
              target="_blank"
            >
              fantomchess.com
            </a>
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
                onClick={handleClaim}
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

        <div className="order-1 sm:order-5">
          <div>
            <Image
              src="/assets/munk1.gif"
              alt="munk"
              width="450"
              height="450"
              className="rounded-xl shadow-xl"
            />
          </div>

          <br />
        </div>
      </div>
      <footer className="flex flex-row align-center justify-center">
        <a
          href="https://twitter.com/munks_nft"
          target="_blank"
          className="mx-5"
        >
          <Image src="/assets/twitter.svg" alt="munk" width="20" height="20" />
        </a>

        <a
          href={`https://ftmscan.com/address/${contractAddress}`}
          className="mx-5"
          target="_blank"
        >
          <Image src="/assets/fantom.svg" alt="munk" width="20" height="20" />
        </a>
      </footer>
      <ToastContainer />
    </div>
  );
}

export default Index;
