import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
//
import routes from "../../configs/routes";

function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(routes.signUp);
  }, []);

  return null;
}

export default Landing;
