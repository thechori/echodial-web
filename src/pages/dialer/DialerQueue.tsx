import { BiShow } from "react-icons/bi";
import {
  Card,
  Flex,
  Group,
  ScrollArea,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconPhone } from "@tabler/icons-react";
import clsx from "clsx";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import phoneFormatter from "../../utils/phone-formatter";
import {
  setDialQueueIndex,
  setOptions,
  setRequestAction,
} from "../../store/dialer/slice";
import DialerQueueStyled from "./DialerQueue.styles";
import CallButtonWithCount from "../../components/call-button-with-count";

function DialerQueue() {
  const dispatch = useAppDispatch();

  const { dialQueueIndex, call, options, alphaDialerVisible, dialQueue } =
    useAppSelector((state) => state.dialer);

  function startCall(index: number) {
    dispatch(setDialQueueIndex(index));
    dispatch(setRequestAction("startCall"));
  }

  function stopCall() {
    dispatch(setRequestAction("stopCall"));
  }

  const rows = dialQueue?.length ? (
    dialQueue.map((c, index) => {
      let active = false;
      let activeIndex = false;

      if (dialQueueIndex !== null && dialQueue[dialQueueIndex].id === c.id) {
        activeIndex = true;
      }

      if (activeIndex && call) {
        active = true;
      }

      return (
        <tr
          key={c.id}
          className={clsx({
            ["active"]: active,
            ["active-index"]: activeIndex,
          })}
        >
          <td>{index + 1}</td>
          <td>
            <Group spacing="sm">
              <Text fz="sm" fw={500}>
                {c.first_name} {c.last_name}
              </Text>
            </Group>
          </td>
          <td>
            <Text size="sm">{phoneFormatter(c.phone)}</Text>
          </td>
          <td className="call-icon hoverable">
            <CallButtonWithCount
              callCount={c.call_count}
              active={!(call && active)}
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

  // function importLeadsIntoQueue() {
  //   dispatch(setDialQueue(leads));
  // }

  // function clearLeadsFromQueue() {
  //   dispatch(setDialQueue([]));
  // }

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
            {/* <Tooltip label="Clear leads from queue">
            <div>
              <FaUndo
                size="1.2rem"
                className="hoverable"
                onClick={clearLeadsFromQueue}
              />
            </div>
          </Tooltip> */}
            {/* <Tooltip label="Import leads into queue">
            <div>
              <BiImport className="hoverable" onClick={importLeadsIntoQueue} />
            </div>
          </Tooltip>
          <Tooltip label="Call options">
            <div>
              <IoIosSettings
                className="hoverable"
                onClick={() => dispatch(setShowOptions(true))}
              />
            </div>
          </Tooltip> */}

            {/* <Box ml="xs">
            {call ? (
              <Tooltip label="End call">
                <div>
                  <FaRegStopCircle
                    color="red"
                    className="hoverable"
                    onClick={stopCall}
                  />
                </div>
              </Tooltip>
            ) : (
              <Tooltip label="Start dialer">
                <div>
                  <PiPhone
                    color="green"
                    className="start-call-icon hoverable"
                    disabled={!!call}
                    onClick={() => {
                      // Start from 0 UNLESS there is a currently selected index
                      const index =
                        dialQueueIndex === null ? 0 : dialQueueIndex;
                      startCall(index);
                    }}
                  />
                </div>
              </Tooltip>
            )}
          </Box> */}
          </Flex>
        </Flex>

        <ScrollArea h={400}>
          <Table horizontalSpacing="xs" verticalSpacing="sm">
            <thead>
              <tr>
                <th style={{ width: 75 }}>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>
                  <IconPhone />
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
