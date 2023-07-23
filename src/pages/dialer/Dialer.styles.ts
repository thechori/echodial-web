import { styled } from "styled-components";
import devices from "../../styles/devices";

const DialerStyled = styled.div`
  padding-bottom: 4rem;

  button.startup {
    &.active {
      background-color: green;
    }
  }

  .dialer-container {
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      justify-content: space-between;
    }
    .right {
      background-color: lightblue;
    }
  }

  .settings {
    pointer-events: none;
    opacity: 0.4;
    transition: opacity 1s ease;

    &.active {
      pointer-events: all;
      opacity: 1;
    }
  }
`;

export default DialerStyled;

export const DialStyled = styled.div`
  text-align: center;
  border: 1px solid #ffffff10;
  border-radius: 6px;
  background: radial-gradient(ellipse at top, #1e3c2d, transparent),
    radial-gradient(ellipse at bottom, #043a47, transparent);

  margin-left: 0.25rem;
  margin-right: 0.25rem;
  padding-top: 2rem;
  padding-bottom: 2rem;

  @media ${devices.tablet} {
    margin-left: 1rem;
    margin-right: 1rem;
    padding-top: 4rem;
    padding-bottom: 4rem;
  }

  .number-container {
    justify-content: center;
    align-items: center;
    /* display: flex; */

    @media ${devices.tablet} {
      display: flex;
    }

    .number {
      font-size: 0.8rem;
      padding-bottom: 0.25rem;

      @media ${devices.tablet} {
        font-size: 2rem;
        margin-right: 0.5rem;
      }
    }
  }

  .status {
    font-weight: 100;
  }

  .call-options {
    display: flex;
    flex-wrap: wrap;
    padding: 2rem 1rem;
  }

  .option {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin: 0.5rem;

    @media ${devices.tablet} {
      margin: 1rem;
    }

    &:hover {
      cursor: pointer;

      .icon {
        background-color: #ffffff10;
      }
    }

    &.active {
      .icon {
        background-color: white;
        color: red;
      }
    }

    &.disabled {
      opacity: 0.3;
    }

    .icon {
      width: 66px;
      height: 66px;
      border-radius: 66px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid white;
    }
  }

  .label {
    font-weight: 100;
    padding-top: 0.5rem;
  }

  .end-section {
    margin-bottom: 1rem;
  }
`;
