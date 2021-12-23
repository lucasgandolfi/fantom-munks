import { ethers } from "ethers";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import useMunks from "../hooks/useMunks";
import useWeb3 from "../hooks/useWeb3";
import { toast } from "react-toastify";
import Button from "../components/Button";

export default function MyMunksPage() {
  const { active, activate, deactivate, account, web3 } = useWeb3();
  const { contract, getUserMunks, getMunkMetadata } = useMunks(web3, account);

  const [userMunks, setUserMunks] = useState([]);
  const [munkSelected, setMunkSelected] = useState(null);

  useEffect(() => {
    if (web3) {
      activate();
    }
  }, [web3]);

  useEffect(() => {
    if (contract && userMunks.length === 0) {
      const getMunksPromise = new Promise((resolve, reject) => {
        getUserMunks()
          .then((munks) => {
            if (munks) {
              Promise.all(
                munks.map((munk) =>
                  getMunkMetadata(ethers.utils.formatUnits(munk, 0))
                )
              )
                .then((metadatas) => {
                  console.log("metadatas", metadatas);
                  setUserMunks(metadatas);
                  resolve();
                })
                .catch((error) => {
                  console.log(error);
                  reject();
                });
            } else {
              reject();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
      toast.promise(getMunksPromise, {
        success: "Munks loaded",
        pending: "Loading munks...",
        error: "Error loading munks",
      });
    }
  }, [contract]);

  const openMunkDetails = (munk) => {
    setMunkSelected(munk);
  };

  return (
    <div
      className={`px-5 sm:max-w-5xl mx-auto sm:h-screen ${
        munkSelected != null ? "overflow-hidden" : ""
      }`}
    >
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
      <div className="py-5">
        <h1 className="text-xl sm:text-3xl mt-5 text-center font-extrabold text-white mb-4">
          My Munks
        </h1>
        <ul className="grid grid-cols-4 gap-4">
          {userMunks.map((munk) => {
            if (!munk) return null;
            return (
              <li className="flex flex-col items-center justify-center">
                <button type="button" onClick={() => openMunkDetails(munk)}>
                  <img
                    src={munk.image.replace(
                      "ipfs://",
                      "https://cloudflare-ipfs.com/ipfs/"
                    )}
                    alt={munk.name}
                    className="w-64 h-64 rounded-xl"
                  />
                  <span className="font-bold py-2">{munk.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {munkSelected != null && (
        <div
          className="w-full h-full absolute bottom-0 top-0 left-0 right-0 bg-purple-900 bg-opacity-50 flex items-center justify-center"
          onClick={() => setMunkSelected(null)}
        >
          <div
            className="w-3/4 h-3/4 rounded-xl bg-white p-5 flex flex-row "
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={munkSelected.image.replace(
                "ipfs://",
                "https://cloudflare-ipfs.com/ipfs/"
              )}
              alt={munkSelected.name}
              className="w-2/4 mx-auto rounded-xl"
            />
            <div className="w-2/4 p-5">
              <h2 className="font-extrabold text-xl pb-5">
                {munkSelected.name}
              </h2>
              <table className="w-full">
                <tr>
                  <th className="text-left">Attribute</th>
                  <th className="text-left">Value</th>
                  <th className="text-left">Rarity</th>
                </tr>
                {munkSelected.attributes.map((attr) => {
                  return (
                    <tr>
                      <td>{attr.trait_type}</td>
                      <td>{attr.value}</td>
                      <td>Soon!</td>
                    </tr>
                  );
                })}
              </table>
              <div className="flex transition-all duration-500 ease-in-out bg-purple-600 hover:bg-purple-800 hover:shadow-xl px-4 rounded-xl text-white sm:w-auto w-full transform hover:scale-105 mt-3 text-center">
                <a href="#" className="py-3 w-full h-full">
                  PaintSwap
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
