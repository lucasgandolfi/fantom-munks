import {
  Button,
  Col,
  Container,
  Grid,
  Row,
  Text,
  useTheme,
} from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import MintModal from "../../src/components/munks/MintModal";
import Title from "../../src/components/Title";

const FantomMunks = () => {
  const { theme } = useTheme();

  const [mintModalVisible, setMintModalVisible] = useState(false);

  const openMintModal = () => {
    setMintModalVisible(true);
  };

  return (
    <Container
      css={{
        height: "100vh",
      }}
    >
      <Grid.Container gap={5} justify="center">
        <Grid xs={12} display="flex" justify="center">
          <Title withHomeLink>Fantom Munks</Title>
        </Grid>
        <Grid xs={6}>
          <Col>
            <Row>
              <Text size={18} css={{ textAlign: "center", letterSpacing: 1 }}>
                Welcome to the first collection inside the MUNKVERSE. This is
                your gateway to this amazing journey. Claim your MUNK. Stay
                safe.
              </Text>
            </Row>
            <Row css={{ marginTop: "$15" }}>
              <Col>
                <Row css={{ flexDirection: "row" }}>
                  <Text css={{ marginRight: 5 }} weight="bold">
                    Mint a MUNK:
                  </Text>
                  <Text>get a profile-pic with cool shapes and colors.</Text>
                </Row>
                <Row css={{ flexDirection: "row" }}>
                  <Text css={{ marginRight: 5 }} weight="bold">
                    Hold your MUNK:
                  </Text>
                  <Text>get some cool game-asset-like NFTs.</Text>
                </Row>
                <Row css={{ flexDirection: "row" }}>
                  <Text css={{ marginRight: 5 }} weight="bold">
                    Hold everything:
                  </Text>
                  <Text>get a strategy-game.</Text>
                </Row>
              </Col>
            </Row>
          </Col>
        </Grid>
        <Grid xs={12} justify="center">
          <div
            style={{
              borderRadius: theme.radii.base,
              overflow: "hidden",
            }}
          >
            <Image
              src="/assets/munk1.gif"
              alt="munks"
              width="500"
              height="500"
              objectFit="cover"
            />
            <Row justify="center">
              <Text size={24} weight="bold">
                Get your Munk!
              </Text>
            </Row>
            <Row justify="center" css={{ marginTop: 20, paddingBottom: 30 }}>
              <Button shadow color="gradient" onClick={openMintModal}>
                Claim
              </Button>
            </Row>
          </div>
        </Grid>
      </Grid.Container>
      <MintModal visible={mintModalVisible} setVisible={setMintModalVisible} />
    </Container>
  );
};

export default FantomMunks;
