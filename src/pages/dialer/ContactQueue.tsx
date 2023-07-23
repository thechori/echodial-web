import { styled } from "styled-components";
//
import { TContact } from "../../store/contacts/types";

const ContactQueueStyled = styled.div`
  padding: 2rem;

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

function ContactQueue({ contacts }: { contacts: TContact[] }) {
  return (
    <ContactQueueStyled>
      <div className="title">Call Queue</div>
      <div className="list">
        {contacts.length ? (
          contacts.map((c) => (
            <div key={c.id} className="contact">
              <div className="phone">{c.phone}</div>
              <div className="name">
                {c.firstName} {c.lastName}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-message">
            <div>No contacts in the queue</div>
            <button>+ Add some</button>
          </div>
        )}
      </div>
    </ContactQueueStyled>
  );
}

export default ContactQueue;
