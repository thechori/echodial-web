import { styled } from "styled-components";
//
import devices from "../../styles/devices";

export const DialerStatus = styled.div<{ $visible: boolean }>`
  width: ${(props) => (props.$visible ? "110px" : "0px")};
  text-align: center;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: all 1s ease;
  padding-left: 1rem;
  padding-right: 1rem;

  .duration {
    background-color: #d3f9d8;
    color: #2b8a3e;
    padding: 0.1rem 0.25rem;
    border-radius: 8px;
  }
`;

export const DialerStyled = styled.div<{ $visible: boolean }>`
  background-color: #e1e1e1;

  transform: ${(props) =>
    props.$visible ? "translateY(0px)" : "translateY(90vh)"};

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;

  transition: transform 0.5s ease, opacity 0.5s ease;

  @media ${devices.tablet} {
    left: 180px;
  }

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
      align-items: flex-end;

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
