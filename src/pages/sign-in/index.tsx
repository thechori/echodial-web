import { useNavigate } from "react-router-dom";
//
import SignInStyled from "./SignIn.styles";
import l34dsLogo from "../../assets/l34ds-logo-full.png";
import routes from "../../configs/routes";
import { useState } from "react";
import { extractErrorMessage } from "../../utils/error";
import { useAppDispatch } from "../../store/hooks";
import { setJwt } from "../../store/user/slice";
import apiService from "../../services/api";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  return (
    <SignInStyled>
      <div className="form-container">
        <div
          className="logo-container hoverable"
          onClick={() => navigate(routes.landing)}
        >
          <img src={l34dsLogo} alt="L34ds logo" />
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email address..."
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="input-field">
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button className="full" type="submit">
            {loading ? "Loading..." : "Submit"}
          </button>

          <div className="error">{error}</div>

          <hr />

          <div className="lower-links">
            <div className="input-checkbox">
              <input type="checkbox" />
              <label>Remember me</label>
            </div>
            <a href={routes.forgotPassword}>Forgot your password?</a>
          </div>
        </form>

        <div className="lower-lower-links">
          <span>Not a customer yet?</span>
          <button onClick={() => navigate(routes.tryL34ds)}>
            Try for free
          </button>
        </div>
      </div>
    </SignInStyled>
  );
}

export default SignIn;
