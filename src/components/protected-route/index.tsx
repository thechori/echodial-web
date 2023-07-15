import { Navigate } from "react-router-dom";
//
import { useAppSelector } from "../../store/hooks";
import { selectJwt } from "../../store/user/slice";

const ProtectedRoute = ({ children }: any) => {
  const jwt = useAppSelector(selectJwt);

  if (!jwt) {
    console.log("not authorized");
    return <Navigate to="/sign-in" replace />;
  }

  console.log("authorized!");

  return children;
};

export default ProtectedRoute;
