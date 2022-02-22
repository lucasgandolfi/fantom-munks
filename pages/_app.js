import "../styles/globals.css";
import Head from "next/head";

import { NextUIProvider } from "@nextui-org/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function getLibrary(provider) {
  return new Web3Provider(provider);
}

function MyApp({ Component, pageProps }) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <NextUIProvider>
        <Head>
          <title>Fantom Munks</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Component {...pageProps} />
        <ToastContainer />
      </NextUIProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
