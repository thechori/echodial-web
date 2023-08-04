import styled from "styled-components";
import colors from "../../styles/colors";
import devices from "../../styles/devices";

const LandingStyled = styled.div`
  .hero {
    background: radial-gradient(
      circle,
      ${colors.blue} 0%,
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

    h1 {
      font-size: 2rem;
      /* line-height: 2.2rem; */
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;

      @media ${devices.tablet} {
        font-size: 2.5rem;
        /* line-height: 2.75rem; */
        margin-bottom: 1rem;
      }

      @media ${devices.desktop} {
        font-size: 3rem;
        /* line-height: 3.25rem; */
        margin-bottom: 1rem;
      }
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
