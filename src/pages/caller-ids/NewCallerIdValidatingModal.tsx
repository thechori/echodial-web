import { Button, Center, Loader, Modal, Text } from "@mantine/core";
//
import { useEffect, useState } from "react";
import { extractErrorMessage } from "../../utils/error";
import { useLazyGetCallerIdsQuery } from "../../services/caller-id";
import { notifications } from "@mantine/notifications";

type TNewCallerIdValidatingModalProps = {
  opened: boolean;
  close: () => void;
};

const NewCallerIdValidatingModal = ({
  opened,
  close,
}: TNewCallerIdValidatingModalProps) => {
  // TODO: Use a lazy query to fetch the caller id AFTER apiService finds it
  // Or we can just keep using the lazy query and check for diffs?

  // TODO: update number of attempts
  const [attempts, setAttempts] = useState(3);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [getCallerIds] = useLazyGetCallerIdsQuery();

  useEffect(() => {
    if (!opened) return;

    console.log("opened! starting timer");

    const int = setInterval(async () => {
      // Check for success
      if (success) {
        clearInterval(int);
        console.log("success!!");
      }

      // Limit number of attempts
      console.log("attempts: ", attempts);
      if (attempts < 0) {
        clearInterval(int);
        notifications.show({
          message:
            "Hit max time limit for verifying your number. Please refresh the page and try again.",
        });
        close();
        return;
      }

      try {
        setAttempts((a) => a - 1);
        console.log("fetching caller ids");
        const res = await getCallerIds().unwrap();
        console.log(res);

        // Check for any items that have `null` value in `twilio_sid`
        const hasNullSids = res.some((cid) => cid.twilio_sid === null);
        if (!hasNullSids) {
          setSuccess(true);
        }

        // Once they no longer exist, we assume success
      } catch (e) {
        setError(extractErrorMessage(e));
      }
    }, 2000);

    return () => {
      clearInterval(int);
    };
  }, [opened]);

  function cancel() {
    // Cancel API request
    // TODO

    // Close modal
    close();
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
        {!success ? (
          <>
            <Text mb="md">
              Enter the Validation Code that you receive via SMS into the phone
              call to complete this step.
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
          </>
        ) : (
          <>
            <Text>Verification complete!</Text>
            <Text>Your phone number was verified successfully. Thank you!</Text>
            <Button onClick={cancel}>Close</Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default NewCallerIdValidatingModal;
