import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { BiPlus } from "react-icons/bi";
//
import PhoneNumbersStyled from "./PhoneNumbers.styles";
import phoneFormatter from "../../utils/phone-formatter";
import PhoneNumberMenu from "./PhoneNumberMenu";

type TPhoneNumber = {
  id: string;
  name: string;
  description: string;
  number: string;
};

function PhoneNumbers() {
  const userOwnedPhoneNumbers: TPhoneNumber[] = [];
  const l34dsOwnedPhoneNumbers: TPhoneNumber[] = [];

  return (
    <PhoneNumbersStyled>
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

              <Button leftIcon={<BiPlus />}>Add new</Button>
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

              <Button leftIcon={<BiPlus />}>Add new</Button>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </PhoneNumbersStyled>
  );
}

export default PhoneNumbers;
