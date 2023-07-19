import { Navigate } from "react-router-dom";
//
import { useAppSelector } from "../../store/hooks";
import { selectJwt } from "../../store/user/slice";

const ProtectedRoute = ({ children }: any) => {
  const jwt = useAppSelector(selectJwt);

  if (!jwt) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;
