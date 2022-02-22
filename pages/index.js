import React, { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

import FantomMunksAbi from "../contract/abis/FantomMunks.json";

import useWeb3 from "../src/hooks/useWeb3";
import { ethers } from "ethers";
import { Container, Grid, Text } from "@nextui-org/react";
import CollectionCard from "../src/components/CollectionCard";
import Title from "../src/components/Title";

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
    <Container
      css={{
        height: "100vh",
      }}
    >
      <Grid.Container gap={5}>
        <Grid xs={12} display="flex" justify="center">
          <Title>MUNKVERSE</Title>
        </Grid>
        <Grid xs={12} display="flex" justify="center">
          <Grid.Container
            css={{
              width: "50%",
            }}
          >
            <Grid xs={2} display="flex" alignItems="center">
              <div>
                <Image
                  src="/assets/ancient-munks.png"
                  alt="ancient munk logo"
                  width="60"
                  height="60"
                />
              </div>
            </Grid>
            <Grid
              xs={8}
              css={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Text
                size={24}
                css={{
                  color: "$purple600",
                }}
              >
                An ancient legend says:
              </Text>
              <Text
                size={24}
                css={{
                  color: "$purple600",
                }}
                weight="bold"
              >
                For every hand, a blade.
              </Text>
              <Text
                size={24}
                css={{
                  color: "$purple600",
                }}
                weight="bold"
              >
                For every existence, a path.
              </Text>
              <Text
                size={24}
                css={{
                  color: "$purple600",
                }}
                weight="bold"
              >
                Hold to prepare. Wait for the call.
              </Text>
            </Grid>
            <Grid xs={2} display="flex" alignItems="center">
              <div>
                <Image
                  src="/assets/ancient-munks.png"
                  alt="ancient munk logo"
                  width="60"
                  height="60"
                />
              </div>
            </Grid>
          </Grid.Container>
        </Grid>
        <Grid xs={6} display="flex" justify="center">
          <CollectionCard
            src="/assets/munk1.gif"
            title="Fantom Munks"
            href="/fantom-munks/"
          />
        </Grid>
        <Grid xs={6} display="flex" justify="center">
          <CollectionCard
            src="/assets/swords1.gif"
            title="Golden Scarlet - Swords"
            href="/golden-scarlet/swords/"
          />
        </Grid>
      </Grid.Container>
    </Container>
  );
}

export default Index;
