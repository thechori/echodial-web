import { useNavigate } from "react-router-dom";
//
import SignInStyled from "./SignIn.styles";
import l34dsLogo from "../../assets/l34ds-logo-full.png";

function SignIn() {
  const navigate = useNavigate();

  return (
    <SignInStyled>
      <div className="form-container">
        <div className="logo-container hoverable" onClick={() => navigate("/")}>
          <img src={l34dsLogo} alt="L34ds logo" />
        </div>

        <form>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="Email address..." />
          </div>

          <div className="input-field">
            <label htmlFor="Password">Password</label>
            <input type="password" placeholder="Password..." />
          </div>

          <button className="full" type="submit">
            Submit
          </button>

          <hr />

          <div className="lower-links">
            <div className="input-checkbox">
              <input type="checkbox" />
              <label>Remember me</label>
            </div>
            <a href="/forgot-password">Forgot your password?</a>
          </div>
        </form>

        <div className="lower-lower-links">
          <span>Not a customer yet?</span>
          <button onClick={() => navigate("/sign-up")}>Try for free</button>
        </div>
      </div>
    </SignInStyled>
  );
}

export default SignIn;
