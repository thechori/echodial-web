import { useNavigate } from "react-router-dom";
//
import LandingStyled from "./Landing.styles";
import l34dsScreenshot from "../../assets/l34ds-screenshot.png";

function Landing() {
  const navigate = useNavigate();

  return (
    <LandingStyled>
      <section className="hero">
        <div className="container">
          <div className="hero-subcontainer">
            <div className="left">
              <h1>The CRM built on what matters most – communication</h1>
              <h2>Conversations drive sales. Ringy handles them for you.</h2>
              <p>
                Turn calls into customers with an automated sales team in your
                back pocket.
              </p>
              <button className="pink lg" onClick={() => navigate("/sign-up")}>
                Sign up today
              </button>
            </div>
            <div className="right">
              <img
                className="screenshot"
                src={l34dsScreenshot}
                alt="L34ds dashboard screenshot"
              />
            </div>
          </div>
        </div>
      </section>
    </LandingStyled>
  );
}

export default Landing;
