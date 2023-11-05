import styled from "@emotion/styled";
//
import colors from "../../styles/colors";
import devices from "../../styles/devices";

const LandingStyled = styled.div`
  .hero {
    background: radial-gradient(
      circle,
      #092f40 20%,
      ${colors.darkBackground} 75%
    );

    padding-top: 1rem;
    padding-bottom: 1rem;

    @media ${devices.tablet} {
      display: flex;
      align-items: center;
      padding-top: 2rem;
      padding-bottom: 2rem;
      height: 600px;
    }

    .hero-subcontainer {
      @media ${devices.tablet} {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .left {
      margin-top: 2rem;
      margin-bottom: 2rem;

      padding-left: 1rem;
      padding-right: 1rem;
      max-width: 450px;

      @media ${devices.tablet} {
        margin-right: 1rem;
        margin-bottom: 0;
        max-width: 400px;
      }

      @media ${devices.desktop} {
        margin-right: 1rem;
        margin-bottom: 0;
        max-width: 450px;
      }
    }

    .right {
      @media ${devices.tablet} {
        margin-left: 1rem;
      }
    }
  }

  .screenshot {
    width: 90%;

    @media ${devices.tablet} {
      /* max-width: 500px; */
    }
  }
`;

export default LandingStyled;
