import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Center, Checkbox, Modal, Text } from "@mantine/core";
//
import { extractErrorMessage } from "../../utils/error";
import apiService from "../../services/api";
import { useAppDispatch } from "../../store/hooks";
import { signOut } from "../../store/user/slice";

type TDeleteAccountModalProps = {
  opened: boolean;
  close: () => void;
};

const DeleteAccountModal = ({ opened, close }: TDeleteAccountModalProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    try {
      setError("");
      setLoading(true);
      await apiService.delete("/user");
      dispatch(signOut());
      navigate("/");
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setAgree(false);
    close();
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Delete account">
      <Modal.Body>
        <Text mb="md">
          Are you sure you want to do this? You will lose all data associated
          with this account.
        </Text>

        <Checkbox
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          label="Yes, I understand that all of my data will be destroyed"
        />

        <Center mt={20}>
          <Button
            color="red"
            disabled={!agree}
            loading={loading}
            onClick={handleSubmit}
          >
            Delete my account
          </Button>
        </Center>

        <Text w="100%" color="red">
          {error}
        </Text>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteAccountModal;
