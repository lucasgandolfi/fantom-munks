import React, { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import { Container, Grid, Text } from "@nextui-org/react";
import CollectionCard from "../src/components/CollectionCard";
import Title from "../src/components/Title";

function Index() {
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
            <Grid xs={12} md={2} justify="center" alignItems="center">
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
              xs={12}
              md={8}
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
            <Grid xs={12} md={2} justify="center" alignItems="center">
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
        <Grid xs={12} md={6} display="flex" justify="center">
          <CollectionCard
            src="/assets/munk1.gif"
            title="Fantom Munks"
            href="/fantom-munks/"
          />
        </Grid>
        <Grid xs={12} md={6} display="flex" justify="center">
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
