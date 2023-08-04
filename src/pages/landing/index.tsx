import { useNavigate } from "react-router-dom";
//
import LandingStyled from "./Landing.styles";
import l34dsScreenshot from "../../assets/l34ds-screenshot.png";
import routes from "../../configs/routes";
import { Button, Container, Text, Title } from "@mantine/core";
import { FeaturesGrid } from "../features/FeaturesGrid";

function Landing() {
  const navigate = useNavigate();

  return (
    <LandingStyled>
      <section className="hero">
        <Container>
          <div className="hero-subcontainer">
            <div className="left">
              <Title weight={400} color="white" lh="3.2rem">
                Automatic dialing –{" "}
                <Text weight={600} span color="gold" lh="2.75rem">
                  it's like magic 🪄
                </Text>
              </Title>
              <Title
                order={2}
                weight={300}
                color="dimmed"
                py="sm"
                lh="1.875rem"
              >
                Spend your time doing better things while we take care of the
                calling
              </Title>
              <Text color="white" py="sm" size="1.2rem">
                Use your own phone number -- never get marked as a spam risk
                again
              </Text>
              <Button
                size="xl"
                variant="gradient"
                onClick={() => navigate(routes.signUp)}
                my="md"
              >
                Sign up free
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
