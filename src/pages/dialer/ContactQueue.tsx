import { AiFillPlayCircle } from "react-icons/ai";
import { FaRegStopCircle, FaUndo } from "react-icons/fa";
import {
  BiDownArrow,
  BiImport,
  BiShow,
  BiTrash,
  BiUpArrow,
} from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";
import {
  ActionIcon,
  Avatar,
  Box,
  Flex,
  Group,
  ScrollArea,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
//
import phoneFormatter from "../../utils/phone-formatter";
import {
  deleteLeadFromQueue,
  moveLeadDownInQueue,
  moveLeadUpInQueue,
  setCurrentDialIndex,
  setDialQueue,
  setIsDialing,
  setOptions,
  setShowOptions,
} from "../../store/dialer/slice";
import ContactQueueStyled from "./ContactQueue.styles";
import { useGetLeadsQuery } from "../../services/lead";
import CallButtonWithCount from "../../components/call-button-with-count";
import clsx from "clsx";

function ContactQueue() {
  const dispatch = useAppDispatch();

  const { dialQueue, currentDialIndex, call, isDialing, options } =
    useAppSelector((state) => state.dialer);

  const { data: leads } = useGetLeadsQuery();

  function startCall(index: number) {
    dispatch(setCurrentDialIndex(index));
    dispatch(setIsDialing(true));
  }

  function endCall() {
    dispatch(setIsDialing(false));
  }

  const rows = dialQueue.length ? (
    dialQueue.map((c, index) => {
      let active = false;
      let activeIndex = false;

      if (
        currentDialIndex !== null &&
        dialQueue[currentDialIndex].id === c.id
      ) {
        activeIndex = true;
      }

      if (activeIndex && isDialing) {
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
          <td className="call-icon hoverable">
            <CallButtonWithCount
              callCount={c.call_count}
              active={!(isDialing && active)}
              onInactiveClick={endCall}
              onActiveClick={() => startCall(index)}
            />
          </td>
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
          <td>
            <Flex align="center">
              <Box mr={8}>
                <ActionIcon onClick={() => dispatch(moveLeadUpInQueue(c.id))}>
                  <BiUpArrow />
                </ActionIcon>
                <ActionIcon>
                  <BiDownArrow
                    onClick={() => dispatch(moveLeadDownInQueue(c.id))}
                  />
                </ActionIcon>
              </Box>
              <ActionIcon>
                <BiTrash
                  color="red"
                  fontSize="1.2rem"
                  onClick={() => dispatch(deleteLeadFromQueue(c.id))}
                />
              </ActionIcon>
            </Flex>
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

  function stopDialer() {
    dispatch(setIsDialing(false));
  }

  function importLeadsIntoQueue() {
    dispatch(setDialQueue(leads));
  }

  function clearLeadsFromQueue() {
    dispatch(setDialQueue([]));
  }

  return (
    <ContactQueueStyled>
      <Flex justify="space-between" align="center">
        <Title order={3} mb={16}>
          Call queue
        </Title>

        <Flex className="call-buttons" align="center">
          {!options.showAlphaDialer && (
            <Tooltip label="Show status bar">
              <div>
                <BiShow
                  className="hoverable"
                  onClick={() =>
                    dispatch(setOptions({ ...options, showAlphaDialer: true }))
                  }
                />
              </div>
            </Tooltip>
          )}
          <Tooltip label="Clear leads from queue">
            <div>
              <FaUndo
                size="1.2rem"
                className="hoverable"
                onClick={clearLeadsFromQueue}
              />
            </div>
          </Tooltip>
          <Tooltip label="Import leads into queue">
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
          </Tooltip>
          <Box ml="xs">
            {isDialing ? (
              <Tooltip label="End call">
                <div>
                  <FaRegStopCircle
                    color="red"
                    className="hoverable"
                    onClick={stopDialer}
                  />
                </div>
              </Tooltip>
            ) : (
              <Tooltip label="Start call">
                <div>
                  <AiFillPlayCircle
                    color="green"
                    className="start-call-icon hoverable"
                    disabled={!!call}
                    onClick={() => {
                      // Start from 0 UNLESS there is a currently selected index
                      const index =
                        currentDialIndex === null ? 0 : currentDialIndex;
                      startCall(index);
                    }}
                  />
                </div>
              </Tooltip>
            )}
          </Box>
        </Flex>
      </Flex>

      <ScrollArea h={400}>
        <Table horizontalSpacing="xs" verticalSpacing="sm">
          <thead>
            <tr>
              <th style={{ width: 75 }} />
              <th>Full name</th>
              <th>Phone</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </ContactQueueStyled>
  );
}

export default ContactQueue;
