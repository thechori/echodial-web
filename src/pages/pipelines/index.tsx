import { useNavigate } from "react-router-dom";
//
import { useAppDispatch } from "../../store/hooks";
import { signOut } from "../../store/user/slice";
import routes from "../../configs/routes";
import PipelinesStyled from "./Pipelines.styles";

function Pipelines() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleSignOut() {
    dispatch(signOut());
    navigate(routes.signIn);
  }

  return (
    <PipelinesStyled>
      <div className="container">
        <h1>Pipelines</h1>
        <p>Here are some Pipelines</p>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </PipelinesStyled>
  );
}

export default Pipelines;
