type PropertyObject = {
  value: string;
  label: string;
  disabled: boolean;
  group: string;
};

export const dummyProperties: Record<string, PropertyObject> = {
  email: {
    value: "email",
    label: "Email",
    disabled: false,
    group: "Contact",
  },
  first_name: {
    value: "first_name",
    label: "First_Name",
    disabled: false,
    group: "Contact",
  },
  last_name: {
    value: "last_name",
    label: "Last_Name",
    disabled: false,
    group: "Contact",
  },
  address: {
    value: "address",
    label: "Address",
    disabled: false,
    group: "Address",
  },
  phone: {
    value: "phone",
    label: "Phone",
    disabled: false,
    group: "Contact",
  },
  city: { value: "city", label: "City", disabled: false, group: "Address" },
  state: {
    value: "state",
    label: "State",
    disabled: false,
    group: "Address",
  },
  zip: { value: "zip", label: "Zip", disabled: false, group: "Address" },
  notes: {
    value: "notes",
    label: "Notes",
    disabled: false,
    group: "Other",
  },
  status: {
    value: "status",
    label: "Status",
    disabled: false,
    group: "Other",
  },
};
