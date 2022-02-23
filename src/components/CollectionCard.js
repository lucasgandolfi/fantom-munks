import { Card, Col, Row, Text } from "@nextui-org/react";
import { useRouter } from "next/router";

const CollectionCard = ({ title, src, href }) => {
  const router = useRouter();

  const onClick = () => {
    router.push(href);
  };

  return (
    <Card
      cover
      hoverable
      clickable
      onClick={onClick}
      css={{ w: "100%", h: "400px", p: 0 }}
    >
      <Card.Body>
        <Card.Image src={src} alt={title} width="100%" showSkeleton={false} />
      </Card.Body>
      <Card.Footer
        blur
        css={{
          position: "absolute",
          bgBlur: "#0f1114",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Row>
          <Col>
            <Row>
              <Text color="#ffffff" size={16}>
                {title}
              </Text>
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default CollectionCard;
