import { styled } from "styled-components";
import { FaPhone } from "react-icons/fa";
import { AiFillPlayCircle } from "react-icons/ai";
import { FaRegStopCircle } from "react-icons/fa";
import { BiImport, BiShow } from "react-icons/bi";
import { IoIosSettings } from "react-icons/io";
//
import {
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
import phoneFormatter from "../../utils/phone-formatter";
import {
  setActiveContactIndex,
  setCall,
  setError,
  setOptions,
  setShowOptions,
} from "../../store/dialer/slice";
import devices from "../../styles/devices";

const ContactQueueStyled = styled.div`
  .contact {
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    padding: 0.25rem;

    .phone {
      margin-right: 1rem;
    }
  }

  tr.active {
    border: 2px solid green;
    background-color: #00800030;
  }

  .call-icon {
    &:hover {
      color: green;
    }
  }

  .user-avatar {
    display: none;

    @media ${devices.desktop} {
      display: block;
    }
  }

  .call-buttons {
    svg {
      font-size: 1.75rem;

      @media ${devices.tablet} {
        font-size: 2rem;
      }
    }

    & > div {
      padding: 0 0.25rem;

      @media ${devices.tablet} {
        padding: 0 0.5rem;
      }
    }
  }

  .start-call-icon svg {
    font-size: 2rem;

    @media ${devices.tablet} {
      font-size: 3rem;
    }
  }
`;

function ContactQueue() {
  const dispatch = useAppDispatch();
  const { contactQueue, activeContactIndex, call, options } = useAppSelector(
    (state) => state.dialer
  );

  function updateActiveContactIndex(index: number) {
    dispatch(setActiveContactIndex(index));
  }

  function endCall() {
    dispatch(setActiveContactIndex(null));
  }

  const rows = contactQueue.map((c, index) => {
    let active = false;

    if (
      activeContactIndex !== null &&
      contactQueue[activeContactIndex].id === c.id
    ) {
      active = true;
    }

    return (
      <tr key={c.id} className={active ? "active" : ""}>
        <td className="call-icon hoverable">
          {call && active ? (
            <FaRegStopCircle
              fontSize="1rem"
              onClick={() => endCall()}
              color="red"
            />
          ) : (
            <FaPhone
              fontSize="1rem"
              onClick={() => updateActiveContactIndex(index)}
              color={active ? "green" : ""}
            />
          )}
        </td>
        <td>
          <Group spacing="sm">
            <Avatar className="user-avatar" size={30} radius={30} />
            <Text fz="sm" fw={500}>
              {c.firstName} {c.lastName}
            </Text>
          </Group>
        </td>
        <td>
          <Text size="sm">{phoneFormatter(c.phone)}</Text>
        </td>
      </tr>
    );
  });

  function stopDialer() {
    if (!call) {
      return dispatch(setError("No call in progress"));
    }

    call.disconnect();
    dispatch(setCall(null));
    dispatch(setActiveContactIndex(null));
  }

  return (
    <ContactQueueStyled>
      <Flex justify="space-between" align="center">
        <Title order={2} mb={16}>
          Call Queue
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
          <Tooltip label="Import leads into queue">
            <div>
              <BiImport className="hoverable" />
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
            {call ? (
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
                      dispatch(setActiveContactIndex(index));
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
