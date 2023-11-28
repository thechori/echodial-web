import { Button } from "@mantine/core";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setSelectedLead } from "../../store/lead-detail/slice";

export const TableActionCell = (props: any) => {
  const dispatch = useAppDispatch();
  const { selectedLead } = useAppSelector((state) => state.leadDetail);

  const handleClick = () => {
    // const custom_properties = props.data.custom_properties;
    // const keysToRemove = Object.keys(custom_properties);
    // const result = Object.keys(props.data)
    //   .filter((key) => !keysToRemove.includes(key))
    //   .reduce((acc: any, key) => {
    //     acc[key] = props.data[key];
    //     return acc;
    //   }, {});
    // dispatch(setSelectedLead(result));
    dispatch(setSelectedLead(props.data));
  };

  const active = selectedLead && selectedLead.id === props.data.id;

  return (
    <span>
      {active ? (
        <Button variant="filled" size="xs" compact onClick={handleClick}>
          Active
        </Button>
      ) : (
        <Button
          className="hover-button"
          variant="outline"
          size="xs"
          compact
          onClick={handleClick}
        >
          Details
        </Button>
      )}
    </span>
  );
};
