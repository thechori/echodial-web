import { styled } from "styled-components";
//
import Sidebar from "../sidebar";
import devices from "../../styles/devices";
import DialerOptionsModal from "../../pages/dialer/DialerOptionsModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectIsDialerOptionsModalOpen,
  setAlphaDialerVisible,
  setShowOptions,
} from "../../store/dialer/slice";
import { Box } from "@mantine/core";
import AlphaDialer from "../../pages/dialer/AlphaDialer";
import AlphaDialerFab from "../../pages/dialer/AlphaDialerFab";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

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
  const { alphaDialerVisible } = useAppSelector((state) => state.dialer);
  const isDialerOptionsModalOpen = useAppSelector(
    selectIsDialerOptionsModalOpen
  );

  // Detect route changes in order to hide the dialer overlay - improved UX to avoid them being confused when clicking side nav items and nothing happens
  const location = useLocation();
  useEffect(() => {
    if (alphaDialerVisible) {
      dispatch(setAlphaDialerVisible(false));
    }
  }, [location]);

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
      <AlphaDialer />
      <AlphaDialerFab />
    </Container>
  );
};

export default AuthenticatedUserLayout;
