import { Container } from "@mantine/core";
//
import LeadsStyled from "./Leads.styles";
import LeadsFilter from "./LeadsFilter";
import LeadsFilteredList from "./LeadsFilteredList";

function Leads() {
  return (
    <LeadsStyled>
      <Container fluid size="xl">
        <LeadsFilter />
        <LeadsFilteredList />
      </Container>
    </LeadsStyled>
  );
}

export default Leads;
