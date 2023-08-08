import { styled } from "styled-components";
import { FaPhone } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
//
import { Avatar, Group, ScrollArea, Table, Text, Title } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import phoneFormatter from "../../utils/phone-formatter";
import { setActiveContactIndex } from "../../store/dialer/slice";

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
`;

function ContactQueue() {
  const dispatch = useAppDispatch();
  const { contactQueue, activeContactIndex, call } = useAppSelector(
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
            <AiOutlineClose
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
            <Avatar size={30} radius={30} />
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

  return (
    <ContactQueueStyled>
      <Title order={2} mb={16}>
        Call Queue
      </Title>

      <ScrollArea h={400}>
        <Table horizontalSpacing="xs" verticalSpacing="sm">
          <thead>
            <tr>
              <th />
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
