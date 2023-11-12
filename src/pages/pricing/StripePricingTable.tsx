import { createElement } from "react";

const pricingTableId = import.meta.env.VITE_STRIPE_PRICING_TABLE_ID;
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

type TStripePricingTable = {
  customerEmail?: string;
};

const StripePricingTable = ({ customerEmail }: TStripePricingTable) => {
  console.log("customerEmail: ", customerEmail);

  return createElement("stripe-pricing-table", {
    style: {
      width: "100%",
    },
    "pricing-table-id": pricingTableId,
    "publishable-key": publishableKey,
    "customer-email": customerEmail,
  });
};

export default StripePricingTable;
