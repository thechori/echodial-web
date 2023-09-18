import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconCircleCheck } from "@tabler/icons-react";
//
import SignUpStyled from "./SignUp.styles";
import echodialLogo from "../../assets/EchoDial-temp-logo-full.png";
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
import { APP_NAME } from "../../configs/names";

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

  async function handleFormSubmit(e: FormEvent) {
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
            <img src={echodialLogo} alt="EchoDial logo" />
          </Box>

          <Box py="md">
            <Title color="white" order={1} weight={200}>
              Start calling with {APP_NAME} for free.
            </Title>
            <Title color="white" order={1} weight={200}>
              No credit card required.
            </Title>
          </Box>
        </Box>

        <div className="card">
          <div className="left">
            <div className="value-proposition">
              <div className="title">With EchoDial you can:</div>
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
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLastName(e.target.value)
                }
              />

              <TextInput
                py="sm"
                required
                name="email"
                type="email"
                placeholder="Email address *"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />

              <TextInput
                py="sm"
                required
                name="password"
                type="password"
                placeholder="Password *"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />

              <Flex align="flex-start" justify="space-between">
                <Checkbox
                  pr="sm"
                  required
                  checked={acceptTerms}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAcceptTerms(e.target.checked)
                  }
                />
                <Text size="xs">
                  I accept the <a href="#">EchoDial Terms of Service</a> and
                  have read the <a href="#">EchoDial Privacy Notice</a>.
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
