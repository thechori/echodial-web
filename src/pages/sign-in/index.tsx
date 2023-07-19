import { styled } from "styled-components";
//
import l34dsLogo from "../../assets/l34ds-logo-full.png";
import { useNavigate } from "react-router-dom";

const SignInStyled = styled.div`
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  display: flex;
  place-content: center;

  .logo-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-bottom: 2rem;

    img {
      width: 300px;
    }
  }

  .form-container {
    width: 450px;
    margin-left: auto;
    margin-right: auto;
  }

  .lower-links {
    display: flex;
    justify-content: space-between;
  }
`;

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
            <a href="/forgot-password">For your password?</a>
          </div>
        </form>
      </div>
    </SignInStyled>
  );
}

export default SignIn;
