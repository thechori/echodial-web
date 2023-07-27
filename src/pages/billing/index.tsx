import { useNavigate } from "react-router-dom";
//
import { useAppDispatch } from "../../store/hooks";
import { signOut } from "../../store/user/slice";
import routes from "../../configs/routes";
import BillingStyled from "./Billing.styles";

function Billing() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleSignOut() {
    dispatch(signOut());
    navigate(routes.signIn);
  }

  return (
    <BillingStyled>
      <div className="container">
        <h1>Billing</h1>
        <p>Here are some Billing</p>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </BillingStyled>
  );
}

export default Billing;
