import { TFilter } from "./types";

export const availableFilters: TFilter[] = [
  {
    value: "hasAppointment",
    label: "Has appointment",
    type: "boolean",
    fn: (lead) => {
      if (lead.appointment_at) {
        return true;
      }
      return false;
    },
  },
  {
    value: "hasBeenCalled",
    label: "Has been called",
    type: "boolean",
    fn: (lead) => {
      if (lead.call_count > 0) {
        return true;
      }
      return false;
    },
  },
  {
    value: "notCalledYet",
    label: "Not called yet",
    type: "boolean",
    fn: (lead) => {
      if (lead.call_count === 0) {
        return true;
      }
      return false;
    },
  },
];
