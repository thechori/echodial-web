import { Menu, ActionIcon } from "@mantine/core";
import { BiDotsVerticalRounded } from "react-icons/bi";
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
        <ActionIcon>
          <BiDotsVerticalRounded />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          onClick={onDelete}
          color="red"
          icon={<IconTrash size={14} />}
          disabled={isLoading}
        >
          {!isLoading ? "Delete number" : "..."}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default PhoneNumberMenu;
