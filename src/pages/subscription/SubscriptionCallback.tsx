import { useEffect } from "react";
import { Center, Loader, Modal } from "@mantine/core";
//
import { LOCAL_STORAGE_JWT } from "../../configs/local-storage";
import { useNavigate } from "react-router-dom";
import routes from "../../configs/routes";

/**
 * SubscriptionCallback pages handles post-subscription success event to update to the user's stripe_subscription_id value
 */
export const SubscriptionCallback = () => {
  console.log(localStorage.getItem(LOCAL_STORAGE_JWT));

  const navigate = useNavigate();

  useEffect(() => {
    // Check for new stripe subscription information + update redux state
    // TODO
    navigate(routes.settings);
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
