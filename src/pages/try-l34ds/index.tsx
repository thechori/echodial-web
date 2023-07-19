import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//
import TryL34dsStyled from "./TryL34ds";
import l34dsLogo from "../../assets/l34ds-logo-full.png";
import routes from "../../configs/routes";
import { AiOutlineCheck } from "react-icons/ai";
import colors from "../../styles/colors";
import { extractErrorMessage } from "../../utils/error";
import { useAppDispatch } from "../../store/hooks";
import { setJwt } from "../../store/user/slice";

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
      await axios.post(`${import.meta.env.VITE_API_HOST}/user`, {
        firstName,
        lastName,
        email,
        password,
      });

      // Sign in to new User account
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_HOST}/auth/sign-in`,
        {
          email,
          password,
        }
      );

      dispatch(setJwt(data));
      navigate(routes.dashboard);
    } catch (error) {
      setError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

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
          <form onSubmit={handleFormSubmit}>
            <div className="input-field">
              <input
                required
                type="text"
                name="firstName"
                placeholder="First name *"
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFirstName(e.target.value)
                }
              />
            </div>
            <div className="input-field">
              <input
                required
                type="text"
                name="lastName"
                placeholder="Last name *"
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLastName(e.target.value)
                }
              />
            </div>
            <div className="input-field">
              <input
                required
                type="email"
                placeholder="Email address *"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="input-field">
              <input
                required
                type="password"
                placeholder="Password *"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <div className="legal">
              <input
                required
                type="checkbox"
                checked={acceptTerms}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAcceptTerms(e.target.checked)
                }
              />
              <label>
                I accept the <a href="#">L34ds Terms of Service</a> and have
                read the <a href="#">L34ds Privacy Notice</a>.
              </label>
            </div>

            <div style={{ height: 24 }} />
            <div className="error">{error}</div>

            <button className="full lg shadow" type="submit">
              {loading ? "Loading..." : "Start your free trial"}
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
