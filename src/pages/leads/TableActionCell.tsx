import { useAppDispatch } from "../../store/hooks";
import { setSelectedLead } from "../../store/lead-detail/slice";

export const TableActionCell = (props: any) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setSelectedLead(props.data));
  };

  return (
    <span className="total-value-renderer">
      <button onClick={handleClick}>View/Edit</button>
    </span>
  );
};
