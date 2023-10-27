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
        onClick={onManualInput}
        leftIcon={<IconPlus size={16} />}
      >
        Create lead
      </Button>
      <Button
        mx={4}
        variant="light"
        onClick={onCsvUpload}
        leftIcon={<IconUpload size={16} />}
      >
        Import leads
      </Button>
    </Flex>
  );
}

export default NewLeadsMenu;
