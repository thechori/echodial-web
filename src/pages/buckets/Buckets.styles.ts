import { styled } from "styled-components";
import devices from "../../styles/devices";

const BucketsStyled = styled.div`
  .bucket {
    @media ${devices.tablet} {
      width: 300px;
    }

    @media ${devices.desktop} {
      width: 340px;
    }
  }
`;

export default BucketsStyled;
