import styled from "styled-components";
import devices from "../../styles/devices";

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
      display: block;
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

    .hamburger-menu-drawer-links {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
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
    color: white;
    font-size: 1.2rem;
    font-weight: 700;
    padding: 1rem;
    transition: opacity 200ms ease-in-out;

    &:hover {
      opacity: 0.6;
    }
  }
`;

export default HeaderStyled;
