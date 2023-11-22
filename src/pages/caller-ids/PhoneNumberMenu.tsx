import { Menu, ActionIcon, Loader } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

function PhoneNumberMenu({
  onDelete,
  isLoading,
}: {
  onDelete: () => void;
  isLoading: boolean;
}) {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon color="red" size="sm">
          <IconTrash />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Are you sure?</Menu.Label>
        <Menu.Item
          onClick={onDelete}
          color="red"
          icon={!isLoading ? <IconTrash size={14} /> : <Loader size="sm" />}
          disabled={isLoading}
        >
          {!isLoading ? "Yes, delete it" : "..."}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default PhoneNumberMenu;
