import { useEffect, useState } from "react";
import { Select, SelectItem } from "@mantine/core";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAlphaDialerVisible, setFromNumber } from "../../store/dialer/slice";
import { useGetCallerIdsQuery } from "../../services/caller-id";
import phoneFormatter from "../../utils/phone-formatter";
import numbers from "../../configs/numbers";
import { useNavigate } from "react-router-dom";
import routes from "../../configs/routes";
import { APP_NAME } from "../../configs/constants";

function CallerIdSelect(props: any) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [callerIdItems, setCallerIdItems] = useState<SelectItem[]>([]);
  const { fromNumber } = useAppSelector((state) => state.dialer);
  const { data: callerIds } = useGetCallerIdsQuery();

  const addNewCallerIdSelectItem: SelectItem = {
    value: "-1",
    group: "Options",
    label: "+ Add new number",
  };

  const manageCallerIdSelectItem: SelectItem = {
    value: "-1",
    group: "Options",
    label: "Manage numbers",
  };

  useEffect(() => {
    if (callerIds) {
      const items: SelectItem[] = callerIds.map((cid) => ({
        group: `My numbers`,
        value: cid.phone_number,
        label: phoneFormatter(cid.phone_number) || "",
      }));

      const appCallerIds: SelectItem[] = numbers.map((n) => ({
        group: `${APP_NAME} numbers`,
        value: n.value,
        label: n.label,
      }));
      setCallerIdItems([
        ...items,
        ...appCallerIds,
        addNewCallerIdSelectItem,
        manageCallerIdSelectItem,
      ]);
    }
  }, [callerIds]);

  function handleSelect(value: string) {
    // Check for "Add new number" item click
    if (value === addNewCallerIdSelectItem.value) {
      dispatch(setAlphaDialerVisible(false));
      navigate(routes.callerIds);
      return;
    }

    dispatch(setFromNumber(value));
  }

  return (
    <Select
      label="My number"
      placeholder="Pick one"
      data={callerIdItems}
      value={fromNumber}
      onChange={handleSelect}
      {...props}
    />
  );
}

export default CallerIdSelect;
