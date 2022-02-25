import { Button, Container, Grid, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import Title from "../../../src/components/Title";

const GoldenScarletSwords = () => {
  const router = useRouter();

  const openSwordsGallery = () => {
    router.push("/golden-scarlet/swords/gallery");
  };

  return (
    <Container>
      <Grid.Container gap={5}>
        <Grid xs={12} display="flex" justify="center">
          <Title withHomeLink>Golden Scarlet - Swords</Title>
        </Grid>
        <Grid xs={12} justify="center">
          <Text>Swords are airdroped 1:1 to Munk Holders</Text>
        </Grid>
        <Grid xs={12} justify="center">
          <Button shadow color="gradient" onClick={openSwordsGallery}>
            See my Swords
          </Button>
        </Grid>
      </Grid.Container>
    </Container>
  );
};

export default GoldenScarletSwords;
