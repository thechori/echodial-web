import { Button, Flex } from "@mantine/core";
import { IconUpload, IconPlus } from "@tabler/icons-react";

type TLeadsHeaderProps = {
  onCsvUpload: () => void;
  onManualInput: () => void;
};

function LeadsHeader({ onCsvUpload, onManualInput }: TLeadsHeaderProps) {
  return (
    <Flex align="center">
      <Button
        mx={4}
        size="sm"
        variant="subtle"
        onClick={onManualInput}
        leftIcon={<IconPlus size={16} />}
      >
        New lead
      </Button>

      <Button
        mx={4}
        size="sm"
        onClick={onCsvUpload}
        leftIcon={<IconUpload size={16} />}
      >
        Import leads
      </Button>
    </Flex>
  );
}

export default LeadsHeader;
