import { styled } from "styled-components";
//
import Sidebar from "../sidebar";
import devices from "../../styles/devices";
import DialerOptionsModal from "../../pages/dialer/DialerOptionsModal";
import { useAppDispatch } from "../../store/hooks";
import { setIsDialerOpen } from "../../store/dialer/slice";
import { Box } from "@mantine/core";
import Dialer from "../../pages/dialer/Dialer";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import NewCallerIdModal from "../../pages/caller-ids/NewCallerIdModal";
import NewCallerIdValidatingModal from "../../pages/caller-ids/NewCallerIdValidatingModal";

const Container = styled.div`
  height: 100%;

  @media ${devices.tablet} {
    display: flex;
  }

  .content {
    width: 100%;
    padding-bottom: 93px;
  }
`;

const AuthenticatedUserLayout = ({ children }: any) => {
  const dispatch = useAppDispatch();

  // Detect route changes in order to hide the dialer overlay - improved UX to avoid them being confused when clicking side nav items and nothing happens
  const location = useLocation();
  useEffect(() => {
    dispatch(setIsDialerOpen(false));
  }, [location, dispatch]);

  return (
    <Container>
      <Sidebar />

      {/* Main content area */}
      <Box className="content">{children}</Box>

      {/* Modals */}
      <DialerOptionsModal />
      <NewCallerIdModal />
      <NewCallerIdValidatingModal />

      {/* Dialer */}
      <Dialer />
    </Container>
  );
};

export default AuthenticatedUserLayout;
