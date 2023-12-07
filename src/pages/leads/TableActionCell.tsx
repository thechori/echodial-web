import { useAppDispatch, useAppSelector } from "../../store/hooks";
import CallButtonSimple from "../../components/call-buttons/CallButtonSimple";
import { setActiveLead, setRequestAction } from "../../store/dialer/slice";
import { dialStateInstance } from "../dialer/DialState.class";

export const TableActionCell = (props: any) => {
  const dispatch = useAppDispatch();
  const { call, activeLead } = useAppSelector((state) => state.dialer);

  const startCall = () => {
    dialStateInstance.activeLead = props.data;
    dispatch(setActiveLead(dialStateInstance.activeLead));
    dispatch(setRequestAction("startCall"));
  };

  const endCall = () => {
    dispatch(setRequestAction("stopCall"));
  };

  const active = !!call && activeLead?.id === props.data.id;

  return (
    <span>
      <CallButtonSimple
        active={active}
        onInactiveClick={startCall}
        onActiveClick={endCall}
      />
    </span>
  );
};
