import { useNavigate } from "react-router-dom";
//
import { useAppDispatch } from "../../store/hooks";
import { signOut } from "../../store/user/slice";
import routes from "../../configs/routes";
import LeadsStyled from "./Leads.styles";

function Leads() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleSignOut() {
    dispatch(signOut());
    navigate(routes.signIn);
  }

  return (
    <LeadsStyled>
      <div className="container">
        <h1>Leads</h1>
        <p>Here are some Leads</p>
        <p>Lead #1</p>
        <p>Lead #1</p>
        <p>Lead #1</p>
        <p>Lead #1</p>
        <p>Lead #1</p>
        <p>Lead #1</p>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </LeadsStyled>
  );
}

export default Leads;
