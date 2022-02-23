import {
  Button,
  Col,
  Grid,
  Input,
  Loading,
  Modal,
  Row,
  Text,
  useTheme,
} from "@nextui-org/react";
import { FaMinus, FaPlus } from "react-icons/fa";

const ReadyToMint = ({
  mint,
  mintQuantity,
  mintPrice,
  isMinting,
  increaseQty,
  decreaseQty,
  changeQtyHandler,
}) => {
  const { theme } = useTheme();

  return (
    <>
      <Modal.Header>
        <Col>
          <Row justify="center">
            <Text>Hello, anom!</Text>
          </Row>
          <Row justify="center">
            <Text size={18}>So, do you want to mint some </Text>
            <Text
              weight="bold"
              css={{
                marginLeft: 5,
                marginRight: 2,
                textGradient: "45deg, $purple600 -20%, $pink500 100%",
              }}
            >
              Munks
            </Text>
            <Text size={18}>?</Text>
          </Row>
        </Col>
      </Modal.Header>
      <Modal.Body>
        <Grid.Container>
          <Grid xs={3} justify="center">
            <Button onClick={decreaseQty} auto>
              <FaMinus size={12} />
            </Button>
          </Grid>
          <Grid xs={6} justify="center">
            <Input
              bordered
              color="primary"
              size="lg"
              placeholder="Quantity"
              value={mintQuantity}
              type="number"
              min={0}
              onChange={changeQtyHandler}
            />
          </Grid>
          <Grid xs={3} onClick={increaseQty} justify="center">
            <Button auto>
              <FaPlus size={12} />
            </Button>
          </Grid>
          <Grid
            xs={12}
            css={{
              marginTop: 30,
            }}
          >
            <Col>
              <Row justify="center">
                <Text>What will happen?</Text>
              </Row>
              <Row justify="center" align="center">
                <FaPlus size={15} color={theme.colors.green600.value} />
                <Text
                  css={{
                    marginLeft: 5,
                  }}
                >
                  {mintQuantity}
                </Text>{" "}
                <Text
                  weight="bold"
                  css={{
                    marginLeft: 10,
                    textGradient: "45deg, $purple600 -20%, $pink500 100%",
                  }}
                >
                  Munks
                </Text>
              </Row>
              <Row justify="center" align="center">
                <FaMinus size={15} color={theme.colors.red600.value} />
                <Text
                  css={{
                    marginLeft: 5,
                  }}
                >
                  {mintQuantity * mintPrice}
                </Text>{" "}
                <Text
                  css={{
                    marginLeft: 10,
                    marginRight: 10,
                    textGradient: "45deg, #13b5ec -20%, #0b30ff 100%",
                  }}
                >
                  FTM{" "}
                </Text>
                <Text>(+ Gas Fees)</Text>
              </Row>
            </Col>
          </Grid>
        </Grid.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          shadow
          color="gradient"
          disabled={mintQuantity <= 0}
          onClick={mint}
          css={{
            w: "100%",
          }}
        >
          {isMinting ? (
            <Loading type="points" color="white" size="sm" />
          ) : (
            "Mint"
          )}
        </Button>
      </Modal.Footer>
    </>
  );
};

export default ReadyToMint;
