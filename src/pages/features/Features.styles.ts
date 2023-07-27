import { styled } from "styled-components";
import devices from "../../styles/devices";

const FeaturesStyled = styled.div`
  text-align: center;

  @media ${devices.tablet} {
    margin-top: 3rem;
  }
`;

export default FeaturesStyled;