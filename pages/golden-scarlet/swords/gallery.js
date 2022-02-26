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
import Title from "../../../src/components/Title";
import useWeb3 from "../../../src/hooks/useWeb3";
import SwordsAbi from "../../../contract/abis/GoldenScarletSwords.json";
import useERC721 from "../../../src/hooks/useERC721";

const GSSwordsGallery = () => {
  const { active, activate, account, web3 } = useWeb3();
  const { contract, getMetadata, getUserTokens } = useERC721(
    web3,
    account,
    SwordsAbi
  );

  const [selected, setSelected] = useState(null);
  const [userTokens, setUserTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (active && contract && userTokens.length === 0) {
      setIsLoading(true);
      getUserTokens()
        .then((tokens) => {
          if (tokens) {
            Promise.all(tokens.map((token) => getMetadata(token.toString())))
              .then((metadatas) => {
                console.log("metadatas", metadatas);
                setUserTokens(metadatas);
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

  const openModal = (token) => {
    setSelected(token);
  };
  const closeModal = () => {
    setSelected(null);
    document.getElementsByTagName("body")[0].style.overflow = "auto";
  };

  return (
    <Container>
      <Grid.Container gap={5}>
        <Grid xs={12} display="flex" justify="center">
          <Title withHomeLink>Golden Scarlet Swords Gallery</Title>
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
        ) : active && userTokens.length > 0 ? (
          userTokens.map((token) => {
            if (!token) return null;
            return (
              <Grid key={token.id} xs={12} md={4} lg={3}>
                <Card
                  hoverable
                  clickable
                  onClick={() => openModal(token)}
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
                        {token.name}
                      </Text>
                    </Col>
                  </Card.Header>
                  <Card.Image
                    src={token.image.replace(
                      "ipfs://",
                      "https://ipfs.io/ipfs/"
                    )}
                    showSkeleton
                    height={653}
                    width="100%"
                    alt={token.name}
                  />
                </Card>
              </Grid>
            );
          })
        ) : null}
      </Grid.Container>
      {selected !== null ? (
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
              {selected.name}
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Grid.Container>
              <Grid xs={12} sm={6}>
                <Image
                  width={500}
                  height={500}
                  src={selected.image.replace(
                    "ipfs://",
                    "https://cloudflare-ipfs.com/ipfs/"
                  )}
                  alt={selected.name}
                />
              </Grid>
              <Grid xs={12} sm={4}>
                <Col>
                  <Row>
                    <Text weight="bold" size={24}>
                      Attributes
                    </Text>
                  </Row>
                  {selected.attributes.map((attr) => {
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
                </Col>
              </Grid>
            </Grid.Container>
          </Modal.Body>
        </Modal>
      ) : null}
    </Container>
  );
};

export default GSSwordsGallery;
