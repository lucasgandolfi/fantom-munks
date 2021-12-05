import { ethers } from "ethers";
import Link from "next/link";
import { useEffect, useState } from "react";
import useMunks from "../hooks/useMunks";
import useWeb3 from "../hooks/useWeb3";

export default function MyMunksPage() {
  const { active, activate, deactivate, account, web3 } = useWeb3();
  const { contract, getUserMunks, getMunkMetadata } = useMunks(web3, account);

  const [userMunks, setUserMunks] = useState([]);

  useEffect(() => {
    if (web3) {
      activate();
    }
  }, [web3]);

  useEffect(() => {
    if (contract && userMunks.length === 0) {
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
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [contract]);

  return (
    <div className="px-5 sm:max-w-5xl mx-auto sm:h-screen">
      <div className="py-3 flex sm:flex-row flex-col justify-between items-center">
        <Link href="/">
          <a className="text-3xl sm:text-5xl font-extrabold text-purple-800">
            FANTOM MUNKS
          </a>
        </Link>

        <Link href="/my-munks">
          <a className="transition-all duration-500 ease-in-out text-purple-600 hover:text-purple-800 transform hover:scale-110">
            My Munks
          </a>
        </Link>

        {active ? (
          <button
            className="transition-all duration-500 ease-in-out h-10 bg-purple-600 hover:bg-purple-800 hover:shadow-xl px-4 rounded-xl text-white sm:w-auto w-full mt-3 sm:mt-0 transform hover:scale-110"
            onClick={() => deactivate()}
          >
            {account.substring(0, 6) +
              "..." +
              account.substring(account.length - 4, account.length)}
          </button>
        ) : (
          <button
            className="transition-all duration-500 ease-in-out h-10 bg-purple-600 hover:bg-purple-800 hover:shadow-xl px-4 rounded-xl text-white sm:w-auto w-full mt-3 sm:mt-0 transform hover:scale-110"
            onClick={() => activate()}
          >
            Connect
          </button>
        )}
      </div>
      <div className="py-5">
        <h1 className="text-xl sm:text-3xl mt-5 text-center font-extrabold text-purple-800">
          My Munks
        </h1>
        <ul className="grid grid-cols-4 gap-4">
          {userMunks.map((munk, index) => {
            if (!munk) return null;
            return (
              <li className="flex flex-col items-center justify-center">
                <img src={munk.image} alt={munk.name} className="w-64 h-64" />
                <span className="font-bold py-2">{munk.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
