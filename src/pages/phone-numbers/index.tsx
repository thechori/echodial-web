import { useNavigate } from "react-router-dom";
//
import { useAppDispatch } from "../../store/hooks";
import { signOut } from "../../store/user/slice";
import routes from "../../configs/routes";
import PhoneNumbersStyled from "./PhoneNumbers.styles";

function PhoneNumbers() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleSignOut() {
    dispatch(signOut());
    navigate(routes.signIn);
  }

  return (
    <PhoneNumbersStyled>
      <div className="container">
        <h1>Phone Numbers</h1>
        <p>Here are some PhoneNumbers</p>
        <p>(832) 111-2222</p>
        <p>(832) 111-2222</p>
        <p>(832) 111-2222</p>
        <p>(832) 111-2222</p>
        <p>(832) 111-2222</p>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </PhoneNumbersStyled>
  );
}

export default PhoneNumbers;
