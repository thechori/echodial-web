import { Container } from "@mantine/core";
//
import PlanUsage from "./PlanUsage";
import BillingHistory from "./BillingHistory";
import BillingSettings from "./BillingSettings";
import PaymentMethods from "./PaymentMethods";
import BillingUsage from "./BillingUsage";

function Billing() {
  return (
    <Container fluid p="md">
      <PlanUsage />
      <BillingUsage />
      <PaymentMethods />
      <BillingSettings />
      <BillingHistory />
    </Container>
  );
}

export default Billing;
