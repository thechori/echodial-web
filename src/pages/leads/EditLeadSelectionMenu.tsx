import { Menu, Button } from "@mantine/core";
import { IconTrash, IconEdit, IconDots } from "@tabler/icons-react";

type TEditLeadSelectionMenuProps = {
  rowsSelected: any[];
  onDelete: (rows: any) => void;
  onEdit: (row: any) => void;
};

function EditLeadSelectionMenu({
  rowsSelected,
  onDelete,
  onEdit,
}: TEditLeadSelectionMenuProps) {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          disabled={!rowsSelected.length}
          leftIcon={<IconDots size="1rem" />}
        >
          Actions
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          disabled={rowsSelected.length !== 1}
          onClick={() => onEdit(rowsSelected[0])}
          icon={<IconEdit size={14} />}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          disabled={rowsSelected.length === 0}
          onClick={() => onDelete(rowsSelected)}
          icon={<IconTrash size={14} color="red" />}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default EditLeadSelectionMenu;
