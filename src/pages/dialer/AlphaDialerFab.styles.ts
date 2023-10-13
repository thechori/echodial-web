import { styled } from "styled-components";
//
import colors from "../../styles/colors";

const AlphaDialerFabStyled = styled.div`
  background-color: ${colors.appBlue};
  display: flex;
  width: 64px;
  height: 64px;
  border-radius: 64px;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 100;

  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`;

export default AlphaDialerFabStyled;
