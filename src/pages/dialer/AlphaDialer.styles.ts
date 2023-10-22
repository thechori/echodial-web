import { styled } from "styled-components";
//
import devices from "../../styles/devices";

const AlphaDialerStyled = styled.div<{ isvisible: boolean }>`
  transition: width 0.2s ease;
  overflow: ${(props) => (props.isvisible ? "unset" : "hidden")};
  background-color: lightyellow;
  width: ${(props) => (props.isvisible ? "900px" : "0px")};

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
