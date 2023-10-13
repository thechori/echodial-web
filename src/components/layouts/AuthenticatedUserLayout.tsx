import { styled } from "styled-components";
//
import Sidebar from "../sidebar";
import devices from "../../styles/devices";
import AlphaDialer from "../../pages/dialer/AlphaDialer";
import DialerOptionsModal from "../../pages/dialer/DialerOptionsModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectIsDialerOptionsModalOpen,
  setShowOptions,
} from "../../store/dialer/slice";
import ProtectedBetaModal from "../protected-beta-modal";

const Container = styled.div`
  display: block;
  padding-bottom: 100px; // To account for the dialer status bar

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
      <div className="content">{children}</div>
      <DialerOptionsModal
        opened={isDialerOptionsModalOpen}
        onClose={() => dispatch(setShowOptions(false))}
      />
      <AlphaDialer />
      <ProtectedBetaModal />
    </Container>
  );
};

export default AuthenticatedUserLayout;
