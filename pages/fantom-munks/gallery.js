import {
  Button,
  Card,
  Col,
  Container,
  Grid,
  Loading,
  Text,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import Title from "../../src/components/Title";
import useMunks from "../../src/hooks/useMunks";
import useWeb3 from "../../src/hooks/useWeb3";

const FantomMunksGallery = () => {
  const { active, activate, deactivate, account, web3 } = useWeb3();
  const { contract, getUserMunks, getMunkMetadata } = useMunks(web3, account);

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
              <Grid key={munk.id}>
                <Card hoverable clickable width="100%" cover>
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
                    alt="Card image background"
                  />
                </Card>
              </Grid>
            );
          })
        ) : null}
      </Grid.Container>
    </Container>
  );
};

export default FantomMunksGallery;
