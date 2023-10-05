import {
  Box,
  Button,
  Container,
  Image,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
//
import logo from "../../assets/EchoDial-temp-logo-full-dark.png";

function ResetPasswordRequest() {
  const navigate = useNavigate();
  return (
    <Container
      maw={500}
      h="100vh"
      display="flex"
      style={{ alignItems: "center" }}
    >
      <Box>
        <Box w={300} mx="auto" mb={32}>
          <Image src={logo} alt="EchoDial logo" />
        </Box>
        <Title ta="center" order={2} py="lg">
          Reset your password
        </Title>
        <Text ta="center" size="large">
          Enter your email address and we'll send you a link to reset your
          password.
        </Text>
        <Box maw={300} mx="auto" py="md">
          <TextInput my="xs" type="email" label="Email address" />
          <Button my="xs" fullWidth>
            Submit
          </Button>
          <Button
            my="xs"
            fullWidth
            onClick={() => navigate(-1)}
            variant="white"
          >
            Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPasswordRequest;
