import { Col, Link, Row, Text } from "@nextui-org/react";
import { default as NextLink } from "next/link";

const Title = ({ children, withHomeLink }) => {
  return (
    <Col>
      <Row justify="center">
        <Text
          h1
          size={60}
          css={{
            textGradient: "45deg, $purple600 -20%, $pink500 100%",
          }}
          weight="bold"
        >
          {children}
        </Text>
      </Row>
      {withHomeLink ? (
        <Row
          justify="center"
          css={{
            top: -25,
          }}
        >
          <NextLink href="/">
            <Link size={14}>
              <Text color="secondary">from </Text>
              <Text
                css={{
                  textGradient: "45deg, $purple600 -20%, $pink500 100%",
                  marginLeft: 5,
                }}
                weight="bold"
              >
                MUNKVERSE
              </Text>
            </Link>
          </NextLink>
        </Row>
      ) : null}
    </Col>
  );
};

export default Title;
