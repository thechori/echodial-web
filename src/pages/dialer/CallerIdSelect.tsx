import { useEffect, useState } from "react";
import { Select, SelectItem } from "@mantine/core";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setFromNumber } from "../../store/dialer/slice";
import { useGetCallerIdsQuery } from "../../services/caller-id";
import phoneFormatter from "../../utils/phone-formatter";
import numbers from "../../configs/numbers";

function CallerIdSelect() {
  const dispatch = useAppDispatch();
  //
  const [callerIdItems, setCallerIdItems] = useState<SelectItem[]>([]);
  //
  const { fromNumber } = useAppSelector((state) => state.dialer);
  //
  const { data: callerIds } = useGetCallerIdsQuery();

  useEffect(() => {
    if (callerIds) {
      const items: SelectItem[] = callerIds.map((cid) => ({
        value: cid.phone_number,
        label: phoneFormatter(cid.phone_number) || "",
      }));
      setCallerIdItems([...items, ...numbers]);
    }
  }, [callerIds]);

  return (
    <Select
      px="xs"
      label="Your number"
      placeholder="Pick one"
      data={callerIdItems}
      value={fromNumber}
      onChange={(number) => dispatch(setFromNumber(number))}
    />
  );
}

export default CallerIdSelect;
