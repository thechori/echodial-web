import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
//
import HeaderStyled from "./Header.styles";
import leadsLogoFull from "../../assets/l34ds-logo-full.png";
import routes from "../../configs/routes";
import { useAppSelector } from "../../store/hooks";
import { selectJwt } from "../../store/user/slice";

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const jwt = useAppSelector(selectJwt);

  const handleClickOff = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setExpanded(false);
  };

  return (
    <HeaderStyled>
      <div className="container">
        <div className="header-container">
          <div
            className="logo hoverable"
            onClick={() => navigate(routes.landing)}
          >
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
                  <NavLink className="light" to={routes.landing}>
                    Home
                  </NavLink>
                  <NavLink className="light" to={routes.features}>
                    Features
                  </NavLink>
                  <NavLink className="light" to={routes.pricing}>
                    Pricing
                  </NavLink>
                  <NavLink className="light" to={routes.signIn}>
                    Sign in
                  </NavLink>
                  <NavLink className="button light" to={routes.tryL34ds}>
                    Try for free
                  </NavLink>
                </div>
              </div>
            )}

            <div className="full-menu">
              {jwt ? (
                <>
                  <NavLink className="light" to={routes.landing}>
                    Home
                  </NavLink>
                  <NavLink className="light" to={routes.features}>
                    Features
                  </NavLink>
                  <NavLink className="light" to={routes.pricing}>
                    Pricing
                  </NavLink>

                  <div className="sign-up-container">
                    <NavLink className="button" to={routes.dashboard}>
                      Dashboard
                    </NavLink>
                  </div>
                </>
              ) : (
                <>
                  <NavLink className="light" to={routes.landing}>
                    Home
                  </NavLink>
                  <NavLink className="light" to={routes.features}>
                    Features
                  </NavLink>
                  <NavLink className="light" to={routes.pricing}>
                    Pricing
                  </NavLink>
                  <NavLink className="light" to={routes.signIn}>
                    Sign in
                  </NavLink>
                  <div className="sign-up-container">
                    <NavLink className="button" to={routes.tryL34ds}>
                      Try for free
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </HeaderStyled>
  );
};

export default Header;
