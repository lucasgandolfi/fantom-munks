import "../src/styles/globals.css";
import Head from "next/head";

import { NextUIProvider } from "@nextui-org/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import theme from "../src/themes";
import { motion } from "framer-motion";

function getLibrary(provider) {
  return new Web3Provider(provider);
}

function MyApp({ Component, pageProps, router }) {
  return (
    <NextUIProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Head>
          <title>Fantom Munks</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <motion.div
          key={router.route}
          initial="pageInitial"
          animate="pageAnimate"
          exit="pageExit"
          variants={{
            pageInitial: {
              opacity: 0,
              scale: 0.6,
            },
            pageAnimate: {
              opacity: 1,
              scale: 1,
            },
            pageExit: {
              opacity: 0,
              scale: 0.6,
            },
          }}
        >
          <Component {...pageProps} />
        </motion.div>
        <ToastContainer position="top-center" theme="dark" />
      </Web3ReactProvider>
    </NextUIProvider>
  );
}

export default MyApp;
