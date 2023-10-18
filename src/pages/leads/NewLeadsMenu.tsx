import { Button, Flex } from "@mantine/core";
import { IconUpload, IconPlus } from "@tabler/icons-react";

type TNewLeadsMenuProps = {
  onCsvUpload: () => void;
  onManualInput: () => void;
};

function NewLeadsMenu({ onCsvUpload, onManualInput }: TNewLeadsMenuProps) {
  return (
    <Flex>
      <Button
        mx={4}
        variant="subtle"
        onClick={onCsvUpload}
        leftIcon={<IconUpload size={14} />}
      >
        Import
      </Button>
      <Button mx={4} onClick={onManualInput} leftIcon={<IconPlus size={14} />}>
        Create lead
      </Button>
    </Flex>
  );
}

export default NewLeadsMenu;
