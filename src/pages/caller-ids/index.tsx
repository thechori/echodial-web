import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Grid,
  Group,
  Modal,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { BiPlus, BiRefresh } from "react-icons/bi";
import { notifications } from "@mantine/notifications";
//
import PhoneNumbersStyled from "./PhoneNumbers.styles";
import phoneFormatter from "../../utils/phone-formatter";
import PhoneNumberMenu from "./PhoneNumberMenu";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { extractErrorMessage } from "../../utils/error";
import {
  useAddCallerIdMutation,
  useDeleteCallerIdMutation,
  useGetCallerIdsQuery,
  useLazyGetCallerIdsQuery,
} from "../../services/caller-id";

function PhoneNumbers() {
  const [
    addCallerId,
    { error: errorAddCallerId, isLoading: isLoadingAddCallerId },
  ] = useAddCallerIdMutation();

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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agree, setAgree] = useState(false);

  async function handleSubmit() {
    try {
      await addCallerId(phoneNumber).unwrap(); // Using .unwrap to handle error HERE
      notifications.show({
        title: "Success",
        message: "Check your phone!",
      });
      close();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: extractErrorMessage(error),
      });
    }
  }

  return (
    <PhoneNumbersStyled>
      <Modal opened={opened} onClose={close} title="Add Caller ID">
        <Modal.Body>
          <Text mb="md">
            In order to verify that you own this number, we'll send you a text
            message and a phone call simultaneously. Enter the Validation Code
            that you receive via SMS in the phone call to complete this step.
          </Text>

          <Group>
            <TextInput
              label="Phone number"
              miw={300}
              required
              placeholder="e.g., 832-111-3333"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <Checkbox
              miw={300}
              label="I verify that this number belongs to me"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />

            <Button
              disabled={!agree || phoneNumber.length < 10}
              loading={isLoadingAddCallerId}
              onClick={handleSubmit}
            >
              Submit
            </Button>

            <Text w="100%" color="red">
              {extractErrorMessage(errorAddCallerId)}
            </Text>
          </Group>
        </Modal.Body>
      </Modal>

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
                        onDelete={() => deleteCallerId(cid.id)}
                        isLoading={isLoadingDeleteCallerId}
                      />
                    </Flex>
                  ))
                ) : errorCallerIds ? (
                  <Text color="red">{extractErrorMessage(errorCallerIds)}</Text>
                ) : errorDeleteCallerId ? (
                  <Text color="red">
                    {extractErrorMessage(errorDeleteCallerId)}
                  </Text>
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
