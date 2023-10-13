import { styled } from "styled-components";
//
import devices from "../../styles/devices";

const AlphaDialerStyled = styled.div<{ isvisible: boolean }>`
  position: fixed;
  top: 0px;
  right: ${(props) => (props.isvisible ? "0px" : "-300px")};
  bottom: 0px;
  transition: all 0.2s ease;

  background-color: lightyellow;
  height: 100vh;
  width: 300px;

  .details {
    display: block;
    align-items: center;

    @media ${devices.tablet} {
      display: flex;
    }

    .user-icon {
      display: none;

      @media ${devices.tablet} {
        display: block;
        font-size: 2rem;
      }
    }

    .import-contact-button {
      font-size: 1.5rem;

      @media ${devices.tablet} {
        font-size: 2rem;
      }
    }

    .lead-details {
      padding: 0;

      @media ${devices.tablet} {
        padding: 0 0.75rem;
      }

      div div {
        line-height: 1rem;
      }
    }
  }

  .controls {
    .control-buttons {
      display: flex;

      padding: 0.25rem;

      svg {
        font-size: 2.5rem;
      }

      & > div {
        padding: 0 0.5rem;
      }
    }

    .call-details {
      display: flex;

      & > div {
        padding: 0rem 0.5rem;

        @media ${devices.tablet} {
          padding: 0rem 1rem;
        }
      }
    }
  }

  .options {
    @media ${devices.tablet} {
      padding: 1rem;
    }
  }

  @media ${devices.tablet} {
  }

  @media ${devices.desktop} {
    /* width: 600px; */
  }
`;

export default AlphaDialerStyled;
