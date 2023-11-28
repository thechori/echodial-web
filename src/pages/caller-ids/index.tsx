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
import { notifications } from "@mantine/notifications";
//
import phoneFormatter from "../../utils/phone-formatter";
import PhoneNumberMenu from "./PhoneNumberMenu";
import {
  useDeleteCallerIdMutation,
  useGetCallerIdsQuery,
} from "../../services/caller-id";
import { extractErrorMessage } from "../../utils/error";
import { useAppDispatch } from "../../store/hooks";
import { setShowNewCallerIdModal } from "../../store/dialer/slice";

function PhoneNumbers() {
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const {
    data: callerIds,
    error: errorCallerIds,
    isLoading: isLoadingCallerIds,
  } = useGetCallerIdsQuery();

  const [
    deleteCallerId,
    { isLoading: isLoadingDeleteCallerId, error: errorDeleteCallerId },
  ] = useDeleteCallerIdMutation();

  const handleDeleteCallerId = async (phone_number: string) => {
    try {
      await deleteCallerId(phone_number);
      notifications.show({ message: "Successfully deleted phone number." });
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

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
                      onDelete={() => handleDeleteCallerId(cid.phone_number)}
                      isLoading={isLoadingDeleteCallerId}
                    />
                  </Flex>
                ))
              ) : isLoadingCallerIds ? (
                <Loader py="lg" />
              ) : (
                <Text color="dimmed" py="lg">
                  Hey! 👋 You don’t have any numbers yet. Add one to get
                  started.
                </Text>
              )}
            </Box>

            <Text color="red">{error}</Text>

            <Group>
              <Button
                onClick={() => dispatch(setShowNewCallerIdModal(true))}
                leftIcon={<BiPlus />}
              >
                Add new
              </Button>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default PhoneNumbers;
