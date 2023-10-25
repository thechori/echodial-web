import { styled } from "styled-components";

const CallButtonWithCountStyled = styled.div<{ $active: boolean }>`
  background-color: ${(props) => (props.$active ? "green" : "red")};
  width: 40px;
  height: 40px;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  svg {
    fill: white;
    font-size: 1.4rem;
  }

  .call-count {
    width: 24px;
    height: 24px;
    border-radius: 24px;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 0.75rem;
    font-weight: 600;
    background-color: ${(props) => (props.$active ? "green" : "red")};
    color: white;
  }
`;

export default CallButtonWithCountStyled;
