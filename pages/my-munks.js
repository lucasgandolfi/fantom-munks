import Link from "next/link";
import { useEffect } from "react";
import useWeb3 from "../hooks/useWeb3";

export default function MyMunksPage() {
  const { active, activate, deactivate, account } = useWeb3();

  return (
    <div className="px-5 sm:max-w-5xl mx-auto sm:h-screen">
      <div className="py-3 flex sm:flex-row flex-col justify-between items-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-purple-800">
          FANTOM MUNKS
        </h1>

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
    </div>
  );
}
