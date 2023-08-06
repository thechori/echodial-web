import { Navigate } from "react-router-dom";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectJwt, selectJwtDecoded, signOut } from "../../store/user/slice";

const ProtectedRoute = ({ children }: any) => {
  const dispatch = useAppDispatch();
  const jwt = useAppSelector(selectJwt);
  const jwtDecoded = useAppSelector(selectJwtDecoded);

  // Handle no JWT
  if (!jwt || !jwtDecoded) {
    return <Navigate to="/sign-in" replace />;
  }

  // Politely handle expired JWT
  const currentTime = new Date().getTime() / 1000;
  if (currentTime > jwtDecoded.exp) {
    alert(
      "Your session has ended. For security reasons, please sign in again."
    );
    dispatch(signOut());
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;
