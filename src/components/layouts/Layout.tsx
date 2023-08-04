import { styled } from "styled-components";
//
import Header from "../header";
import { Footer, TFooterProps } from "../footer";

const Container = styled.div`
  .content {
    min-height: calc(100vh - 150px);
  }
`;

const footerData: TFooterProps = {
  data: [
    {
      title: "About",
      links: [
        {
          label: "Features",
          link: "",
        },
        {
          label: "Pricing",
          link: "",
        },
        {
          label: "Support",
          link: "",
        },
        {
          label: "FAQ",
          link: "",
        },
      ],
    },
    {
      title: "Company",

      links: [
        {
          label: "Meet the team",
          link: "",
        },
        {
          label: "Our mission",
          link: "",
        },
        {
          label: "Careers",
          link: "",
        },
      ],
    },
  ],
};

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
