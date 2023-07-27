import { styled } from "styled-components";
//
import Header from "../header";

const Container = styled.div``;

const Layout = ({ children }: any) => {
  return (
    <Container>
      <Header />
      <div className="content">{children}</div>
    </Container>
  );
};

export default Layout;
