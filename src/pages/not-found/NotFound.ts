import { styled } from "styled-components";
import devices from "../../styles/devices";

const NotFoundStyled = styled.div`
  text-align: center;

  @media ${devices.tablet} {
    margin-top: 3rem;
  }
`;

export default NotFoundStyled;
