import { FaPhone } from "react-icons/fa";
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
  setActiveContactIndex,
  setContactQueue,
  setIsCalling,
  setOptions,
  setShowOptions,
} from "../../store/dialer/slice";
import ContactQueueStyled from "./ContactQueue.styles";
import { useGetLeadsQuery } from "../../services/lead";

function ContactQueue() {
  const dispatch = useAppDispatch();

  const {
    contactQueue,
    activeContactIndex,
    call,
    isCalling,
    currentDialAttempts,
    options,
  } = useAppSelector((state) => state.dialer);

  const { data: leads } = useGetLeadsQuery();

  function startCall(index: number) {
    dispatch(setActiveContactIndex(index));
    dispatch(setIsCalling(true));
  }

  function endCall() {
    dispatch(setIsCalling(false));
  }

  const rows = contactQueue.length ? (
    contactQueue.map((c, index) => {
      let active = false;

      if (
        activeContactIndex !== null &&
        contactQueue[activeContactIndex].id === c.id &&
        isCalling
      ) {
        active = true;
      }

      return (
        <tr key={c.id} className={active ? "active" : ""}>
          <td className="call-icon hoverable">
            {isCalling && active ? (
              <Box ta="center">
                <FaRegStopCircle
                  fontSize="1rem"
                  onClick={endCall}
                  color="red"
                />
                <Text size="xs">{currentDialAttempts}</Text>
              </Box>
            ) : (
              <Box ta="center">
                <FaPhone
                  fontSize="1rem"
                  onClick={() => startCall(index)}
                  color={active ? "green" : ""}
                />
                <Text size="xs">{"???"}</Text>
              </Box>
            )}
          </td>
          <td>
            <Group spacing="sm">
              <Avatar className="user-avatar" size={30} radius={30} />
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
    dispatch(setIsCalling(false));
  }

  function importLeadsIntoQueue() {
    dispatch(setContactQueue(leads));
  }

  function clearLeadsFromQueue() {
    dispatch(setContactQueue([]));
  }

  return (
    <ContactQueueStyled>
      <Flex justify="space-between" align="center">
        <Title order={2} mb={16}>
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
            {isCalling ? (
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
                        activeContactIndex === null ? 0 : activeContactIndex;
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
              <th style={{ width: 50 }} />
              <th>Contact</th>
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
