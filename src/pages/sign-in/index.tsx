import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Container,
  Flex,
  Text,
  TextInput,
} from "@mantine/core";
//
import SignInStyled from "./SignIn.styles";
import l34dsLogo from "../../assets/l34ds-logo-full-inverted.png";
import routes from "../../configs/routes";
import { useEffect, useState } from "react";
import { extractErrorMessage } from "../../utils/error";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectJwt, setJwt } from "../../store/user/slice";
import apiService from "../../services/api";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const jwt = useAppSelector(selectJwt);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await apiService.post("/auth/sign-in", {
        email,
        password,
      });

      dispatch(setJwt(res.data));
      navigate(routes.dashboard);
    } catch (error) {
      setError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  // Check for active session
  useEffect(() => {
    if (jwt) {
      navigate(routes.dashboard);
    }
  }, [jwt]);

  return (
    <SignInStyled>
      <Container>
        <div className="form-container">
          <div
            className="logo-container hoverable"
            onClick={() => navigate(routes.landing)}
          >
            <img src={l34dsLogo} alt="L34ds logo" />
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="input-field">
              <TextInput
                label="Email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="input-field">
              <TextInput
                type="password"
                label="Password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <Flex justify="space-between">
              <Checkbox label="Remember me" />
              <Link to={routes.forgotPassword}>
                <Text size="sm">Forgot your password?</Text>
              </Link>
            </Flex>

            <Button type="submit" fullWidth my="md" size="lg">
              {loading ? "Loading..." : "Submit"}
            </Button>

            <Text color="red">{error}</Text>
          </form>

          <Flex
            align="center"
            justify="space-between"
            w={300}
            mx="auto"
            mt={48}
          >
            <Text>Not a customer yet?</Text>
            <Button
              variant="gradient"
              onClick={() => navigate(routes.tryL34ds)}
            >
              Try for free
            </Button>
          </Flex>
        </div>
      </Container>
    </SignInStyled>
  );
}

export default SignIn;
