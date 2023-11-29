import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Center, Loader, Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
//
import routes from "../../configs/routes";
import apiService from "../../services/api";
import { extractErrorMessage } from "../../utils/error";
import { useAppDispatch } from "../../store/hooks";
import { setJwt } from "../../store/user/slice";

/**
 * SubscriptionCallback pages handles post-subscription success event to update to the user's stripe_subscription_id value
 */
export const SubscriptionCallback = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const getRefreshToken = useCallback(async () => {
    try {
      const res = await apiService.get("/auth/refresh-token");
      dispatch(setJwt(res.data));
    } catch (e) {
      notifications.show({ message: extractErrorMessage(e) });
    } finally {
      navigate(routes.settings);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    // Refresh JWT to get new information (e.g., stripe_subscription_id addition after signing up for new subscription)
    getRefreshToken();
  }, [getRefreshToken]);

  return (
    <Modal
      opened={true}
      onClose={() => console.info("...")}
      withCloseButton={false}
    >
      <Center h={400}>
        <Loader />
      </Center>
    </Modal>
  );
};
