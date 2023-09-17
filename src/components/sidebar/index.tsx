import { MouseEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaCreditCard,
  FaAddressBook,
  FaBucket,
} from "react-icons/fa6";
import { GoHistory } from "react-icons/go";
import { IoIosSettings } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { AiOutlineMenu, AiOutlineDashboard } from "react-icons/ai";
//
import SidebarStyled from "./Sidebar.styles";
import routes from "../../configs/routes";
import logo from "../../assets/EchoDial-temp-logo-full.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleClickOff = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setExpanded(false);
  };

  return (
    <SidebarStyled>
      <div className="mobile">
        <div className="header">
          <img
            className="hoverable"
            src={logo}
            alt="EchoDial logo"
            onClick={() => navigate(routes.landing)}
          />
          <div
            className="hamburger-menu"
            onClick={() => setExpanded(!expanded)}
          >
            <AiOutlineMenu fontSize="26px" color="white" />
          </div>
        </div>

        {expanded && (
          <div className="hamburger-menu-drawer" onClick={handleClickOff}>
            <div className="hamburger-menu-drawer-links">
              <div className="content">
                <NavLink to={routes.dashboard}>
                  <AiOutlineDashboard fontSize="1.5rem" />
                  <div>Dashboard</div>
                </NavLink>

                <NavLink to={routes.leads}>
                  <MdGroups fontSize="1.5rem" />
                  <div>Leads</div>
                </NavLink>

                <NavLink to={routes.dialer}>
                  <FaPhone fontSize="1.5rem" />
                  <div>Dialer</div>
                </NavLink>

                <NavLink to={routes.buckets}>
                  <FaBucket fontSize="1.5rem" />
                  <div>Buckets</div>
                </NavLink>

                <NavLink to={routes.callerIds}>
                  <FaAddressBook fontSize="1.5rem" />
                  <div>Caller IDs</div>
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
        <div className="header">
          <img
            src={logo}
            alt="EchoDial logo"
            className="hoverable"
            onClick={() => navigate(routes.landing)}
          />
        </div>

        <div className="content">
          <NavLink to={routes.dashboard}>
            <AiOutlineDashboard fontSize="1.5rem" />
            <div>Dashboard</div>
          </NavLink>

          <NavLink to={routes.leads}>
            <MdGroups fontSize="1.5rem" />
            <div>Leads</div>
          </NavLink>

          <NavLink to={routes.dialer}>
            <FaPhone fontSize="1.5rem" />
            <div>Dialer</div>
          </NavLink>

          <NavLink to={routes.buckets}>
            <FaBucket fontSize="1.5rem" />
            <div>Buckets</div>
          </NavLink>

          <NavLink to={routes.callerIds}>
            <FaAddressBook fontSize="1.5rem" />
            <div>Caller IDs</div>
          </NavLink>

          <NavLink to={routes.callHistory}>
            <GoHistory fontSize="1.5rem" />
            <div>Call History</div>
          </NavLink>

          <NavLink to={routes.billing}>
            <FaCreditCard fontSize="1.5rem" />
            <div>Billing</div>
          </NavLink>
        </div>

        <div className="footer">
          <NavLink to={routes.settings}>
            <IoIosSettings fontSize="1.5rem" />
            <div>Settings</div>
          </NavLink>
        </div>
      </div>
    </SidebarStyled>
  );
};

export default Sidebar;
