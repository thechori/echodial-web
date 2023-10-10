import { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Image,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
//
import logo from "../../assets/EchoDial-temp-logo-full-dark.png";
import apiService from "../../services/api";
import { extractErrorMessage } from "../../utils/error";

function ResetPassword() {
  let { resetPasswordToken } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function resetPassword() {
    setError("");

    // Check for resetPasswordToken
    if (!resetPasswordToken) {
      setError(
        "No token found. Please try clicking the link in your email again."
      );
      return;
    }

    // Check for matching
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    // Check for minimum criteria
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);

      await apiService.post("/auth/reset-password", {
        email,
        password,
        token: resetPasswordToken,
      });

      // Show success
      notifications.show({
        title: "Password reset successful",
        message:
          "Your password was successfully changed. Please sign in using your new credentials.",
        variant: "success",
      });

      // Reroute
      navigate("/sign-in");
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function getTokenInfo() {
    try {
      setLoading(true);
      setError("");
      const email = (
        await apiService.get(`/auth/reset-password-token/${resetPasswordToken}`)
      ).data as string;
      setEmail(email);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTokenInfo();
  }, []);

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
          <form autoComplete="off">
            <TextInput
              my="xs"
              type="email"
              label="Email address"
              readOnly
              disabled
              value={email}
            />
            <TextInput
              my="xs"
              label="New password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <TextInput
              my="xs"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPasswordConfirmation(e.target.value)
              }
            />
            <Text color="red">{error}</Text>
            <Button my="xs" fullWidth onClick={resetPassword} loading={loading}>
              Submit
            </Button>
          </form>
          <Button
            my="xs"
            fullWidth
            onClick={() => navigate("/")}
            variant="white"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPassword;
