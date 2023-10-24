import { Box } from "@mantine/core";
//
import LeadsStyled, { LeadDetailContainer } from "./Leads.styles";
import LeadsFilter from "./LeadsFilter";
import LeadsFilteredList from "./LeadsFilteredList";
import { LeadDetail } from "./LeadDetail";
import { useAppSelector } from "../../store/hooks";

function Leads() {
  const { selectedLead } = useAppSelector((state) => state.leadDetail);

  return (
    <LeadsStyled>
      <Box id="lead-content">
        <LeadsFilter />
        <LeadsFilteredList />
      </Box>

      <LeadDetailContainer $open={!!selectedLead}>
        <LeadDetail />
      </LeadDetailContainer>
    </LeadsStyled>
  );
}

export default Leads;
