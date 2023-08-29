import { Box, TextInput } from "@mantine/core";

//
import LeadsTableStyled from "./LeadsTable.styles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setKeyword } from "../../store/leads/slice";
import { useGetLeadsQuery } from "../../services/lead";
import LeadItem from "./LeadItem";

function LeadsTable() {
  const dispatch = useAppDispatch();
  //
  const { keyword, selectedRows } = useAppSelector((state) => state.leads);
  //
  const { data: leads } = useGetLeadsQuery();

  const rows = leads?.map((l) => {
    const selected = !!selectedRows.find((lead) => lead.id);
    return (
      <LeadItem
        key={l.id}
        originalLead={l}
        selected={selected}
        onSelectionChange={() => console.log("hi")}
      />
    );
  });

  // Reset selection every time leads changes
  // useEffect(() => {
  //   dispatch(setSelectedRows([]));
  // }, [leads]);

  return (
    <LeadsTableStyled>
      <Box>
        <TextInput
          placeholder="Search for lead..."
          value={keyword}
          onChange={(keyword) => dispatch(setKeyword(keyword.target.value))}
        />
      </Box>
      <Box my="md" className="list">
        {rows}
      </Box>
    </LeadsTableStyled>
  );
}

export default LeadsTable;
