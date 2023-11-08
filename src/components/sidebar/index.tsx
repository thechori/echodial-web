import { MouseEvent, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaCreditCard, FaAddressBook } from "react-icons/fa6";
import { GoHistory } from "react-icons/go";
import { IoIosSettings } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { AiOutlineMenu } from "react-icons/ai";
//
import SidebarStyled from "./Sidebar.styles";
import routes from "../../configs/routes";
import logo from "../../assets/EchoDial-temp-logo-full.png";
import { Box, Button, Center, Divider, Progress, Text } from "@mantine/core";
import colors from "../../styles/colors";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAlphaDialerVisible } from "../../store/dialer/slice";
import { useGetTrialCreditsQuery } from "../../services/trial-credit";

const Sidebar = () => {
  const { alphaDialerVisible } = useAppSelector((state) => state.dialer);
  const { data } = useGetTrialCreditsQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleClickOff = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setExpanded(false);
  };

  // Click wrapper to handle hiding the dialer whenever a nav change is requested
  const clickWrapper = (nextAction: any) => {
    // Check for visible dialer
    if (alphaDialerVisible) {
      // Hide dialer if found
      dispatch(setAlphaDialerVisible(false));
    }

    // Continue
    if (nextAction) {
      nextAction();
    }
  };

  const [daysLeftText, setDaysLeftText] = useState("");
  const [trialPercentage, setTrialPercentage] = useState(100);

  useEffect(() => {
    if (!data) {
      return console.log("No trial credits found");
    }

    setDaysLeftText(
      `${data.remaining_amount} of ${data.initial_amount} credits left`
    );

    // Percentage = remaining / total * 100
    setTrialPercentage((data.remaining_amount / data.initial_amount) * 100);
  }, [data]);

  return (
    <SidebarStyled>
      <div className="mobile">
        <div className="header">
          <img
            className="hoverable"
            src={logo}
            alt="EchoDial logo"
            onClick={() => clickWrapper(navigate(routes.leads))}
          />
          <div
            className="hamburger-menu"
            onClick={() => clickWrapper(setExpanded(!expanded))}
          >
            <AiOutlineMenu fontSize="26px" color="white" />
          </div>
        </div>

        {expanded && (
          <div className="hamburger-menu-drawer" onClick={handleClickOff}>
            <div className="hamburger-menu-drawer-links">
              <div className="content">
                <NavLink to={routes.leads}>
                  <MdGroups fontSize="1.5rem" />
                  <div>Leads</div>
                </NavLink>

                <NavLink to={routes.callerIds}>
                  <FaAddressBook fontSize="1.5rem" />
                  <div>My numbers</div>
                </NavLink>

                <NavLink to={routes.callHistory}>
                  <GoHistory fontSize="1.5rem" />
                  <div>Call History</div>
                </NavLink>

                <NavLink to={routes.billing}>
                  <FaCreditCard fontSize="1.5rem" />
                  <div>Billing</div>
                </NavLink>

                <NavLink to={routes.settings}>
                  <IoIosSettings fontSize="1.5rem" />
                  <div>Settings</div>
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="desktop">
        <div className="top">
          <div className="header">
            <img
              src={logo}
              alt="EchoDial logo"
              className="hoverable"
              onClick={() => clickWrapper(navigate(routes.leads))}
            />
          </div>

          <div className="content">
            <NavLink to={routes.leads}>
              <Box w={36}>
                <MdGroups size="1.2rem" />
              </Box>
              <div>Leads</div>
            </NavLink>

            <NavLink to={routes.callerIds}>
              <Box w={36}>
                <FaAddressBook size="1.2rem" />
              </Box>
              <div>My numbers</div>
            </NavLink>

            <NavLink to={routes.callHistory}>
              <Box w={36}>
                <GoHistory size="1.2rem" />
              </Box>
              <div>Call History</div>
            </NavLink>

            <Divider color={colors.darkBluerBackgroundLightened} />

            <NavLink to={routes.billing}>
              <Box w={36}>
                <FaCreditCard size="1.2rem" />
              </Box>
              <div>Billing</div>
            </NavLink>
            <NavLink to={routes.settings}>
              <Box w={36}>
                <IoIosSettings size="1.4rem" />
              </Box>
              <div>Settings</div>
            </NavLink>
          </div>
        </div>

        {data && (
          <div className="footer">
            <Divider />
            <Box className="trial-details" p="lg" bg="black">
              <Text size="xs" mb="xs">
                {daysLeftText}
              </Text>
              <Progress mb="md" value={trialPercentage} />
              <Center>
                <Button size="xs" compact variant="gradient">
                  Upgrade
                </Button>
              </Center>
            </Box>
          </div>
        )}
      </div>
    </SidebarStyled>
  );
};

export default Sidebar;
