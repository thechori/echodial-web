import { useEffect } from "react";
import { Center, Loader, Modal } from "@mantine/core";
//
import { useNavigate } from "react-router-dom";
import routes from "../../configs/routes";
import apiService from "../../services/api";
import { notifications } from "@mantine/notifications";
import { extractErrorMessage } from "../../utils/error";
import { useAppDispatch } from "../../store/hooks";
import { setJwt } from "../../store/user/slice";

/**
 * SubscriptionCallback pages handles post-subscription success event to update to the user's stripe_subscription_id value
 */
export const SubscriptionCallback = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const getRefreshToken = async () => {
    try {
      const res = await apiService.get("/auth/refresh-token");
      console.log(res);
      dispatch(setJwt(res.data));
    } catch (e) {
      notifications.show({ message: extractErrorMessage(e) });
    } finally {
      navigate(routes.settings);
    }
  };

  useEffect(() => {
    // Refresh JWT to get new information (e.g., stripe_subscription_id addition after signing up for new subscription)
    getRefreshToken();
  }, []);

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
