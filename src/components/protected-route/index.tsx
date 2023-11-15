import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectJwt, selectJwtDecoded, signOut } from "../../store/user/slice";
import routes from "../../configs/routes";

const ProtectedRoute = ({ children }: any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const jwt = useAppSelector(selectJwt);
  const jwtDecoded = useAppSelector(selectJwtDecoded);

  // Handle no JWT
  if (!jwt || !jwtDecoded) {
    notifications.show({ message: "No session found. Please log in again" });
    dispatch(signOut());
    navigate(routes.signIn);
  }

  return children;
};

export default ProtectedRoute;
