import { styled } from "styled-components";
import colors from "../../styles/colors";
import devices from "../../styles/devices";

const SidebarStyled = styled.div`
  background: rgb(0, 17, 30);
  background: linear-gradient(90deg, rgba(0, 17, 30, 1) 0%, #00153f 100%);

  color: white;
  position: sticky;
  top: 0;
  z-index: 99;

  .mobile {
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
    @media ${devices.tablet} {
      margin-top: 1rem;
      margin-bottom: 1rem;
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

    display: flex;
    justify-content: flex-end;
    align-items: center;

    .hamburger-menu-drawer-links {
      width: 66%;
      /*height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end; */

      a {
        font-size: 1.5rem;
        padding: 1.25rem;
      }
    }
  }
`;

export default SidebarStyled;
