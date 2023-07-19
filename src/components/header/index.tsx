import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
//
import HeaderStyled from "./Header.styles";
import leadsLogoFull from "../../assets/l34ds-logo-full.png";
import routes from "../../configs/routes";
import { useAppSelector } from "../../store/hooks";

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.user.jwt);

  const handleClickOff = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setExpanded(false);
  };

  if (pathname === routes.signIn || pathname === routes.tryL34ds) {
    return null;
  }

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
                  {isLoggedIn ? (
                    <>
                      <Link className="light" to={routes.landing}>
                        Home
                      </Link>
                      <Link className="light" to={routes.proDial}>
                        Dialer
                      </Link>
                      <Link className="light" to={routes.settings}>
                        Settings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link className="light" to={routes.landing}>
                        Home
                      </Link>
                      <Link className="light" to={routes.signIn}>
                        Sign in
                      </Link>
                      <Link className="button light" to={routes.tryL34ds}>
                        Try for free
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="full-menu">
              {isLoggedIn ? (
                <>
                  <Link className="light" to={routes.dashboard}>
                    Home
                  </Link>
                  <Link className="light" to={routes.proDial}>
                    Dialer
                  </Link>
                  <Link className="light" to={routes.settings}>
                    Settings
                  </Link>
                </>
              ) : (
                <>
                  <Link className="light" to={routes.landing}>
                    Home
                  </Link>
                  <Link className="light" to={routes.signIn}>
                    Sign in
                  </Link>
                  <div className="sign-up-container">
                    <Link className="button" to={routes.tryL34ds}>
                      Try for free
                    </Link>
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
