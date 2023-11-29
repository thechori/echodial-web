import { Text, Input, Button, Select } from "@mantine/core";
import { useState } from "react";
import {
  useGetLeadPropertyGroupQuery,
  useAddCustomPropertyMutation,
} from "../../services/lead";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { extractErrorMessage } from "../../utils/error";
function DrawerContent(props: any) {
  const [error, setError] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [propertyGroupList, setPropertyGroupList] = useState([]);
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
  }, [propertyGroups, propertyGroupsError]);

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
      notifications.show({ message: "Custom property successfully created!" });
      props.close();
    } catch (e) {
      const errorMessage = extractErrorMessage(e);
      setError(errorMessage);
      notifications.show({
        message: "Failed to create custom property: " + errorMessage,
      });
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
      <Text color="red">{error}</Text>
    </>
  );
}

export default DrawerContent;
