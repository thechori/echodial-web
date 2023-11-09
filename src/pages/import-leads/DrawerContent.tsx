import { Text, Input, Button, Select, Alert } from "@mantine/core";
import { useState } from "react";
import {
  useGetLeadPropertyGroupQuery,
  useAddCustomPropertyMutation,
} from "../../services/lead";
import { useEffect } from "react";
import { IconAlertCircle } from "@tabler/icons-react";
import { extractErrorMessage } from "../../utils/error";

function DrawerContent() {
  const [newLabel, setNewLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [propertyGroupList, setPropertyGroupList] = useState([]);
  const [displayError, setDisplayError] = useState(false);
  const [displaySuccess, setSuccess] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [addCustomProperty] = useAddCustomPropertyMutation();
  const { data: propertyGroups, error: propertyGroupsError } =
    useGetLeadPropertyGroupQuery();

  useEffect(() => {
    if (propertyGroups && !propertyGroupsError) {
      const groupData: any = propertyGroups.map((propertyGroup) => ({
        value: propertyGroup.id,
        label: propertyGroup.label,
      }));
      setPropertyGroupList(groupData);
    }
  }, []);

  function newGroupHandler(group: any) {
    setNewGroup(group);
  }
  function newLabelHandler(event: any) {
    setNewLabel(event.target.value);
  }

  function newDescriptionHandler(event: any) {
    setNewDescription(event.target.value);
  }

  async function submitHandler() {
    const textPropertyId = 7;

    try {
      await addCustomProperty({
        lead_property_group_id: newGroup,
        lead_property_type_id: textPropertyId,
        label: newLabel,
        description: newDescription,
      }).unwrap();
      setDisplayError(false);
      setErrorMessage("");

      setSuccess(true);
    } catch (e) {
      setDisplayError(true);
      setSuccess(false);

      setErrorMessage(extractErrorMessage(e));
    }
  }
  return (
    <>
      <Text>Create a new property</Text>

      <Select
        placeholder="Group"
        data={propertyGroupList}
        py="lg"
        onChange={(group) => newGroupHandler(group)}
      />
      <Input
        placeholder="Label"
        py="lg"
        onChange={newLabelHandler}
        value={newLabel}
      />

      <Input
        placeholder="Description"
        py="lg"
        onChange={newDescriptionHandler}
        value={newDescription}
      />
      <Button
        variant="gradient"
        gradient={{ from: "blue", to: "cyan", deg: 90 }}
        onClick={submitHandler}
      >
        Submit
      </Button>

      {displayError && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error!"
          color="red"
          py="lg"
        >
          {errorMessage}
        </Alert>
      )}
      {displaySuccess && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Success!"
          color="green"
          py="lg"
        >
          New property {newLabel} was created!
        </Alert>
      )}
    </>
  );
}

export default DrawerContent;
