import { useNavigate } from "react-router-dom";
//
import { useAppSelector } from "../../store/hooks";
import routes from "../../configs/routes";
import PhasesStyled from "./Phases.styles";
import { selectPhases } from "../../store/phases/slice";
import { Box, Card, Container, Text, Title } from "@mantine/core";

function Phases() {
  const navigate = useNavigate();

  const phases = useAppSelector(selectPhases);

  return (
    <PhasesStyled>
      <Container py="lg">
        <Box>
          {phases.map((p) => (
            <Card
              onClick={() => navigate(`${routes.phases}/${p.id}`)}
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
    </PhasesStyled>
  );
}

export default Phases;
