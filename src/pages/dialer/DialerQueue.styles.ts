import styled from "styled-components";
import devices from "../../styles/devices";

const DialerQueueStyled = styled.div`
  .contact {
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    padding: 0.25rem;

    .phone {
      margin-right: 1rem;
    }
  }

  tr.active {
    background-color: #00800030;
  }

  tr.active-index {
    color: green;
  }

  .call-icon {
    &:hover {
      color: green;
    }
  }

  .user-avatar {
    display: none;

    @media ${devices.desktop} {
      display: block;
    }
  }

  .call-buttons {
    svg {
      font-size: 1.75rem;

      @media ${devices.tablet} {
        font-size: 2rem;
      }
    }

    & > div {
      padding: 0 0.25rem;

      @media ${devices.tablet} {
        padding: 0 0.5rem;
      }
    }
  }

  svg.start-call-icon {
    font-size: 3rem;

    @media ${devices.tablet} {
      font-size: 3rem;
    }
  }

  position: relative;

  .fade {
    width: 100%;
    bottom: 0px;
    position: absolute;
    background-color: white;
    height: 10rem;
    pointer-events: none;
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  }

  .scroll-area {
    overflow: scroll;
    max-height: calc(100vh - 280px);
  }
`;

export default DialerQueueStyled;