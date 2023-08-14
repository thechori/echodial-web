import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { BiPlus, BiRefresh } from "react-icons/bi";
//
import PhoneNumbersStyled from "./PhoneNumbers.styles";
import phoneFormatter from "../../utils/phone-formatter";
import PhoneNumberMenu from "./PhoneNumberMenu";
import { useDisclosure } from "@mantine/hooks";
import {
  useDeleteCallerIdMutation,
  useGetCallerIdsQuery,
  useLazyGetCallerIdsQuery,
} from "../../services/caller-id";
import NewCallerIdModal from "./NewCallerIdModal";
import { extractErrorMessage } from "../../utils/error";

function PhoneNumbers() {
  const [error, setError] = useState("");
  const {
    data: callerIds,
    error: errorCallerIds,
    isLoading: isLoadingCallerIds,
  } = useGetCallerIdsQuery();

  const [
    deleteCallerId,
    { isLoading: isLoadingDeleteCallerId, error: errorDeleteCallerId },
  ] = useDeleteCallerIdMutation();

  const [getCallerIds] = useLazyGetCallerIdsQuery();

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (errorCallerIds) {
      setError(extractErrorMessage(errorCallerIds));
    } else if (errorDeleteCallerId) {
      setError(extractErrorMessage(errorDeleteCallerId));
    } else {
      setError("");
    }
  }, [errorCallerIds, errorDeleteCallerId]);

  return (
    <PhoneNumbersStyled>
      <NewCallerIdModal opened={opened} close={close} />

      <Container fluid py="lg">
        <Grid>
          <Grid.Col xs={12} sm={12}>
            <Card shadow="md" withBorder radius="md" m="lg">
              <Title order={2} mb={16}>
                Personal
              </Title>
              <Text>Your personal numbers verified with us</Text>

              <Box p="lg">
                {callerIds && callerIds.length ? (
                  callerIds.map((cid) => (
                    <Flex
                      key={cid.id}
                      py={4}
                      align="center"
                      justify="space-between"
                    >
                      <Flex align="center">
                        <ThemeIcon color="teal" size={24} radius="xl">
                          <IconCircleCheck size="1rem" />
                        </ThemeIcon>
                        <Box ml={16}>{phoneFormatter(cid.phone_number)}</Box>
                      </Flex>
                      <PhoneNumberMenu
                        onDelete={() =>
                          deleteCallerId({
                            id: cid.id,
                            twilio_sid: cid.twilio_sid,
                          })
                        }
                        isLoading={isLoadingDeleteCallerId}
                      />
                    </Flex>
                  ))
                ) : (
                  <Text size="sm" italic color="dimmed">
                    No numbers found
                  </Text>
                )}
              </Box>

              <Text color="red">{error}</Text>

              <Group>
                <Button onClick={open} leftIcon={<BiPlus />}>
                  Add new
                </Button>

                <Button
                  loading={isLoadingCallerIds}
                  onClick={() => getCallerIds()}
                  leftIcon={<BiRefresh />}
                >
                  Refresh
                </Button>
              </Group>
            </Card>
          </Grid.Col>

          {/* <Grid.Col xs={12} sm={12}>
            <Card
              className="disabled"
              shadow="md"
              withBorder
              radius="md"
              m="lg"
            >
              <Title order={2} mb={16}>
                {APP_NAME}
              </Title>
              <Text>Phone numbers purchased through subscription</Text>
              <Box p="lg">
                {l34dsOwnedPhoneNumbers.length ? (
                  l34dsOwnedPhoneNumbers.map((number) => (
                    <Flex
                      key={number.id}
                      py={4}
                      align="center"
                      justify="space-between"
                    >
                      <Flex align="center">
                        <ThemeIcon color="teal" size={24} radius="xl">
                          <IconCircleCheck size="1rem" />
                        </ThemeIcon>
                        <Box ml={16}>{phoneFormatter(number.number)}</Box>
                      </Flex>
                      <PhoneNumberMenu />
                    </Flex>
                  ))
                ) : (
                  <Text size="sm" italic color="dimmed">
                    No numbers found
                  </Text>
                )}
              </Box>
              <Group>
                <Button onClick={open} leftIcon={<BiPlus />}>
                  Add new
                </Button>

                <Button leftIcon={<BiRefresh />}>Refresh</Button>
              </Group>{" "}
            </Card>
          </Grid.Col> */}
        </Grid>
      </Container>
    </PhoneNumbersStyled>
  );
}

export default PhoneNumbers;
