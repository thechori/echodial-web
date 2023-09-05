import styled from "@emotion/styled";

const LeadsTableStyled = styled.div`
  .lead-item {
    border: 1px solid blue;
    border: ${(props) => {
      // @ts-ignore
      return `1px solid ${props.theme.colors.blue[5]}`;
    }};

    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
`;

export default LeadsTableStyled;
