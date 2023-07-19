import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
//
import HeaderStyled from "./Header.styles";
import leadsLogoFull from "../../assets/l34ds-logo-full.png";

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const { pathname } = useLocation();

  const handleClickOff = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setExpanded(false);
  };

  if (pathname === "/sign-in") {
    return null;
  }

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
                  <Link className="light" to="/">
                    Home
                  </Link>
                  <Link className="light" to="/sign-in">
                    Sign in
                  </Link>
                  <Link className="button light" to="/sign-up">
                    Try for free
                  </Link>
                </div>
              </div>
            )}

            <div className="full-menu">
              <Link className="light" to="/">
                Home
              </Link>
              <Link className="light" to="/sign-in">
                Sign in
              </Link>
              <div className="sign-up-container">
                <Link className="button" to="/sign-up">
                  Try for free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeaderStyled>
  );
};

export default Header;
