import { Button, Flex } from "@mantine/core";
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
    <Flex
      className="action-buttons"
      style={{
        visibility: selectedRows.length === 0 ? "hidden" : "unset",
      }}
    >
      <Button
        size="xs"
        color="red"
        mx={6}
        leftIcon={<IconTrash />}
        variant="subtle"
        onClick={onDelete}
      >
        Delete
      </Button>
      <Button
        style={{
          visibility: selectedRows.length === 1 ? "unset" : "hidden",
        }}
        size="xs"
        mx={6}
        variant="subtle"
        leftIcon={<IconEdit />}
        onClick={onEdit}
      >
        Edit
      </Button>
    </Flex>
  );
}

export default EditLeadSelectionMenu;
