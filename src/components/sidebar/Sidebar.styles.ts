import { styled } from "styled-components";
import colors from "../../styles/colors";
import devices from "../../styles/devices";

const SidebarStyled = styled.div`
  background-color: black;
  color: white;

  width: 200px;
  height: 100vh;

  .header {
    display: flex;
    place-content: center;
    padding: 2rem;

    border-bottom: 1px solid white;

    img {
      width: 100%;
    }
  }

  .content {
    margin-top: 1rem;
    margin-bottom: 1rem;

    /* padding: 2rem; */

    @media ${devices.tablet} {
      /* padding: 2rem; */
    }
  }

  a {
    svg {
      margin-right: 0.75rem;
    }

    div {
      display: flex;
      align-items: center;
    }

    color: white;
    display: flex;
    padding: 1rem;
    border-radius: 4px;
    line-height: 1.1rem;

    &.active {
      color: ${colors.blue};
      text-shadow: 0 0 30px ${colors.purple}, 0 0 30px ${colors.purple},
        0 0 30px ${colors.purple};
    }
  }
`;

export default SidebarStyled;
