import { Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setSelectedLead } from "../../store/lead-detail/slice";

export const TableActionCell = (props: any) => {
  const dispatch = useAppDispatch();
  const { selectedLead } = useAppSelector((state) => state.leadDetail);

  const handleClick = () => {
    dispatch(setSelectedLead(props.data));
  };

  const active = selectedLead && selectedLead.id === props.data.id;

  return (
    <span className="total-value-renderer">
      {active ? (
        <Button variant="filled" size="xs" compact onClick={handleClick}>
          Active
        </Button>
      ) : (
        <Button variant="outline" size="xs" compact onClick={handleClick}>
          Details
        </Button>
      )}
    </span>
  );
};
