import { Link } from "react-router-dom";
//
import HeaderStyled from "./Header.styles";

const Header = () => {
  return (
    <HeaderStyled>
      <Link to="/">Home</Link>
      <Link to="/sign-in">Sign in</Link>
      <Link to="/sign-up">Sign up</Link>
      <Link to="/register">Home</Link>
      <Link to="/settings">Settings</Link>
    </HeaderStyled>
  );
};

export default Header;
