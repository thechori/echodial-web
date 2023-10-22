import { TFilter } from "./types";

// hideNoPhoneLeads
// hideDoNotCallLeads
// hideSoldLeads
// hideClosedLeads
// hideArchivedLeads

export const recommendedFilters: TFilter[] = [
  {
    value: "hideNoPhoneLeads",
    label: "Hide leads with no phone number",
    type: "boolean",
    fn: (lead) => {
      if (!lead.phone) {
        return true;
      }
      return false;
    },
  },
  {
    value: "hideDoNotCallLeads",
    label: "Hide Do Not Call (DNC) leads",
    type: "boolean",
    fn: (lead) => {
      if (lead.do_not_call) {
        return true;
      }
      return false;
    },
  },
  {
    value: "hideSoldLeads",
    label: "Hide sold leads",
    type: "boolean",
    fn: (lead) => {
      if (lead.status === "sold") {
        return true;
      }
      return false;
    },
  },
  {
    value: "hideClosedLeads",
    label: "Hide closed leads",
    type: "boolean",
    fn: (lead) => {
      if (lead.status === "closed") {
        return true;
      }
      return false;
    },
  },
  {
    value: "hideArchivedLeads",
    label: "Hide archived leads",
    type: "boolean",
    fn: (lead) => {
      if (lead.archived_at) {
        return true;
      }
      return false;
    },
  },
];
