import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import * as amplitude from "@amplitude/analytics-browser";
import { useNavigate } from "react-router-dom";
import { IconCircleCheck } from "@tabler/icons-react";
import { isPossiblePhoneNumber } from "react-phone-number-input";
//
import SignUpStyled from "./SignUp.styles";
import appLogo from "../../assets/EchoDial-temp-logo-full.png";
import routes from "../../configs/routes";
import { extractErrorMessage } from "../../utils/error";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectJwt, setJwt } from "../../store/user/slice";
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
import { APP_NAME } from "../../configs/labels";
import { PhoneInput } from "../../components/phone-input";
import { MARKETING_SITE_URL } from "../../configs/urls";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const jwt = useAppSelector(selectJwt);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();

    amplitude.track("Sign Up");

    // Clear errors
    setError("");
    setPhoneError("");

    // Validate phone
    const isValid = isPossiblePhoneNumber(phone);
    if (!isValid) {
      setPhoneError("Invalid phone number");
      return;
    }

    // API call
    setLoading(true);

    try {
      // Create User
      await apiService.post("/user", {
        firstName,
        lastName,
        email,
        password,
        phone,
      });

      // Sign in to new User account
      const { data } = await apiService.post("/auth/sign-in", {
        email,
        password,
      });

      dispatch(setJwt(data));
      navigate(routes.leads);
    } catch (error) {
      setError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  // Check for active session
  useEffect(() => {
    if (jwt) {
      navigate(routes.leads);
    }
  }, [jwt]);

  return (
    <SignUpStyled>
      <Container>
        <Box ta="center" py="lg">
          <Box
            py="md"
            className="logo-container hoverable"
            onClick={() => document.location.replace(MARKETING_SITE_URL)}
          >
            <img src={appLogo} alt={`${APP_NAME} logo`} />
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
              <div className="title">With {APP_NAME} you get:</div>
              <List
                spacing="md"
                size="md"
                center
                icon={
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck size="1rem" />
                  </ThemeIcon>
                }
              >
                <List.Item>The world's first truly autonomous dialer</List.Item>
                <List.Item>Best-in-class user interface</List.Item>
                <List.Item>High-quality voice calls</List.Item>
                <List.Item>1500+ voice call minutes per month</List.Item>
                <List.Item>Access to premium support</List.Item>
                <List.Item>Free trial</List.Item>
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

              <Box py="sm">
                <PhoneInput
                  required
                  label="Phone number"
                  value={phone}
                  onChange={(p: any) => setPhone(p)}
                  error={phoneError}
                  flush
                />
              </Box>

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
                  I accept the <a href="#">{APP_NAME} Terms of Service</a> and
                  have read the <a href="#">{APP_NAME} Privacy Notice</a>.
                </Text>
              </Flex>

              <Box py="md">
                <Text size="sm" color="red">
                  {error}
                </Text>
              </Box>

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
