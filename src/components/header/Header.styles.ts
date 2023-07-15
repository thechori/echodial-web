import styled from "styled-components";

const HeaderStyled = styled.div`
  background-color: #2a2a2a;
  height: 100px;
  display: flex;
  align-items: center;

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
