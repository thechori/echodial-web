import { useNavigate } from "react-router-dom";
//
import TryL34dsStyled from "./TryL34ds";
import l34dsLogo from "../../assets/l34ds-logo-full.png";
import routes from "../../configs/routes";
import { AiOutlineCheck } from "react-icons/ai";
import colors from "../../styles/colors";

function SignUp() {
  const navigate = useNavigate();

  return (
    <TryL34dsStyled>
      <div className="header">
        <div
          className="logo-container hoverable"
          onClick={() => navigate(routes.landing)}
        >
          <img src={l34dsLogo} alt="L34ds logo" />
        </div>
        <div className="title">
          <div>Start building with L34DS for free.</div>
          <div>No credit card required.</div>
        </div>
      </div>

      <div className="card">
        <div className="left">
          <div className="value-proposition">
            <div className="title">With L34ds you can:</div>
            <div className="items">
              <div className="item">
                <AiOutlineCheck fontSize="24px" color={colors.green} />
                <span>SMS Marketing</span>
              </div>
              <div className="item">
                <AiOutlineCheck fontSize="24px" color={colors.green} />
                <span>Autodialer</span>
              </div>
              <div className="item">
                <AiOutlineCheck fontSize="24px" color={colors.green} />
                <span>Triple simultaneous dialing</span>
              </div>
              <div className="item">
                <AiOutlineCheck fontSize="24px" color={colors.green} />
                <span>Instantaneous call handoffs</span>
              </div>
              <div className="item">
                <AiOutlineCheck fontSize="24px" color={colors.green} />
                <span>On-hold functionality</span>
              </div>
              <div className="item">
                <AiOutlineCheck fontSize="24px" color={colors.green} />
                <span>Free leads every month</span>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <form>
            <div className="input-field">
              <input type="text" name="firstName" placeholder="First name *" />
            </div>
            <div className="input-field">
              <input type="text" name="lastName" placeholder="Last name *" />
            </div>
            <div className="input-field">
              <input type="email" placeholder="Email address *" />
            </div>

            <div className="input-field">
              <input type="password" placeholder="Password *" />
            </div>

            <div className="legal">
              <input type="checkbox" />
              <label>
                I accept the <a href="#">L34ds Terms of Service</a> and have
                read the <a href="#">L34ds Privacy Notice</a>.
              </label>
            </div>

            <div style={{ height: 24 }} />

            <button className="full lg shadow" type="submit">
              Start your free trial
            </button>
          </form>
        </div>
      </div>

      <div className="lower-lower-links">
        <span>Already have an account?</span>
        <button onClick={() => navigate(routes.signIn)}>Sign In</button>
      </div>
    </TryL34dsStyled>
  );
}

export default SignUp;
