import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaFolderOpen,
  FaCreditCard,
  FaAddressBook,
} from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";
import { AiOutlineMenu, AiOutlineDashboard } from "react-icons/ai";
//
import SidebarStyled from "./Sidebar.styles";
import routes from "../../configs/routes";
import logo from "../../assets/l34ds-logo-full.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleClickOff = (e: React.MouseEvent<HTMLDivElement>) => {
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
            alt="L34ds logo"
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
                  <AiOutlineDashboard fontSize="1.75rem" />
                  <div>Dashboard</div>
                </NavLink>

                <NavLink to={routes.dialer}>
                  <FaPhone fontSize="1.75rem" />
                  <div>Dialer</div>
                </NavLink>

                <NavLink to={routes.leads}>
                  <MdGroups fontSize="1.75rem" />
                  <div>Leads</div>
                </NavLink>

                <NavLink to={routes.phases}>
                  <FaFolderOpen fontSize="1.75rem" />
                  <div>Phases</div>
                </NavLink>

                {/* <NavLink to={routes.reports}>
                  <BiSolidReport fontSize="1.75rem" />
                  <div>Reports</div>
                </NavLink> */}

                <NavLink to={routes.callerIds}>
                  <FaAddressBook fontSize="1.75rem" />
                  <div>Caller IDs</div>
                </NavLink>

                <NavLink to={routes.billing}>
                  <FaCreditCard fontSize="1.75rem" />
                  <div>Billing</div>
                </NavLink>

                <NavLink to={routes.settings}>
                  <IoIosSettings fontSize="1.75rem" />
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
            alt="L34ds logo"
            className="hoverable"
            onClick={() => navigate(routes.landing)}
          />
        </div>

        <div className="content">
          <NavLink to={routes.dashboard}>
            <AiOutlineDashboard fontSize="1.75rem" />
            <div>Dashboard</div>
          </NavLink>

          <NavLink to={routes.dialer}>
            <FaPhone fontSize="1.75rem" />
            <div>Dialer</div>
          </NavLink>

          <NavLink to={routes.leads}>
            <MdGroups fontSize="1.75rem" />
            <div>Leads</div>
          </NavLink>

          <NavLink to={routes.phases}>
            <FaFolderOpen fontSize="1.75rem" />
            <div>Phases</div>
          </NavLink>

          {/* <NavLink to={routes.reports}>
            <BiSolidReport fontSize="1.75rem" />
            <div>Reports</div>
          </NavLink> */}

          <NavLink to={routes.callerIds}>
            <FaAddressBook fontSize="1.75rem" />
            <div>Caller IDs</div>
          </NavLink>

          <NavLink to={routes.billing}>
            <FaCreditCard fontSize="1.75rem" />
            <div>Billing</div>
          </NavLink>
        </div>

        <div className="footer">
          <NavLink to={routes.settings}>
            <IoIosSettings fontSize="1.75rem" />
            <div>Settings</div>
          </NavLink>
        </div>
      </div>
    </SidebarStyled>
  );
};

export default Sidebar;
