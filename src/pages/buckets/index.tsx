import { useNavigate } from "react-router-dom";
//
import { useAppSelector } from "../../store/hooks";
import routes from "../../configs/routes";
import BucketsStyled from "./Buckets.styles";
import { selectBuckets } from "../../store/buckets/slice";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { BsPersonCircle } from "react-icons/bs";
import phoneFormatter from "../../utils/phone-formatter";
import { IconExternalLink, IconPhone, IconSettings } from "@tabler/icons-react";

function Buckets() {
  const navigate = useNavigate();

  const buckets = useAppSelector(selectBuckets);

  return (
    <BucketsStyled>
      <Container fluid py="lg">
        <Flex wrap="wrap">
          {buckets.length === 0 ? (
            <Box>
              <Title>No Buckets found. Create one</Title>
              <Button>New Bucket</Button>
            </Box>
          ) : (
            buckets.map((b) => (
              <Card key={b.id} className="bucket" withBorder shadow="md" m="md">
                <Flex align="center" justify="space-between">
                  <Tooltip label={b.description}>
                    <Flex
                      align="center"
                      className="hoverable"
                      onClick={() => navigate(`${routes.buckets}/${b.id}`)}
                    >
                      <Title color="blue" order={3} mr={4}>
                        {b.name}
                      </Title>
                      <IconExternalLink color="grey" size="1rem" />
                    </Flex>
                  </Tooltip>

                  <Flex>
                    <ActionIcon>
                      <IconSettings size="1.5rem" />
                    </ActionIcon>
                    <ActionIcon>
                      <IconPhone
                        fill="lightgreen"
                        color="green"
                        size="1.5rem"
                      />
                    </ActionIcon>
                  </Flex>
                </Flex>
                <Box p="md" h={300} style={{ overflowY: "scroll" }}>
                  {b.leads.length === 0 ? (
                    <Text color="dimmed">No leads</Text>
                  ) : (
                    b.leads.map((l) => (
                      <Flex key={l.id} align="center" justify="space-between">
                        <Box>
                          <BsPersonCircle fontSize="1.5rem" />
                        </Box>
                        <Box>
                          <Text size="md">
                            {l.first_name} {l.last_name}
                          </Text>
                          <Text size="xs">{phoneFormatter(l.phone)}</Text>
                        </Box>
                        <Box>
                          <ActionIcon>
                            <IconPhone
                              fill="lightgreen"
                              color="green"
                              size="1.25rem"
                            />
                          </ActionIcon>
                        </Box>
                      </Flex>
                    ))
                  )}
                </Box>
              </Card>
            ))
          )}
        </Flex>
      </Container>
    </BucketsStyled>
  );
}

export default Buckets;
