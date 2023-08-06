import { styled } from "styled-components";
//
import Header from "../header";
import { Footer } from "../footer";
import footerData from "./footer-data";

const Container = styled.div`
  .content {
    min-height: calc(100vh - 150px);
  }
`;

const Layout = ({ children }: any) => {
  return (
    <Container>
      <Header />
      <div className="content">{children}</div>
      <Footer data={footerData.data} />
    </Container>
  );
};

export default Layout;
