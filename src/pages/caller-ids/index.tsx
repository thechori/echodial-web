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
//
import PhoneNumbersStyled from "./PhoneNumbers.styles";
import phoneFormatter from "../../utils/phone-formatter";
import PhoneNumberMenu from "./PhoneNumberMenu";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import apiService from "../../services/api";
import { extractErrorMessage } from "../../utils/error";

type TPhoneNumber = {
  id: string;
  name: string;
  description: string;
  number: string;
};

function PhoneNumbers() {
  const userOwnedPhoneNumbers: TPhoneNumber[] = [];
  const l34dsOwnedPhoneNumbers: TPhoneNumber[] = [];

  const [opened, { open, close }] = useDisclosure(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      const res = await apiService.post("/caller-id", {
        phone_number: `+1${phoneNumber}`, // Hard code country code for better UX
      });
      console.log("success", res);
      close();
    } catch (error) {
      setError(extractErrorMessage(error));
    } finally {
      setLoading(false);
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
              placeholder="e.g., 8321113333 (no dashes or spaces)"
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
              disabled={!agree || phoneNumber.length !== 10}
              loading={loading}
              onClick={handleSubmit}
            >
              Submit
            </Button>

            <Text w="100%" color="red">
              {error}
            </Text>
          </Group>
        </Modal.Body>
      </Modal>

      <Container p="xl">
        <Grid>
          <Grid.Col xs={12} sm={12}>
            <Card shadow="md" withBorder radius="md" m="lg">
              <Title order={2} mb={16}>
                Personal
              </Title>
              <Text>Your personal numbers you've verified with L34ds</Text>

              <Box p="lg">
                {userOwnedPhoneNumbers.length ? (
                  userOwnedPhoneNumbers.map((number) => (
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
              </Group>
            </Card>
          </Grid.Col>

          <Grid.Col xs={12} sm={12}>
            <Card
              className="disabled"
              shadow="md"
              withBorder
              radius="md"
              m="lg"
            >
              <Title order={2} mb={16}>
                L34ds
              </Title>
              <Text>The numbers included with your L34ds subscription</Text>
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
          </Grid.Col>
        </Grid>
      </Container>
    </PhoneNumbersStyled>
  );
}

export default PhoneNumbers;
