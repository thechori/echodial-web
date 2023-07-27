import { styled } from "styled-components";
import colors from "../../styles/colors";
import devices from "../../styles/devices";

const SidebarStyled = styled.div`
  background-color: black;
  color: white;

  .mobile {
    /* width: 200px; */
    /* height: 100px; */

    display: block;

    @media ${devices.tablet} {
      display: none;
    }

    .header {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      img {
        height: 50px;
        width: unset;
      }
    }
  }

  .desktop {
    width: 200px;
    height: 100vh;

    display: none;

    @media ${devices.tablet} {
      display: block;
    }
  }

  .header {
    display: flex;
    place-content: center;
    padding: 2rem;

    @media ${devices.tablet} {
      border-bottom: 1px solid white;
    }

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

  .hamburger-menu-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 100;

    .hamburger-menu-drawer-links {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;

      a {
        font-size: 2rem;
        padding: 1.5rem;
      }
    }
  }
`;

export default SidebarStyled;
