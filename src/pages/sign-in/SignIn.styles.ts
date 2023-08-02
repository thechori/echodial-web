import { styled } from "styled-components";
//
import devices from "../../styles/devices";

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
      width: 200px;

      @media ${devices.tablet} {
        width: 300px;
      }
    }
  }

  .form-container {
    @media ${devices.tablet} {
      width: 450px;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

export default SignInStyled;
