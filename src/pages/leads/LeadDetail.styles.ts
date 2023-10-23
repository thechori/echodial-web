import { styled } from "styled-components";

export const LeadDetailStyled = styled.div<{ open: boolean }>`
  width: ${({ open }) => (open ? "50%" : "0%")};
  transition: width 0.2s ease, opacity 3s ease;
  overflow: ${({ open }) => (open ? "unset" : "hidden")};

  #lead-detail {
    /* border: 1px solid orange; */
  }

  #lead-detail-fab {
    position: fixed;
    right: 128px;
    bottom: 16px;
  }
`;
