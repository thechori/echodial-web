import styled from "styled-components";
import devices from "../../styles/devices";
import colors from "../../styles/colors";

const HeaderStyled = styled.div`
  background-color: #2a2a2a;
  display: flex;
  align-items: center;

  height: 80px;

  @media ${devices.tablet} {
    height: 100px;
  }

  .full-menu {
    display: none;

    @media ${devices.tablet} {
      display: flex;
      align-items: center;
    }
  }

  .hamburger-menu {
    display: block;
    padding: 1rem;

    @media ${devices.tablet} {
      display: none;
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
    padding-right: 1rem;
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

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .links {
    display: flex;
    justify-content: space-between;
  }

  img {
    height: 40px;
    @media ${devices.tablet} {
      height: 50px;
    }
  }

  a {
    font-size: 1.2rem;
    padding: 0.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    padding-bottom: 0.5rem;
    background: transparent;

    &.active {
      color: ${colors.blue};
      text-shadow: 0 0 30px ${colors.purple};
      /* text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa,
        0 0 82px #0fa, 0 0 92px #0fa, 0 0 102px #0fa, 0 0 151px #0fa; */
      border-bottom: 4px solid ${colors.blue};
    }
  }
`;

export default HeaderStyled;
