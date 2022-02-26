import {
  Button,
  Card,
  Col,
  Container,
  Grid,
  Loading,
  Text,
  Modal,
  Image,
  Row,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import Title from "../../src/components/Title";
import useMunks from "../../src/hooks/useMunks";
import useWeb3 from "../../src/hooks/useWeb3";

const FantomMunksGallery = () => {
  const { active, activate, deactivate, account, web3 } = useWeb3();
  const { contract, getUserMunks, getMunkMetadata } = useMunks(web3, account);

  const [munkSelected, setMunkSelected] = useState(null);
  const [userMunks, setUserMunks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (active && contract && userMunks.length === 0) {
      setIsLoading(true);
      getUserMunks()
        .then((munks) => {
          if (munks) {
            Promise.all(munks.map((munk) => getMunkMetadata(munk.toString())))
              .then((metadatas) => {
                console.log("metadatas", metadatas);
                setUserMunks(metadatas);
              })
              .catch((error) => {
                console.log(error);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [contract, active]);

  const openModal = (munk) => {
    setMunkSelected(munk);
  };
  const closeModal = () => {
    setMunkSelected(null);
    document.getElementsByTagName("body")[0].style.overflow = "auto";
  };

  return (
    <Container>
      <Grid.Container gap={5}>
        <Grid xs={12} display="flex" justify="center">
          <Title withHomeLink>Fantom Munks Gallery</Title>
        </Grid>

        <Grid xs={12} justify="center">
          {active ? (
            <Text>Wallet connected</Text>
          ) : (
            <Button shadow color="gradient" onClick={activate}>
              Connect wallet
            </Button>
          )}
        </Grid>

        {isLoading ? (
          <Grid justify="center" xs={12}>
            <Loading type="points" color="white" size="lg" />
          </Grid>
        ) : active && userMunks.length > 0 ? (
          userMunks.map((munk) => {
            if (!munk) return null;
            return (
              <Grid key={munk.id} xs={12} md={4} lg={3}>
                <Card
                  hoverable
                  clickable
                  onClick={() => openModal(munk)}
                  width="100%"
                  cover
                >
                  <Card.Header
                    css={{ position: "absolute", zIndex: 1, top: 5 }}
                  >
                    <Col>
                      <Text
                        size={12}
                        weight="bold"
                        transform="uppercase"
                        color="#ffffffAA"
                      >
                        {munk.name}
                      </Text>
                    </Col>
                  </Card.Header>
                  <Card.Image
                    src={munk.image.replace(
                      "ipfs://",
                      "https://cloudflare-ipfs.com/ipfs/"
                    )}
                    showSkeleton
                    height={340}
                    width="100%"
                    alt={munk.name}
                  />
                </Card>
              </Grid>
            );
          })
        ) : null}
      </Grid.Container>
      {munkSelected !== null ? (
        <Modal
          fullScreen
          closeButton
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          onClose={closeModal}
          width={600}
          open={true}
        >
          <Modal.Header>
            <Text
              id="modal-title"
              h1
              size={24}
              css={{
                textGradient: "45deg, $purple600 -20%, $pink500 100%",
              }}
            >
              {munkSelected.name}
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Grid.Container>
              <Grid xs={12} sm={6}>
                <Image
                  width={500}
                  height={500}
                  src={munkSelected.image.replace(
                    "ipfs://",
                    "https://cloudflare-ipfs.com/ipfs/"
                  )}
                  alt={munkSelected.name}
                />
              </Grid>
              <Grid xs={12} sm={4}>
                <Col>
                  <Row>
                    <Text weight="bold" size={24}>
                      Attributes
                    </Text>
                  </Row>
                  {munkSelected.attributes.map((attr) => {
                    return (
                      <Row key={attr.trait_type} justify="space-between">
                        <Text
                          weight="bold"
                          css={{
                            marginRight: 20,
                          }}
                        >
                          {attr.trait_type}
                        </Text>
                        <Text>{attr.value}</Text>
                      </Row>
                    );
                  })}
                  <Row>
                    <Grid.Container gap={2} justify="center">
                      <Grid>
                        <Button
                          onClick={() =>
                            window
                              .open(
                                `https://nftkey.app/collections/fantommunks/token-details/?tokenId=${munkSelected.id}`,
                                "_blank"
                              )
                              .focus()
                          }
                        >
                          NFTKEY
                        </Button>
                      </Grid>
                      <Grid>
                        <Button
                          onClick={() =>
                            window
                              .open(
                                `https://paintswap.finance/marketplace/assets/0x7e72f05b8cd0860a83a6b27d3d80bd3b3e440c27/${munkSelected.id}`,
                                "_blank"
                              )
                              .focus()
                          }
                        >
                          PaintSwap
                        </Button>
                      </Grid>
                      <Grid>
                        <Button
                          onClick={() =>
                            window
                              .open(
                                `https://operahouse.online/Item-details/0x7e72f05b8cd0860a83a6b27d3d80bd3b3e440c27/${munkSelected.id}`,
                                "_blank"
                              )
                              .focus()
                          }
                        >
                          OperaHouse
                        </Button>
                      </Grid>
                    </Grid.Container>
                  </Row>
                </Col>
              </Grid>
            </Grid.Container>
          </Modal.Body>
        </Modal>
      ) : null}
    </Container>
  );
};

export default FantomMunksGallery;
