import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Loader,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCircleCheck, IconAlertCircle } from "@tabler/icons-react";
import { BiPlus } from "react-icons/bi";
//
import phoneFormatter from "../../utils/phone-formatter";
import PhoneNumberMenu from "./PhoneNumberMenu";
import { useDisclosure } from "@mantine/hooks";
import {
  useDeleteCallerIdMutation,
  useGetCallerIdsQuery,
} from "../../services/caller-id";
import NewCallerIdModal from "./NewCallerIdModal";
import { extractErrorMessage } from "../../utils/error";
import NewCallerIdValidatingModal from "./NewCallerIdValidatingModal";

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

  const [opened, { open, close }] = useDisclosure(false);
  const [openedValidating, { open: openValidating, close: closeValidating }] =
    useDisclosure(false);

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
    <Container fluid p="md">
      <Grid>
        <Grid.Col xs={12} sm={12} md={6}>
          <Card shadow="md" withBorder radius="md">
            <Flex align="center" justify="space-between" mb="sm">
              <Title order={3}>My numbers</Title>
            </Flex>
            <Text>
              These are your verified numbers available to make outbound calls
              from.
            </Text>

            <Box p="lg">
              {callerIds && callerIds.length ? (
                callerIds.map((cid) => (
                  <Flex
                    key={cid.id}
                    py={4}
                    align="center"
                    justify="space-between"
                    w={250}
                  >
                    <Flex align="center">
                      <ThemeIcon
                        color={cid.twilio_sid ? "teal" : "yellow"}
                        size={24}
                        radius="xl"
                      >
                        {cid.twilio_sid ? (
                          <IconCircleCheck size="1rem" />
                        ) : (
                          <IconAlertCircle size="1rem" />
                        )}
                      </ThemeIcon>
                      <Box ml={16}>{phoneFormatter(cid.phone_number)}</Box>
                    </Flex>
                    <PhoneNumberMenu
                      onDelete={() => deleteCallerId(cid.phone_number)}
                      isLoading={isLoadingDeleteCallerId}
                    />
                  </Flex>
                ))
              ) : isLoadingCallerIds ? (
                <Loader py="lg" />
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
              <Title order={3} mb={16}>
                {APP_NAME}
              </Title>
              <Text>Phone numbers purchased through subscription</Text>
              <Box p="lg">
                {echodialOwnedPhoneNumbers.length ? (
                  echodialOwnedPhoneNumbers.map((number) => (
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

      <NewCallerIdModal
        opened={opened}
        close={close}
        triggerOpenValidatingModal={openValidating}
      />
      <NewCallerIdValidatingModal
        opened={openedValidating}
        close={closeValidating}
      />
    </Container>
  );
}

export default PhoneNumbers;
