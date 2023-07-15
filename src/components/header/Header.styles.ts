import styled from "styled-components";
import devices from "../../styles/devices";

const HeaderStyled = styled.div`
  background-color: #2a2a2a;
  height: 100px;
  display: flex;
  align-items: center;

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

    &:hover {
      cursor: pointer;
      opacity: 0.6;
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
    background-color: rgba(0, 0, 0, 0.7);

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
    height: 50px;
  }

  a {
    color: white;
    font-size: 1.2rem;
    padding: 1rem;

    &:hover {
      opacity: 0.6;
    }
  }
`;

export default HeaderStyled;
