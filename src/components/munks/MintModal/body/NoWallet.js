import { Col, Link, Modal, Row, Text } from "@nextui-org/react";

const NoWallet = () => {
  return (
    <>
      <Modal.Body>
        <Col>
          <Row justify="center">
            <Text>Hello, anom!</Text>
          </Row>
          <Row justify="center" css={{ marginTop: 15 }}>
            <Text size={18}>
              Sorry, but it&apos;s not possible to interact with this project
              without a crypto wallet...
            </Text>
          </Row>
          <Row justify="center" css={{ marginTop: 15 }}>
            <Text>
              Our suggestion is: install{" "}
              <Link href="https://metamask.io/" target="_blank">
                Metamask
              </Link>
              .
            </Text>
          </Row>
        </Col>
      </Modal.Body>
    </>
  );
};

export default NoWallet;
