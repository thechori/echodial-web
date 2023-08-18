import {
  IconFlame,
  IconLock,
  IconExchange,
  IconFreeRights,
} from "@tabler/icons-react";
import { APP_NAME } from "../../configs/names";

const features = [
  {
    icon: IconLock,
    title: "Anti-spam risk",
    description:
      "We support the use of YOUR phone number to avoid getting flagged as spam",
  },
  {
    icon: IconFlame,
    title: "No more slow dialing",
    description: `Other dialers are laggy and slow. ${APP_NAME} is built with speed and performance in mind`,
  },
  {
    icon: IconExchange,
    title: "Flexible",
    description:
      "Customize your workflows in order to avoid repeating the same tasks over, and over again",
  },
  {
    icon: IconFreeRights,
    title: "Free to try",
    description:
      "Get a 14-day free trial to see if you like the tool, risk free. We know that you're going to love it",
  },
];

export default features;
