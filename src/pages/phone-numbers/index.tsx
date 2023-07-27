import { Card, Container, List, Text, ThemeIcon, Title } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
//
import PhoneNumbersStyled from "./PhoneNumbers.styles";
import contacts from "../dialer/contacts";
import phoneFormatter from "../../utils/phone-formatter";

function PhoneNumbers() {
  return (
    <PhoneNumbersStyled>
      <Container p="xl">
        <Card shadow="md" withBorder radius="md" m="md">
          <Title order={2} mb={16}>
            L34ds Phone Numbers
          </Title>
          <Text>Here are some PhoneNumbers</Text>
          <List
            py={16}
            spacing="xs"
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCircleCheck size="1rem" />
              </ThemeIcon>
            }
          >
            {contacts.map((c) => (
              <List.Item key={c.id}>{phoneFormatter(c.phone)}</List.Item>
            ))}
          </List>
        </Card>

        <Card shadow="md" withBorder radius="md" m="md">
          <Title order={2} mb={16}>
            Your Phone Numbers
          </Title>
          <Text>
            Put your own phone number to use to increase the likelihood of
            success when dialing people.
          </Text>
          <List
            py={16}
            spacing="xs"
            icon={
              <ThemeIcon color="teal" size={24} radius="xl">
                <IconCircleCheck size="1rem" />
              </ThemeIcon>
            }
          >
            <List.Item>(832) 646-0869</List.Item>
          </List>
        </Card>
      </Container>
    </PhoneNumbersStyled>
  );
}

export default PhoneNumbers;
