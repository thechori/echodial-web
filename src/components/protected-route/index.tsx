import { Navigate } from "react-router-dom";
//
import { useAppSelector } from "../../store/hooks";
import { selectJwt } from "../../store/user/slice";
import routes from "../../configs/routes";

const ProtectedRoute = ({ children }: any) => {
  const jwt = useAppSelector(selectJwt);

  // Handle no JWT
  if (!jwt) {
    return <Navigate to={routes.signIn} />;
  }

  return children;
};

export default ProtectedRoute;
