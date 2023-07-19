import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setJwt } from "../../store/user/slice";
import routes from "../../configs/routes";
import SettingsStyled from "./Settings.styles";

function Settings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleSignOut() {
    dispatch(setJwt(null));
    navigate(routes.signIn);
  }

  return (
    <SettingsStyled>
      <div className="container">
        <h1>Settings</h1>
        <p>Here are some settings</p>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </SettingsStyled>
  );
}

export default Settings;
