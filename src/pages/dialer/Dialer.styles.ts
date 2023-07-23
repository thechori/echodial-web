import { styled } from "styled-components";

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
