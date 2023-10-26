import { BiShow } from "react-icons/bi";
import { PiPhone, PiPhoneOutgoing } from "react-icons/pi";
import {
  Card,
  Chip,
  Flex,
  Group,
  ScrollArea,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import clsx from "clsx";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setDialQueueIndex,
  setOptions,
  setRequestAction,
} from "../../store/dialer/slice";
import DialerQueueStyled from "./DialerQueue.styles";
import CallButtonSimple from "../../components/call-buttons/CallButtonSimple";
import { dialStateInstance } from "./DialState.class";

function DialerQueue() {
  const dispatch = useAppDispatch();

  const { options, alphaDialerVisible, dialQueue } = useAppSelector(
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

  return (
    <DialerQueueStyled>
      <Card withBorder>
        <Flex justify="space-between" align="center">
          <Title order={3} mb={16}>
            Call queue
          </Title>

          <Flex className="call-buttons" align="center">
            {!alphaDialerVisible && (
              <Tooltip label="Show status bar">
                <div>
                  <BiShow
                    className="hoverable"
                    onClick={() =>
                      dispatch(
                        setOptions({ ...options, showAlphaDialer: true })
                      )
                    }
                  />
                </div>
              </Tooltip>
            )}
          </Flex>
        </Flex>

        <ScrollArea h={400}>
          <Table horizontalSpacing="xs" verticalSpacing="sm">
            <thead>
              <tr>
                <th style={{ width: 50 }}>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>
                  <PiPhone fontSize="1.5rem" />
                </th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Card>
    </DialerQueueStyled>
  );
}

export default DialerQueue;
