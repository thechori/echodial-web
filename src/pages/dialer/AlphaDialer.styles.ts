import { styled } from "styled-components";
//
import devices from "../../styles/devices";

const AlphaDialerStyled = styled.div<{ $visible: boolean }>`
  background-color: #f1f1f1;

  display: ${(props) => (props.$visible ? "block" : "none")};

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;

  .split {
    & > div {
      flex: 1;
    }
  }

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

      /* svg {
        font-size: 2.5rem;
      } */

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
