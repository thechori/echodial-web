import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectItem } from "@mantine/core";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setFromNumber,
  setShowNewCallerIdModal,
} from "../../store/dialer/slice";
import { useGetCallerIdsQuery } from "../../services/caller-id";
import phoneFormatter from "../../utils/phone-formatter";
import numbers from "../../configs/numbers";
import { APP_NAME } from "../../configs/labels";
import routes from "../../configs/routes";

type TCallerIdSelectProps = {
  label?: string;
};

function CallerIdSelect(props: TCallerIdSelectProps & any) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [callerIdItems, setCallerIdItems] = useState<SelectItem[]>([]);
  const { fromNumber } = useAppSelector((state) => state.dialer);
  const { data: callerIds, isLoading } = useGetCallerIdsQuery();

  const addNewCallerIdSelectItem: SelectItem = {
    value: "-1",
    group: "Options",
    label: "+ Add new number",
  };

  const manageCallerIdSelectItem: SelectItem = {
    value: "-2",
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
      dispatch(setShowNewCallerIdModal(true));
      return;
    } else if (value === manageCallerIdSelectItem.value) {
      navigate(routes.myNumbers);
      return;
    }

    dispatch(setFromNumber(value));
  }

  return (
    <Select
      label={props.label}
      placeholder={isLoading ? "Loading..." : "My phone number *"}
      data={callerIdItems}
      value={fromNumber || ""}
      onChange={handleSelect}
      style={{ width: "200px" }}
      {...props}
    />
  );
}

export default CallerIdSelect;
