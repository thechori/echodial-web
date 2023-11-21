import { useEffect } from "react";
import { IconRefresh } from "@tabler/icons-react";
import { PiPhoneOutgoing, PiQueue } from "react-icons/pi";
import {
  Button,
  Card,
  Chip,
  Flex,
  Group,
  HoverCard,
  Overlay,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import clsx from "clsx";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setDialQueue,
  setDialQueueIndex,
  setIsDialerOpen,
  setRequestAction,
} from "../../store/dialer/slice";
import DialerQueueStyled from "./DialerQueue.styles";
import CallButtonSimple from "../../components/call-buttons/CallButtonSimple";
import { dialStateInstance } from "./DialState.class";

function DialerQueue() {
  const dispatch = useAppDispatch();

  const { subscriptionActive } = useAppSelector((state) => state.user);
  const { call, dialQueue, dialQueueIndex } = useAppSelector(
    (state) => state.dialer
  );

  function startCall(index: number) {
    dialStateInstance.dialQueueIndex = index;
    dispatch(setDialQueueIndex(dialStateInstance.dialQueueIndex));
    dispatch(setRequestAction("startCall"));
  }

  function stopCall() {
    dispatch(setRequestAction("stopCall"));
  }

  function resetDialer() {
    dialStateInstance.dialQueueIndex = null;
    dispatch(setDialQueue([]));

    dispatch(setIsDialerOpen(false));
  }

  const rows = dialQueue.length ? (
    dialQueue.map((lead, index) => {
      let active = false;
      let activeIndex = false;

      if (
        dialStateInstance.dialQueueIndex !== null &&
        dialQueue[dialStateInstance.dialQueueIndex].id === lead.id
      ) {
        activeIndex = true;
      }

      if (activeIndex && dialStateInstance.call) {
        active = true;
      }

      return (
        <tr
          id={`dialer-queue-lead-${lead.id}`}
          key={lead.id}
          className={clsx({
            ["active"]: active,
            ["active-index"]: activeIndex,
          })}
        >
          <td>{active ? <PiPhoneOutgoing fontSize="1.5em" /> : index + 1}</td>
          <td>
            <Group spacing="sm">
              <Text fz="sm" fw={500}>
                {lead.first_name} {lead.last_name}
              </Text>
            </Group>
          </td>
          <td>
            <Chip>Add status</Chip>
          </td>
          <td className="call-icon hoverable">
            <CallButtonSimple
              active={!(dialStateInstance.call && active)}
              onInactiveClick={stopCall}
              onActiveClick={() => startCall(index)}
            />
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td></td>
      <td>No calls queued</td>
      <td></td>
    </tr>
  );

  useEffect(() => {
    if (call && dialQueue.length && dialQueueIndex !== null) {
      const lead = dialQueue[dialQueueIndex];
      const item = document.getElementById(`dialer-queue-lead-${lead.id}`);
      if (item) {
        item.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [dialQueueIndex, call]);

  return (
    <DialerQueueStyled>
      <Card withBorder>
        <Flex justify="space-between" align="center" mb="md">
          <Flex justify="space-between" align="center">
            <ThemeIcon mr="xs">
              <PiQueue />
            </ThemeIcon>
            <Title order={3}>Call queue</Title>
          </Flex>

          <HoverCard width={280} shadow="md" openDelay={500}>
            <HoverCard.Target>
              <Button
                color="red"
                variant="outline"
                compact
                onClick={resetDialer}
                leftIcon={<IconRefresh size="1rem" />}
              >
                Clear
              </Button>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm">
                Clicking "Clear" will remove all leads from the Call queue. You
                can create a new queue by filtering your selection on the Leads
                page and clicking "Start dialer"
              </Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </Flex>

        <div className="fade" />
        <div className="scroll-area">
          {!subscriptionActive && <Overlay color="#fff" opacity={0.85} />}

          <Table horizontalSpacing="xs" verticalSpacing="sm">
            <thead>
              <tr>
                <th style={{ width: 50 }}>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      </Card>
    </DialerQueueStyled>
  );
}

export default DialerQueue;
