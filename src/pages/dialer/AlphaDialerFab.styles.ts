import { styled } from "styled-components";
//
import colors from "../../styles/colors";
import { darken } from "polished";

const AlphaDialerFabStyled = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 100;
  display: flex;

  #fab {
    background-color: ${colors.appBlue};
    display: flex;
    width: 64px;
    height: 64px;
    border-radius: 64px;
    align-items: center;
    justify-content: center;
    z-index: 101;
    box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.05),
      rgba(0, 0, 0, 0.05) 0 1.25rem 1.5625rem -0.3125rem,
      rgba(0, 0, 0, 0.04) 0 0.625rem 0.625rem -0.3125rem;

    &:hover {
      background-color: ${darken(0.1, colors.appBlue)};
      cursor: pointer;
    }
  }
`;

export default AlphaDialerFabStyled;
