import { Container } from "@mantine/core";
//
import BillingStyled from "./Billing.styles";
import PlanUsage from "./PlanUsage";
import BillingHistory from "./BillingHistory";
import BillingSettings from "./BillingSettings";
import PaymentMethods from "./PaymentMethods";
import BillingUsage from "./BillingUsage";

function Billing() {
  return (
    <BillingStyled>
      <Container fluid px="md">
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
