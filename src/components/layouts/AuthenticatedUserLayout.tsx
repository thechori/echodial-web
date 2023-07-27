import { styled } from "styled-components";
//
import Sidebar from "../sidebar";

const Container = styled.div`
  display: flex;
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
