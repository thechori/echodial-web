import styled from "@emotion/styled";
import { lighten } from "polished";
//
import colors from "../../styles/colors";

export const LeadsFilteredListStyled = styled.div`
  .hover-button {
    opacity: 0;
  }

  .ag-row-hover:hover {
    cursor: pointer;
  }

  .ag-row-hover .hover-button {
    opacity: 1;
  }

  .ag-row-hover .hover-button:hover {
    background-color: ${lighten(0.4, colors.appBlue)};
  }

  .ag-cell-focus,
  .ag-cell-no-focus {
    border: none !important;
  }

  .start-dial-session-disabled-button {
    &:hover {
      cursor: not-allowed;
    }
  }
`;
