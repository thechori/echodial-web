import { styled } from "styled-components";
//
import { Avatar, Group, ScrollArea, Table, Text, Title } from "@mantine/core";
import { useAppSelector } from "../../store/hooks";

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
`;

function ContactQueue() {
  const { contactQueue, activeContact } = useAppSelector(
    (state) => state.dialer
  );

  const rows = contactQueue.map((c) => (
    <tr key={c.id} className={activeContact?.id === c.id ? "active" : ""}>
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
    <ContactQueueStyled>
      <Title order={2} mb={16}>
        Call Queue
      </Title>

      <ScrollArea h={400}>
        <Table verticalSpacing="sm">
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
    </ContactQueueStyled>
  );
}

export default ContactQueue;
