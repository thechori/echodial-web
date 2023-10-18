import { Navigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectJwt, selectJwtDecoded, signOut } from "../../store/user/slice";
import routes from "../../configs/routes";

const ProtectedRoute = ({ children }: any) => {
  const dispatch = useAppDispatch();
  const jwt = useAppSelector(selectJwt);
  const jwtDecoded = useAppSelector(selectJwtDecoded);

  // Handle no JWT
  if (!jwt || !jwtDecoded) {
    return <Navigate to={routes.signIn} replace />;
  }

  // Politely handle expired JWT
  const currentTime = new Date().getTime() / 1000;
  if (currentTime > jwtDecoded.exp) {
    notifications.show({ message: "Session expired. Please log in again" });
    dispatch(signOut());
    return <Navigate to={routes.signIn} replace />;
  }

  return children;
};

export default ProtectedRoute;
