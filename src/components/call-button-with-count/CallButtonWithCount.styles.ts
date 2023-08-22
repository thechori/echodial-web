import { styled } from "styled-components";

const CallButtonWithCountStyled = styled.div<{ active: boolean }>`
  background-color: ${(props) => (props.active ? "green" : "red")};
  width: 50px;
  height: 50px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  svg {
    fill: white;
    font-size: 1.5rem;
  }

  .call-count {
    width: 24px;
    height: 24px;
    border-radius: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: ${(props) => (props.active ? "green" : "red")};
    color: white;
  }
`;

export default CallButtonWithCountStyled;
