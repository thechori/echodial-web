import { createElement } from "react";

const pricingTableId = import.meta.env.VITE_STRIPE_PRICING_TABLE_ID;
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const StripePricingTable = () => {
  return createElement("stripe-pricing-table", {
    style: {
      width: "100%",
    },
    "pricing-table-id": pricingTableId,
    "publishable-key": publishableKey,
  });
};

export default StripePricingTable;
