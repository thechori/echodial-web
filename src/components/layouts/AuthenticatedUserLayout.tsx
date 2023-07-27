import { styled } from "styled-components";
//
import Sidebar from "../sidebar";
import devices from "../../styles/devices";

const Container = styled.div`
  display: block;

  @media ${devices.tablet} {
    display: flex;
  }
`;

const AuthenticatedUserLayout = ({ children }: any) => {
  return (
    <Container>
      <Sidebar />
      <div className="content">{children}</div>
    </Container>
  );
};

export default AuthenticatedUserLayout;
