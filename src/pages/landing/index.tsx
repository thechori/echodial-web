import { useNavigate } from "react-router-dom";
//
import LandingStyled from "./Landing.styles";
import dashboardScreenshot from "../../assets/dashboard-screenshot.png";
import routes from "../../configs/routes";
import { Button, Container, Text, Title } from "@mantine/core";
import { FeaturesGrid } from "../features/FeaturesGrid";
import { APP_MOTTO } from "../../configs/constants";

function Landing() {
  const navigate = useNavigate();

  return (
    <LandingStyled>
      <section className="hero">
        <Container>
          <div className="hero-subcontainer">
            <div className="left">
              <Title
                size="2.5rem"
                lh="2.5rem"
                weight={600}
                variant="gradient"
                gradient={{ from: "gold", to: "orange", deg: 90 }}
              >
                {APP_MOTTO}
              </Title>

              <Title
                size="1.5rem"
                lh="2rem"
                weight={300}
                color="dimmed"
                py="sm"
              >
                Spend your time doing better things while we take care of the
                calling
              </Title>
              <Text color="white" py="sm" size="1.1rem">
                Simple and user-friendly, you'll never dread cold-calling ever
                again
              </Text>
              <Button
                size="xl"
                variant="gradient"
                onClick={() => navigate(routes.signUp)}
                my="md"
              >
                Try for free
              </Button>
            </div>
            <div className="right">
              <img
                className="screenshot"
                src={dashboardScreenshot}
                alt="EchoDial dashboard screenshot"
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
