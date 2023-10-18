import { Box, Drawer, Title } from "@mantine/core";
import LeadsAdvancedFilterDrawerStyled from "./LeadsFilterDrawer.styles";
import { useAppSelector } from "../../store/hooks";

const LeadsFilterDrawer = ({ opened, onClose }: any) => {
  const { filters } = useAppSelector((state) => state.leads);
  return (
    <LeadsAdvancedFilterDrawerStyled>
      <Drawer opened={opened} onClose={onClose}>
        <Title>Filters</Title>
        <Box>
          {filters.map((filter) => (
            <Box key={filter.label}>
              {filter.label} - {filter.value}
            </Box>
          ))}
        </Box>
      </Drawer>
    </LeadsAdvancedFilterDrawerStyled>
  );
};

export default LeadsFilterDrawer;
