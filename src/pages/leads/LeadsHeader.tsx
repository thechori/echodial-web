import { Button, Flex, HoverCard, Text } from "@mantine/core";
import { IconUpload, IconPlus } from "@tabler/icons-react";
import { PiPhone } from "react-icons/pi";
import * as amplitude from "@amplitude/analytics-browser";
import { notifications } from "@mantine/notifications";
//
import {
  setDialQueue,
  setDialQueueIndex,
  setIsDialerOpen,
} from "../../store/dialer/slice";
import { dialStateInstance } from "../dialer/DialState.class";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

type TLeadsHeaderProps = {
  onCsvUpload: () => void;
  onManualInput: () => void;
};

function LeadsHeader({ onCsvUpload, onManualInput }: TLeadsHeaderProps) {
  const dispatch = useAppDispatch();
  const { selectedRows } = useAppSelector((state) => state.leads);

  const startDialSession = () => {
    // Reset index
    dialStateInstance.dialQueueIndex = null;

    if (!dialStateInstance.gridRef) {
      notifications.show({
        message: "gridRef not found. Please try again later.",
      });
      return;
    }

    // Load up leads into queue from selected items
    // const selectedLeads = gridRef.current?.api.getSelectedRows();
    const selectedLeads =
      dialStateInstance.gridRef.current?.api.getSelectedRows();

    dispatch(setDialQueue(selectedLeads));

    // Open dialer
    dispatch(setIsDialerOpen(true));

    // Set index to 0
    dialStateInstance.dialQueueIndex = 0;
    dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));

    amplitude.track("Start dial session");

    // Clear selection on Leads page
    dialStateInstance.gridRef.current?.api.deselectAll();
  };

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
        variant="subtle"
        onClick={onCsvUpload}
        leftIcon={<IconUpload size={16} />}
      >
        Import leads
      </Button>

      <HoverCard
        width={280}
        shadow="md"
        openDelay={selectedRows.length === 0 ? 0 : 500}
      >
        <HoverCard.Target>
          {selectedRows.length !== 0 ? (
            <Button
              mx={8}
              leftIcon={<PiPhone size={16} />}
              onClick={startDialSession}
              variant="gradient"
              style={{ pointerEvents: "all" }}
            >
              New dial session
            </Button>
          ) : (
            <Button
              mx={8}
              leftIcon={<PiPhone size={16} />}
              variant="light"
              className="disabled-button start-dial-session-disabled-button"
            >
              New dial session
            </Button>
          )}
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">
            {selectedRows.length !== 0
              ? 'Clicking "Start dial session" will load the selected leads into your dialer queue to begin dialing.'
              : "Select at least one lead from the table to begin the dial session."}
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </Flex>
  );
}

export default LeadsHeader;
