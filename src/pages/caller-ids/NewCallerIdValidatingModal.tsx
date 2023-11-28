import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { Button, Center, Loader, Modal, Text } from "@mantine/core";
//
import { extractErrorMessage } from "../../utils/error";
import { useLazyGetCallerIdsQuery } from "../../services/caller-id";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectJwtDecoded } from "../../store/user/slice";
import { setShowNewCallerIdValidatingModal } from "../../store/dialer/slice";

// MAX_ATTEMPTS * RETRY_COOLDOWN_IN_MS = ~1 minute (in MS)
const MAX_ATTEMPTS = 24;
const RETRY_COOLDOWN_IN_MS = 2500;

const NewCallerIdValidatingModal = () => {
  const dispatch = useAppDispatch();
  const opened = useAppSelector(
    (state) => state.dialer.showNewCallerIdValidatingModal
  );
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [getCallerIds] = useLazyGetCallerIdsQuery();
  const jwtDecoded = useAppSelector(selectJwtDecoded);

  const handleClose = () => {
    setSuccess(false);
    setAttempts(MAX_ATTEMPTS);
    setError("");
    dispatch(setShowNewCallerIdValidatingModal(false));
  };

  useEffect(() => {
    if (!opened) return;

    const int = setInterval(async () => {
      // Check for success
      if (success) {
        clearInterval(int);
      }

      // Limit number of attempts
      if (attempts < 0) {
        clearInterval(int);
        notifications.show({
          title: "Unsuccessful",
          color: "red",
          autoClose: false,
          message:
            "Hit max time limit for verifying your number. Please refresh the page and try again.",
        });

        handleClose();
        return;
      }

      try {
        setAttempts((a) => a - 1);
        const callerIds = await getCallerIds().unwrap();

        if (!jwtDecoded || jwtDecoded.email === null)
          throw Error("Email not found in jwt");

        const filteredCallerIds = callerIds.filter(
          (cid) => cid.email === jwtDecoded.email
        );
        if (!filteredCallerIds.length) {
          console.info("No caller IDs found with that email, yet. Waiting...");
          return;
        }

        // Mandate all items have a non-null value in `twilio_sid`
        let shouldSucceed = filteredCallerIds.every((fcid) => {
          if (fcid.twilio_sid === null) {
            return false;
          }
          return true;
        });

        if (shouldSucceed) {
          notifications.show({
            color: "green",
            title: "Success",
            message:
              "Great work! Your phone number has been successfully verified.",
          });
          setSuccess(true);
          clearInterval(int);
          handleClose();
        }

        // Once they no longer exist, we assume success
      } catch (e) {
        setError(extractErrorMessage(e));
      }
    }, RETRY_COOLDOWN_IN_MS);

    return () => {
      clearInterval(int);
    };
  }, [opened, attempts]);

  function cancel() {
    handleClose();
  }

  return (
    <Modal
      opened={opened}
      onClose={() =>
        console.info("log to satisfy mandatory onClose function property")
      }
      title="Verifying your number"
      withCloseButton={false}
    >
      <Modal.Body>
        <Text mb="md">
          Enter the Validation Code that you receive via SMS into the phone call
          to complete this step.
        </Text>
        <Text>Please hold on while we verify your number.</Text>

        <Center py={64}>
          <Loader />
        </Center>

        <Center>
          <Button onClick={cancel}>Cancel</Button>
        </Center>

        <Text w="100%" color="red">
          {error}
        </Text>
      </Modal.Body>
    </Modal>
  );
};

export default NewCallerIdValidatingModal;
