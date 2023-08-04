import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconCircleCheck } from "@tabler/icons-react";
//
import SignUpStyled from "./SignUp.styles";
import l34dsLogo from "../../assets/l34ds-logo-full.png";
import routes from "../../configs/routes";
import { extractErrorMessage } from "../../utils/error";
import { useAppDispatch } from "../../store/hooks";
import { setJwt } from "../../store/user/slice";
import apiService from "../../services/api";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  List,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Clear errors
    setError("");

    // API call
    setLoading(true);

    try {
      // Create User
      await apiService.post("/user", {
        firstName,
        lastName,
        email,
        password,
      });

      // Sign in to new User account
      const { data } = await apiService.post("/auth/sign-in", {
        email,
        password,
      });

      dispatch(setJwt(data));
      navigate(routes.dashboard);
    } catch (error) {
      setError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SignUpStyled>
      <Container>
        <Box ta="center" py="lg">
          <Box
            py="md"
            className="logo-container hoverable"
            onClick={() => navigate(routes.landing)}
          >
            <img src={l34dsLogo} alt="L34ds logo" />
          </Box>

          <Box py="md">
            <Title color="white" order={1} weight={200}>
              Start building with L34DS for free.
            </Title>
            <Title color="white" order={1} weight={200}>
              No credit card required.
            </Title>
          </Box>
        </Box>

        <div className="card">
          <div className="left">
            <div className="value-proposition">
              <div className="title">With L34ds you can:</div>
              <List
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck size="1rem" />
                  </ThemeIcon>
                }
              >
                <List.Item>SMS Marketing</List.Item>
                <List.Item>Autodialer</List.Item>
                <List.Item>Triple simultaneous dialing</List.Item>
                <List.Item>Instantaneous call handoffs</List.Item>
                <List.Item>On-hold functionality</List.Item>
                <List.Item>Free leads every month</List.Item>
              </List>
            </div>
          </div>
          <div className="right">
            <form onSubmit={handleFormSubmit}>
              <TextInput
                py="sm"
                required
                type="text"
                name="firstName"
                placeholder="First name *"
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFirstName(e.target.value)
                }
              />

              <TextInput
                py="sm"
                required
                type="text"
                name="lastName"
                placeholder="Last name *"
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLastName(e.target.value)
                }
              />

              <TextInput
                py="sm"
                required
                type="email"
                placeholder="Email address *"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />

              <TextInput
                py="sm"
                required
                type="password"
                placeholder="Password *"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />

              <Flex align="flex-start" justify="space-between">
                <Checkbox
                  pr="sm"
                  required
                  checked={acceptTerms}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAcceptTerms(e.target.checked)
                  }
                />
                <Text size="xs">
                  I accept the <a href="#">L34ds Terms of Service</a> and have
                  read the <a href="#">L34ds Privacy Notice</a>.
                </Text>
              </Flex>

              <div style={{ height: 24 }} />
              <div className="error">{error}</div>

              <Button fullWidth size="lg" variant="gradient" type="submit">
                {loading ? "Loading..." : "Start your free trial"}
              </Button>
            </form>
          </div>
        </div>

        <Flex align="center" justify="space-between" w={300} py={32} mx="auto">
          <Text color="white">Already have an account?</Text>
          <Button variant="white" onClick={() => navigate(routes.signIn)}>
            Sign In
          </Button>
        </Flex>
      </Container>
    </SignUpStyled>
  );
}

export default SignUp;
