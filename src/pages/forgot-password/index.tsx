import { useState, ChangeEvent } from "react";
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
import { notifications } from "@mantine/notifications";
//
import logo from "../../assets/images/logo/logo@2x.png";
import apiService from "../../services/api";
import { extractErrorMessage } from "../../utils/error";
import { APP_NAME } from "../../configs/labels";

function ResetPasswordRequest() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function resetPasswordRequest() {
    setError("");

    try {
      setLoading(true);

      await apiService.post("/auth/reset-password-request", {
        email,
      });

      // Show success
      notifications.show({
        title: "Password reset request successful",
        message:
          "If we're able to find your account using the email address provided, you should receive following instructions in your inbox on how to reset your password.",
        autoClose: false,
      });

      // Reroute
      navigate(-1);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container
      maw={500}
      h="100vh"
      display="flex"
      style={{ alignItems: "center" }}
    >
      <Box>
        <Box w={300} mx="auto" mb={32}>
          <Image src={logo} alt={`${APP_NAME} logo`} />
        </Box>
        <Title ta="center" order={2} py="lg">
          Reset your password
        </Title>
        <Text ta="center" size="large">
          Enter your email address and we'll send you a link to reset your
          password.
        </Text>
        <Box maw={300} mx="auto" py="md">
          <TextInput
            my="xs"
            type="email"
            label="Email address"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            error={error}
          />
          <Button
            my="xs"
            fullWidth
            onClick={resetPasswordRequest}
            loading={loading}
          >
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
