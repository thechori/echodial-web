import { styled } from "styled-components";
import colors from "../../styles/colors";

const SidebarStyled = styled.div`
  background-color: black;
  color: white;

  padding: 1rem;
  width: 250px;

  .header {
    display: flex;
    place-content: center;
    padding: 1rem;

    border-bottom: 1px solid white;

    img {
      width: 100%;
    }
  }

  .content {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  a {
    svg {
      margin-right: 0.5rem;
    }
    color: white;
    display: flex;
    padding: 1rem;
    border-radius: 4px;

    &.active {
      color: ${colors.blue};
    }
  }
`;

export default SidebarStyled;
