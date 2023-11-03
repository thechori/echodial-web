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
import { Box } from "@mantine/core";
import AlphaDialer from "../../pages/dialer/AlphaDialer";
import AlphaDialerFab from "../../pages/dialer/AlphaDialerFab";

const Container = styled.div`
  height: 100%;

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

      {/* Main content area */}
      <Box className="content">{children}</Box>

      {/* Modals */}
      <DialerOptionsModal
        opened={isDialerOptionsModalOpen}
        onClose={() => dispatch(setShowOptions(false))}
      />
      <ProtectedBetaModal />
      <AlphaDialer />
      <AlphaDialerFab />
    </Container>
  );
};

export default AuthenticatedUserLayout;
