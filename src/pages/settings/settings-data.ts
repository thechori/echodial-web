export type TSubscription = {
  title: string;
  price: number;
  subtitle: string;
  features: string[];
};

export const basic: TSubscription = {
  title: "Basic plan",
  price: 79.99,
  subtitle: "Includes core features to succeed in your work",
  features: ["Automatic dialing", "Drip campaigns", "Up to 5 phone numbers"],
};

export const pro: TSubscription = {
  title: "Pro plan",
  price: 99.99,
  subtitle: "Utilize your personal number, advanced features and so much more",
  features: [
    "Autodial with personal number",
    "Turbo dialer",
    "Discounted rate for power users",
  ],
};
