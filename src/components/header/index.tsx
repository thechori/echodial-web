import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
//
import HeaderStyled from "./Header.styles";
import leadsLogoFull from "../../assets/l34ds-logo-full.png";

const Header = () => {
  const [expanded, setExpanded] = useState(false);

  const handleClickOff = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setExpanded(false);
  };

  return (
    <HeaderStyled>
      <div className="container">
        <div className="header-container">
          <div className="logo">
            <img src={leadsLogoFull} alt="L34ds company logo" />
          </div>
          <div className="links">
            <div
              className="hamburger-menu"
              onClick={() => setExpanded(!expanded)}
            >
              <AiOutlineMenu fontSize="26px" color="white" />
            </div>

            {expanded && (
              <div className="hamburger-menu-drawer" onClick={handleClickOff}>
                <div className="hamburger-menu-drawer-links">
                  <Link to="/">Home</Link>
                  <Link to="/sign-in">Sign in</Link>
                  <Link to="/sign-up">Sign up</Link>
                  <Link to="/settings">Settings</Link>
                </div>
              </div>
            )}

            <div className="full-menu">
              <Link to="/">Home</Link>
              <Link to="/sign-in">Sign in</Link>
              <Link to="/sign-up">Sign up</Link>
              <Link to="/settings">Settings</Link>
            </div>
          </div>
        </div>
      </div>
    </HeaderStyled>
  );
};

export default Header;
