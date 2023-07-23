import { styled } from "styled-components";
//
import { TContact } from "../../store/contacts/types";
import { Card, List, Paper, Title } from "@mantine/core";
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

  return (
    <Paper shadow="xs" p="md">
      {/* <Card withBorder radius="md" p="md"> */}
      <Title order={2}>Contact Queue</Title>

      <List>
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
      </List>
    </Paper>
  );
}

export default ContactQueue;
