import { styled } from "styled-components";

const SignInStyled = styled.div`
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  display: flex;
  place-content: center;

  .logo-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-bottom: 2rem;

    img {
      width: 300px;
    }
  }

  .form-container {
    width: 450px;
    margin-left: auto;
    margin-right: auto;
  }

  .lower-links {
    display: flex;
    justify-content: space-between;
  }

  .lower-lower-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    margin: auto;
    width: 300px;
    padding: 1.25rem;
  }
`;

export default SignInStyled;
