import { Menu, Button } from "@mantine/core";
import { IconUpload, IconPlus } from "@tabler/icons-react";

type TNewLeadsMenuProps = {
  onCsvUpload: () => void;
  onManualInput: () => void;
};

function NewLeadsMenu({ onCsvUpload, onManualInput }: TNewLeadsMenuProps) {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button leftIcon={<IconPlus size="1rem" />}>New Leads</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={onCsvUpload} icon={<IconUpload size={14} />}>
          Upload CSV
        </Menu.Item>
        <Menu.Item onClick={onManualInput} icon={<IconPlus size={14} />}>
          Manually input
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default NewLeadsMenu;
