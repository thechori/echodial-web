import { useNavigate } from "react-router-dom";
//
import { useAppDispatch } from "../../store/hooks";
import { signOut } from "../../store/user/slice";
import routes from "../../configs/routes";
import BillingStyled from "./Billing.styles";
import { Box, Card, Title } from "@mantine/core";

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
        <Card>
          <Title order={2} mb={16}>
            Balance History
          </Title>
          <Box></Box>
        </Card>
        <Card>
          <Title order={2} mb={16}>
            Usage History
          </Title>

          <Box></Box>
        </Card>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
    </BillingStyled>
  );
}

export default Billing;
