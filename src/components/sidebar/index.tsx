import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaPhone,
  FaFolderOpen,
  FaCreditCard,
  FaAddressBook,
} from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";
//
import SidebarStyled from "./Sidebar.styles";
import routes from "../../configs/routes";
import logo from "../../assets/l34ds-logo-full.png";

const Sidebar = () => {
  const { pathname } = useLocation();

  // Don't show on landing, sign-in, or try-l34ds
  if (
    pathname === routes.landing ||
    pathname === routes.signIn ||
    pathname === routes.tryL34ds
  ) {
    return null;
  }

  return (
    <SidebarStyled>
      <div className="header">
        <img src={logo} alt="L34ds logo" />
      </div>

      <div className="content">
        <NavLink to={routes.dashboard}>
          <FaHome fontSize="1.5rem" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to={routes.dialer}>
          <FaPhone fontSize="1.5rem" />
          <span>Dialer</span>
        </NavLink>

        <NavLink to={routes.leads}>
          <MdGroups fontSize="1.5rem" />
          <span>Leads</span>
        </NavLink>

        <NavLink to={routes.pipelines}>
          <FaFolderOpen fontSize="1.5rem" />
          <span>Pipelines</span>
        </NavLink>

        <NavLink to={routes.reports}>
          <BiSolidReport fontSize="1.5rem" />
          <span>Reports</span>
        </NavLink>

        <NavLink to={routes.phoneNumbers}>
          <FaAddressBook fontSize="1.5rem" />
          <span>Phone Numbers</span>
        </NavLink>

        <NavLink to={routes.billing}>
          <FaCreditCard fontSize="1.5rem" />
          <span>Billing</span>
        </NavLink>
      </div>

      <div className="footer">
        <NavLink to={routes.settings}>
          <IoIosSettings fontSize="1.5rem" />
          <span>Settings</span>
        </NavLink>
      </div>
    </SidebarStyled>
  );
};

export default Sidebar;
