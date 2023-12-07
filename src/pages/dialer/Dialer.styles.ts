import { styled } from "styled-components";
//
import devices from "../../styles/devices";

type TDialerState = "hidden" | "expanded" | "collapsed";

export const DialerStatus = styled.div<{ $visible: boolean }>`
  width: ${(props) => (props.$visible ? "100px" : "0px")};
  text-align: center;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: all 1s ease;

  .duration {
    background-color: #d3f9d8;
    color: #2b8a3e;
    padding: 0.1rem 0.5rem;
    border-radius: 8px;
  }
`;

export const DialerStyled = styled.div<{ $state: TDialerState }>`
  background-color: #e1e1e1;

  transform: ${(props) => {
    switch (props.$state) {
      case "collapsed": {
        return "translateY(calc(100vh - 93px))";
      }

      case "expanded": {
        return "translateY(0px)";
      }

      case "hidden": {
        return "translateY(100vh)";
      }

      default: {
        return "translateY(0px)";
      }
    }
  }};

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
