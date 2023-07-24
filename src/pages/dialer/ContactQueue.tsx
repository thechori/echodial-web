import { styled } from "styled-components";
import { IconPencil, IconTrash } from "@tabler/icons-react";

//
import { TContact } from "../../store/contacts/types";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Card,
  Group,
  List,
  Paper,
  ScrollArea,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useAppSelector } from "../../store/hooks";

const ContactQueueStyled = styled.div`
  padding: 1rem;

  .title {
    font-size: 2rem;
  }

  .list {
  }

  .contact {
    border: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    padding: 0.25rem;

    .phone {
      margin-right: 1rem;
    }
  }
`;

function ContactQueue() {
  const contacts = useAppSelector((state) => state.dialer.contactQueue);

  const rows = contacts.map((c) => (
    <tr key={c.id}>
      <td>
        <Group spacing="sm">
          <Avatar size={30} radius={30} />
          <Text fz="sm" fw={500}>
            {c.firstName} {c.lastName}
          </Text>
        </Group>
      </td>
      <td>
        <Text size="sm">{c.phone}</Text>
      </td>
    </tr>
  ));

  return (
    <Card withBorder radius="md" p="md">
      <Title order={2}>Call Queue</Title>

      <ScrollArea h={400}>
        <Table sx={{ minWidth: 500 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>Contact</th>
              <th>Phone</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>

      {/* <List>
        {contacts.length ? (
          contacts.map((c) => (
            <List.Item key={c.id} className="contact">
              <div className="phone">{c.phone}</div>
              <div className="name">
                {c.firstName} {c.lastName}
              </div>
            </List.Item>
          ))
        ) : (
          <div className="empty-message">
            <div>No contacts in the queue</div>
            <button>+ Add some</button>
          </div>
        )}
      </List> */}
    </Card>
  );
}

export default ContactQueue;
