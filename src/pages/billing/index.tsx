import BillingStyled from "./Billing.styles";
import PlanUsage from "./PlanUsage";
import BillingHistory from "./BillingHistory";
import BillingSettings from "./BillingSettings";
import PaymentMethods from "./PaymentMethods";
import BillingUsage from "./BillingUsage";
import { Container } from "@mantine/core";

function Billing() {
  return (
    <BillingStyled>
      <Container fluid py="lg" px="lg">
        <h1>Billing</h1>
        <PlanUsage />
        <BillingUsage />
        <PaymentMethods />
        <BillingSettings />
        <BillingHistory />
      </Container>
    </BillingStyled>
  );
}

export default Billing;
