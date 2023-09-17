import { useNavigate, useParams } from "react-router-dom";
//
import { useAppSelector } from "../../store/hooks";
import { selectBuckets } from "../../store/buckets/slice";
import { Box, Button, Container, Text, Title } from "@mantine/core";
import routes from "../../configs/routes";
import { useEffect, useState } from "react";
import { TBucket } from "../../store/buckets/types";

function BucketDetail() {
  const navigate = useNavigate();

  const [p, setP] = useState<null | TBucket>(null);
  const buckets = useAppSelector(selectBuckets);

  const { bucketId } = useParams();

  if (!bucketId) {
    alert("No bucket found");
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
    return <Text>No bucket found</Text>;
  }

  useEffect(() => {
    if (!bucketId || !buckets) return;
    const selectedBucket = buckets.find((p) => p.id === bucketId);
    setP(selectedBucket || null);
  }, [buckets, bucketId]);

  return (
    <Box>
      <Container>
        <Title order={2}>Bucket Detail</Title>
        <Text>Here are some Buckets</Text>

        {renderDetails()}

        <Button onClick={goBack}>Back</Button>
      </Container>
    </Box>
  );
}

export default BucketDetail;
