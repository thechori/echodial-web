import { styled } from "styled-components";

export const LeadDetailStyled = styled.div`
  transition: width 0.2s ease, opacity 3s ease;

  #lead-header {
    position: sticky;
    padding-top: 1rem;
    padding-bottom: 1rem;
    top: 0px;
    background-color: white;
    z-index: 1;
    background: linear-gradient(
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0)
    );
  }

  #lead-detail {
    max-height: calc(100vh - 120px); // Account for bottom dialer FAB
    overflow: scroll;
    padding-top: 0px;
    padding-bottom: 0px;
  }

  #lead-detail-fab {
    position: fixed;
    right: 128px;
    bottom: 16px;
  }

  #footer-buttons-overlay {
    position: sticky;
    bottom: 0px;
    pointer-events: none;
    padding-top: 3em;
    padding-bottom: 1rem;
    height: 100px;

    background: linear-gradient(
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 1)
    );
  }

  #footer-buttons {
    position: sticky;

    bottom: 0px;

    /* background-color: rgba(255, 255, 255, 0.8); */
    padding-top: 2em;
    padding-bottom: 1rem;
  }
`;
