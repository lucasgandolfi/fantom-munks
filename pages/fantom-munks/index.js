import {
  Button,
  Card,
  Col,
  Container,
  Grid,
  Loading,
  Row,
  Text,
  useTheme,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MintModal from "../../src/components/munks/MintModal";
import Title from "../../src/components/Title";

const FantomMunks = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const [info, setInfo] = useState(null);
  const [mintModalVisible, setMintModalVisible] = useState(false);

  useEffect(() => {
    fetch("/api/munks/info")
      .then((res) => res.json())
      .then((data) => {
        console.log("Data", data);
        setInfo({
          munksToBeClaim: data.munksToClaim,
          mintPrice: data.mintPrice,
          munksAvailable: data.munksAvailable,
        });
      })
      .catch((err) => {
        setInfo(null);
        console.error("Erro ao buscar info", err);
        toast.error("Something went wrong getting info about Munks...");
      });
  }, []);

  const openMintModal = () => {
    setMintModalVisible(true);
  };

  const openMunksGallery = () => {
    router.push("/fantom-munks/gallery");
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
        <Grid xs={12}>
          <Col>
            <Row justify="center">
              <Text size={18} css={{ textAlign: "center", letterSpacing: 1 }}>
                Welcome to the first collection inside the MUNKVERSE. This is
                your gateway to this amazing journey. Claim your MUNK. Stay
                safe.
              </Text>
            </Row>
            <Row css={{ marginTop: "$15" }}>
              <Col>
                <Row justify="center" css={{ flexDirection: "row" }}>
                  <Text css={{ marginRight: 5 }} weight="bold">
                    Mint a MUNK:
                  </Text>
                  <Text>get a profile-pic with cool shapes and colors.</Text>
                </Row>
                <Row justify="center" css={{ flexDirection: "row" }}>
                  <Text css={{ marginRight: 5 }} weight="bold">
                    Hold your MUNK:
                  </Text>
                  <Text>get some cool game-asset-like NFTs.</Text>
                </Row>
                <Row justify="center" css={{ flexDirection: "row" }}>
                  <Text css={{ marginRight: 5 }} weight="bold">
                    Hold everything:
                  </Text>
                  <Text>get a strategy-game.</Text>
                </Row>
              </Col>
            </Row>
          </Col>
        </Grid>
        <Grid xs={4}>
          <Card color="default">
            <Col>
              <Row>
                <Text
                  weight="bold"
                  css={{
                    marginRight: 10,
                    textGradient: "45deg, $purple600 -20%, $pink500 100%",
                  }}
                >
                  MUNKS
                </Text>{" "}
                <Text>to be claim</Text>
              </Row>
              {info !== null ? (
                <Row>
                  <Text>{info.munksToBeClaim}</Text>
                </Row>
              ) : (
                <Row
                  justify="center"
                  css={{
                    marginTop: 20,
                  }}
                >
                  <Loading type="points" color="white" size="sm" />
                </Row>
              )}
            </Col>
          </Card>
        </Grid>
        <Grid xs={4}>
          <Card color="default">
            <Col>
              <Row>
                <Text>Mint Price</Text>
              </Row>
              {info !== null ? (
                <Row>
                  <Text>{info.mintPrice}</Text>{" "}
                  <Text
                    weigth="bold"
                    css={{
                      marginLeft: 10,
                      textGradient: "45deg, #13b5ec -20%, #0b30ff 100%",
                    }}
                  >
                    FTM
                  </Text>
                </Row>
              ) : (
                <Row
                  justify="center"
                  css={{
                    marginTop: 20,
                  }}
                >
                  <Loading type="points" color="white" size="sm" />
                </Row>
              )}
            </Col>
          </Card>
        </Grid>
        <Grid xs={4}>
          <Card color="default">
            <Col>
              <Row>
                <Text
                  weight="bold"
                  css={{
                    marginRight: 10,
                    textGradient: "45deg, $purple600 -20%, $pink500 100%",
                  }}
                >
                  MUNKS
                </Text>{" "}
                <Text>available</Text>
              </Row>
              {info !== null ? (
                <Row>
                  <Text>{info.munksToBeClaim - info.munksAvailable}</Text>
                </Row>
              ) : (
                <Row
                  justify="center"
                  css={{
                    marginTop: 20,
                  }}
                >
                  <Loading type="points" color="white" size="sm" />
                </Row>
              )}
            </Col>
          </Card>
        </Grid>
        <Grid xs={12} justify="center">
          <Col>
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
            <Row justify="center">
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
              </div>
            </Row>
          </Col>
        </Grid>
        <Grid xs={12} justify="center">
          <Col>
            <Row justify="center">
              <Text size={24} weight="bold">
                Do you have
              </Text>
              <Text
                size={24}
                weight="bold"
                css={{
                  marginLeft: 10,
                  marginRight: 5,
                  textGradient: "45deg, $purple600 -20%, $pink500 100%",
                }}
              >
                MUNKS
              </Text>
              <Text size={24} weight="bold">
                ?
              </Text>
            </Row>
            <Row justify="center" css={{ marginTop: 20, paddingBottom: 30 }}>
              <Button shadow color="gradient" onClick={openMunksGallery}>
                See my MUNKS
              </Button>
            </Row>
          </Col>
        </Grid>
      </Grid.Container>
      <MintModal visible={mintModalVisible} setVisible={setMintModalVisible} />
    </Container>
  );
};

export default FantomMunks;
