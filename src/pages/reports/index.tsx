import { useNavigate } from "react-router-dom";
//
import { useAppDispatch } from "../../store/hooks";
import { signOut } from "../../store/user/slice";
import routes from "../../configs/routes";
import ReportsStyled from "./Reports.styles";

function Reports() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleSignOut() {
    dispatch(signOut());
    navigate(routes.signIn);
  }

  return (
    <ReportsStyled>
      <div className="container">
        <h1>Reports</h1>
        <p>Here are some Reports</p>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </ReportsStyled>
  );
}

export default Reports;
