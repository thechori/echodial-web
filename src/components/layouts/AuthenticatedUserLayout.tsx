import { styled } from "styled-components";
//
import Sidebar from "../sidebar";
import devices from "../../styles/devices";
import DialerOptionsModal from "../../pages/dialer/DialerOptionsModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectIsDialerOptionsModalOpen,
  setShowOptions,
} from "../../store/dialer/slice";
import ProtectedBetaModal from "../protected-beta-modal";
import BetaDialer from "../../pages/dialer/BetaDialer";
import { Box } from "@mantine/core";

const Container = styled.div`
  display: block;

  @media ${devices.tablet} {
    display: flex;
  }

  .content {
    width: 100%;
  }
`;

const AuthenticatedUserLayout = ({ children }: any) => {
  const dispatch = useAppDispatch();
  const isDialerOptionsModalOpen = useAppSelector(
    selectIsDialerOptionsModalOpen
  );

  return (
    <Container>
      <Sidebar />
      <div className="content">
        <Box p="md">
          <BetaDialer />
        </Box>
        <div>{children}</div>
      </div>
      <DialerOptionsModal
        opened={isDialerOptionsModalOpen}
        onClose={() => dispatch(setShowOptions(false))}
      />
      <ProtectedBetaModal />
    </Container>
  );
};

export default AuthenticatedUserLayout;
