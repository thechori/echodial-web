import { Box, Card, ThemeIcon, Title, Tooltip } from "@mantine/core";
import { MdPerson } from "react-icons/md";
//
import { LeadDetailStyled } from "./LeadDetail.styles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setIsOpen } from "../../store/lead-detail/slice";

export const LeadDetail = () => {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.leadDetail);

  const handleToggleOpen = () => {
    dispatch(setIsOpen(!isOpen));
  };

  return (
    <LeadDetailStyled open={isOpen}>
      <Card id="lead-detail" withBorder>
        <Title>Lead details</Title>
      </Card>

      <Box id="lead-detail-fab">
        <Tooltip label={isOpen ? "Close lead detail" : "Open lead detail"}>
          <ThemeIcon size="xl" onClick={handleToggleOpen}>
            <MdPerson />
          </ThemeIcon>
        </Tooltip>
      </Box>
    </LeadDetailStyled>
  );
};
