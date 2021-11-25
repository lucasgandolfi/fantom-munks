import React, { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";

import Web3 from "web3";
import FantomMunksAbi from "../contract/abis/FantomMunks.json";

import "react-toastify/dist/ReactToastify.css";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

function Index() {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [maxMintable, setMaxMintable] = useState(0);
  const [supply, setSupply] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      setIsReady(false);
      return;
    }

    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        setAddress(accounts[0]);
        let w3 = new Web3(window.web3.currentProvider);
        setWeb3(w3);
        let c = new w3.eth.Contract(FantomMunksAbi, contractAddress);
        setContract(c);

        c.methods
          .totalSupply()
          .call()
          .then((supply) => {
            setIsReady(true);
            setSupply(supply);
          })
          .catch((err) => {
            setIsReady(false);
            setAddress(null);
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
      })
      .catch((err) => {
        setIsReady(false);
        toast.error("Check if you are using Fantom Network", {
          theme: "colored",
        });
      });
  }

  function handleClaim() {
    let tx = claim();
    console.log(tx);
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
    setIsClaiming(true);
    let _price = web3.utils.toWei("1");

    const claimPromise = new Promise((resolve, reject) => {
      contract.methods
        .claim(1)
        .send({
          to: contractAddress,
          from: address,
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

  return (
    <>
      <div className="geeks"></div>
      <div className="header">
        <div className="tittle colorGradient">
          FANTOM MUNKS - NFT Collection
        </div>

        <button className="button" onClick={connectWallet}>
          {isReady
            ? address?.substring(0, 6) +
              "..." +
              address?.substring(address.length - 4, address.length)
            : "Connect"}{" "}
          {}
        </button>
      </div>

      <div id="app">
        <div className="form-container">
          <div className="content-container">
            <div style={{ flex: 1 }} className="image-frame">
              <Image
                src="/assets/munk1.gif"
                alt="munk"
                width="128"
                height="128"
              />
              <Image
                src="/assets/munk2.gif"
                alt="munk"
                width="128"
                height="128"
              />
              <Image
                src="/assets/munk3.gif"
                alt="munk"
                width="128"
                height="128"
              />
            </div>

            <div style={{ flex: 3 }}>
              <br />
              THIS IS NOT REALEASED. DO NOT MINT.
              <br />
              This is the first collection created inside the{" "}
              <div className="colorGradient">MUNKVERSE.</div>
              <br />
              <br />
              What is the <div className="colorGradient">MUNKVERSE</div>?
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
              <div className="colorGradient">Fantom Chess.</div>
              <br />
              Please, check it at{" "}
              <a
                href="https://www.fantomchess.com"
                className="mr-10"
                target="_blank"
              >
                <div className="colorGradient">fantomchess.com</div>
              </a>
              <br />
              <br />
              <br />
              There are <div className="colorGradient">10.000</div> Munks ready
              to be claim.
              <br />
              Price: <div className="colorGradient">1 FTM</div> each
              <br />
              <br />
              <a
                href="https://twitter.com/munks_nft"
                target="_blank"
                className="mr-10"
              >
                <Image
                  src="/assets/twitter.svg"
                  alt="munk"
                  width="20"
                  height="20"
                />
              </a>
              <a
                href={`https://ftmscan.com/address/${contractAddress}`}
                className="mr-10"
                target="_blank"
              >
                <Image
                  src="/assets/fantom.svg"
                  alt="munk"
                  width="20"
                  height="20"
                />
              </a>
            </div>
          </div>

          <br />

          {isReady && (
            <div>
              Available {maxMintable - supply}/{maxMintable}
            </div>
          )}

          {isReady && (
            <button
              className="button"
              style={{ marginLeft: "auto", marginRight: "auto", marginTop: 20 }}
              onClick={handleClaim}
            >
              {isClaiming ? "loading..." : "Claim (1 FTM)"}
            </button>
          )}

          {!isReady && (
            <div className="colorGradient">
              <br></br>Connect your wallet to claim
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Index;
