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
import contacts from "../dialer/contacts";
import phoneFormatter from "../../utils/phone-formatter";
import PhoneNumberMenu from "./PhoneNumberMenu";

function PhoneNumbers() {
  return (
    <PhoneNumbersStyled>
      <Container p="xl">
        <Grid>
          <Grid.Col xs={12} sm={6}>
            <Card shadow="md" withBorder radius="md" m="lg">
              <Title order={2} mb={16}>
                Phone Numbers (L34ds)
              </Title>

              <Text>The numbers included with your L34ds subscription</Text>

              <Box p="lg">
                {contacts.map((c) => (
                  <Flex
                    key={c.id}
                    py={4}
                    align="center"
                    justify="space-between"
                  >
                    <Flex align="center">
                      <ThemeIcon color="teal" size={24} radius="xl">
                        <IconCircleCheck size="1rem" />
                      </ThemeIcon>
                      <Box ml={16}>{phoneFormatter(c.phone)}</Box>
                    </Flex>
                    <PhoneNumberMenu />
                  </Flex>
                ))}
              </Box>

              <Button leftIcon={<BiPlus />}>Add new</Button>
            </Card>
          </Grid.Col>
          <Grid.Col xs={12} sm={6}>
            <Card shadow="md" withBorder radius="md" m="lg">
              <Title order={2} mb={16}>
                Phone Numbers (Personal)
              </Title>
              <Text>Your personal numbers you've verified with L34ds</Text>

              <Box p="lg">
                {["+18326460869", "+18328638635"].map((number) => (
                  <Flex
                    key={number}
                    py={4}
                    align="center"
                    justify="space-between"
                  >
                    <Flex align="center">
                      <ThemeIcon color="teal" size={24} radius="xl">
                        <IconCircleCheck size="1rem" />
                      </ThemeIcon>
                      <Box ml={16}>{phoneFormatter(number)}</Box>
                    </Flex>
                    <PhoneNumberMenu />
                  </Flex>
                ))}
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
