import { useNavigate } from "react-router-dom";
//
import LandingStyled from "./Landing.styles";
import l34dsScreenshot from "../../assets/l34ds-screenshot.png";
import routes from "../../configs/routes";
import { Button, Container } from "@mantine/core";
import { FeaturesGrid } from "../features/FeaturesGrid";

function Landing() {
  const navigate = useNavigate();

  return (
    <LandingStyled>
      <section className="hero">
        <Container>
          <div className="hero-subcontainer">
            <div className="left">
              <h1>The CRM built on what matters most – communication</h1>
              <h2>Conversations drive sales. L34ds handles them for you.</h2>
              <p>
                Turn calls into customers with an automated sales team in your
                back pocket.
              </p>
              <Button
                size="xl"
                variant="gradient"
                onClick={() => navigate(routes.tryL34ds)}
              >
                Sign up today
              </Button>
            </div>
            <div className="right">
              <img
                className="screenshot"
                src={l34dsScreenshot}
                alt="L34ds dashboard screenshot"
              />
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container py="lg">
          <FeaturesGrid />
        </Container>
      </section>
    </LandingStyled>
  );
}

export default Landing;
