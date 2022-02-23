import { Button, Col, Link, Modal, Row, Text } from "@nextui-org/react";

const WalletNotConnected = ({ activate }) => {
  return (
    <>
      <Modal.Body>
        <Col>
          <Row justify="center">
            <Text>Hello, anom!</Text>
          </Row>
          <Row justify="center" css={{ marginTop: 15 }}>
            <Text size={18}>Your wallet is not connected...</Text>
          </Row>
          <Row css={{ marginTop: 20 }}>
            <Button
              color="gradient"
              onClick={activate}
              css={{
                w: "100%",
              }}
            >
              Connect wallet
            </Button>
          </Row>
        </Col>
      </Modal.Body>
    </>
  );
};

export default WalletNotConnected;
