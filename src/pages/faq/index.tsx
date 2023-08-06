import { Container, Title, Accordion, createStyles, rem } from "@mantine/core";
import { Link } from "react-router-dom";
import routes from "../../configs/routes";

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    minHeight: 650,
  },

  title: {
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },

  item: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export function Faq() {
  const { classes } = useStyles();
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title align="center" className={classes.title}>
        Frequently Asked Questions
      </Title>

      <Accordion variant="separated">
        <Accordion.Item className={classes.item} value="reset-password">
          <Accordion.Control>How can I reset my password?</Accordion.Control>
          <Accordion.Panel>
            You can do that by visiting{" "}
            <Link to={routes.forgotPassword}>this page.</Link>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="another-account">
          <Accordion.Control>
            Can I create more that one account?
          </Accordion.Control>
          <Accordion.Panel>
            Of course! Simply register a new account using a different email
            address.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="newsletter">
          <Accordion.Control>
            How can I subscribe to monthly newsletter?
          </Accordion.Control>
          <Accordion.Panel>
            Sit tight, we are still working on creating this for our community.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="credit-card">
          <Accordion.Control>
            Do you store credit card information securely?
          </Accordion.Control>
          <Accordion.Panel>
            Yes, we take security very serious and utilize industry standard
            encryption to store important information such as your credit card
            and other sensitive details.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="payment">
          <Accordion.Control>
            What payment systems to you work with?
          </Accordion.Control>
          <Accordion.Panel>
            We use <Link to="https://stripe.com">Stripe</Link> as our primary
            payment processor.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="payment">
          <Accordion.Control>Can I call outside of the USA?</Accordion.Control>
          <Accordion.Panel>
            Currently, this is not supported. We are working to support this in
            the near future.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export default Faq;
