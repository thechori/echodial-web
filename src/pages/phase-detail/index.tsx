import { useNavigate, useParams } from "react-router-dom";
//
import { useAppSelector } from "../../store/hooks";
import { selectPhases } from "../../store/buckets/slice";
import { Box, Button, Container, Text, Title } from "@mantine/core";
import routes from "../../configs/routes";
import { useEffect, useState } from "react";
import { TPhase } from "../../store/buckets/types";

function PhaseDetail() {
  const navigate = useNavigate();

  const [p, setP] = useState<null | TPhase>(null);
  const phases = useAppSelector(selectPhases);

  const { phaseId } = useParams();

  if (!phaseId) {
    alert("No phase found");
  }

  function goBack() {
    navigate(routes.buckets);
  }

  function renderDetails() {
    if (p) {
      return (
        <>
          <Text>{p.id}</Text>
          <Text>{p.name}</Text>
          <Text>{p.description}</Text>
        </>
      );
    }
    return <Text>No phase found</Text>;
  }

  useEffect(() => {
    if (!phaseId || !phases) return;
    const selectedPhase = phases.find((p) => p.id === phaseId);
    setP(selectedPhase || null);
  }, [phases, phaseId]);

  return (
    <Box>
      <Container>
        <Title order={2}>Phase Detail</Title>
        <Text>Here are some Phases</Text>

        {renderDetails()}

        <Button onClick={goBack}>Back</Button>
      </Container>
    </Box>
  );
}

export default PhaseDetail;
