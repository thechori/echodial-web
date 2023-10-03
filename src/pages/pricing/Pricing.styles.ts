import { styled } from "styled-components";
//
import devices from "../../styles/devices";

const PricingStyled = styled.div`
  text-align: center;

  @media ${devices.tablet} {
    margin-top: 3rem;
  }
`;

export default PricingStyled;
