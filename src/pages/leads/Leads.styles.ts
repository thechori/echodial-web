import { styled } from "styled-components";

const LeadsStyled = styled.div`
  display: flex;
  width: 100%;

  #lead-content {
    padding-left: 1rem;
    padding-right: 1rem;
    flex: 1;
  }
`;

export const LeadDetailContainer = styled.div<{ $open: boolean }>`
  width: ${({ $open }) => ($open ? "50%" : "0%")};
  overflow: ${({ $open }) => ($open ? "unset" : "hidden")};
`;

export default LeadsStyled;
