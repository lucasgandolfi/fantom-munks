import { Container, Grid, Text } from "@nextui-org/react";
import Title from "../../../src/components/Title";

const GoldenScarletSwords = () => {
  return (
    <Container>
      <Grid.Container gap={5}>
        <Grid xs={12} display="flex" justify="center">
          <Title withHomeLink>Golden Scarlet - Swords</Title>
        </Grid>
        <Grid xs={12} justify="center">
          <Text h1>Soon!</Text>
        </Grid>
      </Grid.Container>
    </Container>
  );
};

export default GoldenScarletSwords;
