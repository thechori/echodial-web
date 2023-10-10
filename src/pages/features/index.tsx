import {
  Box,
  Button,
  Card,
  Center,
  Container,
  List,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
//
import FeaturesStyled from "./Features.styles";
import routes from "../../configs/routes";

function Features() {
  const navigate = useNavigate();
  return (
    <FeaturesStyled>
      <Container py="xl">
        <Card withBorder shadow="md" p="xl" mx="auto" maw={800}>
          <Box maw={440} mx="auto">
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
                <List.Item>The world's first truly autonomous dialer</List.Item>
                <List.Item>
                  Industry leading user-friendly and intuitive interface
                </List.Item>
                <List.Item>
                  Verified calls with YOUR phone number (or one of ours)
                </List.Item>
                <List.Item>Mobile friendly -- call on the go!</List.Item>
                <List.Item>
                  1500 minutes included in our Standard plan (50% more than our
                  big competitors)
                </List.Item>
                <List.Item>Web-based, no need to download an app</List.Item>
                <List.Item>100% satisfaction guarantee</List.Item>
              </List>
            </Box>
            <Center>
              <Button
                variant="gradient"
                size="xl"
                onClick={() => navigate(routes.signUp)}
                mt={32}
              >
                Try for free
              </Button>
            </Center>
          </Box>
        </Card>
      </Container>
    </FeaturesStyled>
  );
}

export default Features;
