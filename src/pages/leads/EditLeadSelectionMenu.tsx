import { Menu, Button } from "@mantine/core";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import { useAppSelector } from "../../store/hooks";

type TEditLeadSelectionMenuProps = {
  onDelete: (rows: any) => void;
  onEdit: (row: any) => void;
};

function EditLeadSelectionMenu({
  onDelete,
  onEdit,
}: TEditLeadSelectionMenuProps) {
  const { selectedRows } = useAppSelector((state) => state.leads);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button mr="xs" disabled={!selectedRows.length}>
          Actions
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          disabled={selectedRows.length !== 1}
          onClick={() => onEdit(selectedRows[0])}
          icon={<IconEdit size={14} />}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          disabled={selectedRows.length === 0}
          onClick={() => onDelete(selectedRows)}
          icon={<IconTrash size={14} color="red" />}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default EditLeadSelectionMenu;
