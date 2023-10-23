import { Box } from "@mantine/core";
//
import LeadsStyled from "./Leads.styles";
import LeadsFilter from "./LeadsFilter";
import LeadsFilteredList from "./LeadsFilteredList";
import { LeadDetail } from "./LeadDetail";

function Leads() {
  return (
    <LeadsStyled>
      <Box id="lead-content">
        <LeadsFilter />
        <LeadsFilteredList />
      </Box>

      <LeadDetail />
    </LeadsStyled>
  );
}

export default Leads;
