import {
  Box,
  Card,
  Container,
  List,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
//
import FeaturesStyled from "./Features.styles";

function Features() {
  return (
    <FeaturesStyled>
      <Container>
        <Card withBorder shadow="md" p="lg" maw={400}>
          <Title order={1} weight={200} mb="md">
            Features
          </Title>

          <Box>
            <List
              ta="left"
              spacing="sm"
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCircleCheck size="1rem" />
                </ThemeIcon>
              }
            >
              <List.Item>Turbo Dialer ©</List.Item>
              <List.Item>
                Verified calls with YOUR phone number (
                <Text span italic weight={500} color="blue">
                  no more blocked calls
                </Text>
                )
              </List.Item>
              <List.Item>SMS marketing</List.Item>
              <List.Item>Mobile friendly -- call on the go!</List.Item>
              <List.Item>100% satisfaction guarantee</List.Item>
            </List>
          </Box>
        </Card>
      </Container>
    </FeaturesStyled>
  );
}

export default Features;
