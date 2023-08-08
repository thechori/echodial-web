import { styled } from "styled-components";
//
import Sidebar from "../sidebar";
import devices from "../../styles/devices";
import AlphaDialer from "../../pages/dialer/AlphaDialer";

const Container = styled.div`
  display: block;

  @media ${devices.tablet} {
    display: flex;
  }

  .content {
    width: 100%;
  }
`;

const AuthenticatedUserLayout = ({ children }: any) => {
  return (
    <Container>
      <Sidebar />
      <div className="content">{children}</div>
      <AlphaDialer />
    </Container>
  );
};

export default AuthenticatedUserLayout;
