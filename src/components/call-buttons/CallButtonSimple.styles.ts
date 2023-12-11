import { styled } from "styled-components";

const CallButtonSimpleStyled = styled.div<{ $active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  opacity: ${(props) => (props.$active ? 1.0 : 0.3)};
  padding-top: 8px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

export default CallButtonSimpleStyled;
