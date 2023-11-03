import { styled } from "styled-components";

export const LeadsStyled = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  #lead-content {
    padding: 1rem;
    flex: 1;
  }
`;

export const LeadDetailContainer = styled.div<{ $open: boolean }>`
  width: ${({ $open }) => ($open ? "50%" : "0%")};
  max-width: 600px;
  padding: ${({ $open }) => ($open ? "1rem 1rem 1rem 0rem" : "0%")};
  overflow: ${({ $open }) => ($open ? "unset" : "hidden")};
`;
