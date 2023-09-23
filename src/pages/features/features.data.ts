import {
  IconFlame,
  IconLock,
  IconExchange,
  IconFreeRights,
} from "@tabler/icons-react";
import { APP_NAME } from "../../configs/constants";

const features = [
  {
    icon: IconFlame,
    title: "Truly automatic dialing",
    description: `Other apps require you to manually intervene to keep the calls going. With ${APP_NAME}, you can hit the dial button and run through hundreds of calls without a single click needed`,
  },
  {
    icon: IconLock,
    title: "Anti-spam risk",
    description:
      "We support the use of YOUR phone number to avoid getting flagged as spam",
  },

  {
    icon: IconExchange,
    title: "Fully customizable",
    description:
      "Create your workflows in order to avoid repeating the same tasks over, and over again",
  },
  {
    icon: IconFreeRights,
    title: "Free to try",
    description:
      "We're confident that once you get a taste of our dialer, you'll never want to use anything else",
  },
];

export default features;
