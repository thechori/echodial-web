import { useNavigate } from "react-router-dom";
//
import { useAppSelector } from "../../store/hooks";
import routes from "../../configs/routes";
import BucketsStyled from "./Buckets.styles";
import { selectBuckets } from "../../store/buckets/slice";
import { Box, Card, Container, Text, Title } from "@mantine/core";

function Buckets() {
  const navigate = useNavigate();

  const buckets = useAppSelector(selectBuckets);

  return (
    <BucketsStyled>
      <Container fluid py="lg">
        <Box>
          {buckets.map((p) => (
            <Card
              onClick={() => navigate(`${routes.buckets}/${p.id}`)}
              key={p.id}
              className="hoverable"
              withBorder
              shadow="md"
              m="md"
            >
              <Title order={3}>{p.name}</Title>
              <Text>{p.description}</Text>
            </Card>
          ))}
        </Box>
      </Container>
    </BucketsStyled>
  );
}

export default Buckets;
