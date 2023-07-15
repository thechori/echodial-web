import { Link } from "react-router-dom";
//
import HeaderStyled from "./Header.styles";
import leadsLogoFull from "../../assets/l34ds-logo-full.png";

const Header = () => {
  return (
    <HeaderStyled>
      <div className="container">
        <div className="header-container">
          <div className="logo">
            <img src={leadsLogoFull} alt="L34ds company logo" />
          </div>
          <div className="links">
            <Link to="/">Home</Link>
            <Link to="/sign-in">Sign in</Link>
            <Link to="/sign-up">Sign up</Link>
            <Link to="/settings">Settings</Link>
          </div>
        </div>
      </div>
    </HeaderStyled>
  );
};

export default Header;
