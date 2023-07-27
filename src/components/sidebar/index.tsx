import { NavLink, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  return (
    <SidebarStyled>
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
          <FaHome fontSize="1.75rem" />
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

        <NavLink to={routes.pipelines}>
          <FaFolderOpen fontSize="1.75rem" />
          <div>Pipelines</div>
        </NavLink>

        <NavLink to={routes.reports}>
          <BiSolidReport fontSize="1.75rem" />
          <div>Reports</div>
        </NavLink>

        <NavLink to={routes.phoneNumbers}>
          <FaAddressBook fontSize="1.75rem" />
          <div>Phone Numbers</div>
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
    </SidebarStyled>
  );
};

export default Sidebar;
