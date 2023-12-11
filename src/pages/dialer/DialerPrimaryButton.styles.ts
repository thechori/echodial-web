import { styled } from "styled-components";

const buttonRadius = "56px";

export const StartButton = styled.button<{ $error: boolean }>`
  border: ${(props) => (props.$error ? "1px solid #fa5252" : "none")};
  background-color: ${(props) => (props.disabled ? "#f1f3f5" : "#2f9e44")};
  color: ${(props) => (props.disabled ? "#ced4da" : "white")};
  width: ${buttonRadius};
  height: ${buttonRadius};
  border-radius: ${buttonRadius};
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled:hover {
    pointer-events: none;
  }
`;

export const EndButton = styled.button<{ $active: boolean }>`
  background-color: ${(props) => (props.$active ? "red" : "white")};
  color: ${(props) => (props.$active ? "white" : "red")};
  border: 1px solid red;
  width: ${buttonRadius};
  height: ${buttonRadius};
  border-radius: ${buttonRadius};
`;
