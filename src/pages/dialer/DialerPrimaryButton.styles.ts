import { styled } from "styled-components";

const buttonRadius = "56px";

export const StartButton = styled.button`
  border: none;
  background-color: #2f9e44;
  color: white;
  width: ${buttonRadius};
  height: ${buttonRadius};
  border-radius: ${buttonRadius};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EndButton = styled.button<{ $active: boolean }>`
  background-color: ${(props) => (props.$active ? "red" : "white")};
  color: ${(props) => (props.$active ? "white" : "red")};
  border: 1px solid red;
  width: ${buttonRadius};
  height: ${buttonRadius};
  border-radius: ${buttonRadius};
`;
