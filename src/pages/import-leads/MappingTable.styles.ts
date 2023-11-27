import { styled } from "styled-components";

export const TableContainer = styled.div`
  tbody {
    display: block;
    max-height: calc(100vh - 320px);
    overflow-y: scroll;
  }

  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
`;
