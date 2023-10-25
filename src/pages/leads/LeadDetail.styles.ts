import { styled } from "styled-components";

export const LeadDetailStyled = styled.div`
  transition: width 0.2s ease, opacity 3s ease;

  /* padding-bottom: 50px; */

  #lead-detail {
    max-height: calc(100vh - 120px); // Account for bottom dialer FAB
    overflow: scroll;
    padding-bottom: 0px;
  }

  #lead-detail-fab {
    position: fixed;
    right: 128px;
    bottom: 16px;
  }

  #footer-buttons {
    position: sticky;
    bottom: 0px;
    background: white;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
`;
