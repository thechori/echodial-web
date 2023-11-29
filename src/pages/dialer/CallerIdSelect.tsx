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
import routes from "../../configs/routes";
import { styled } from "styled-components";

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

      setCallerIdItems([
        ...items,
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
      navigate(routes.phoneNumbers);
      return;
    }

    dispatch(setFromNumber(value));
  }

  return (
    <SelectContainer $error={fromNumber === null}>
      <Select
        label={props.label}
        placeholder={isLoading ? "Loading..." : "My phone number *"}
        data={callerIdItems}
        value={fromNumber || ""}
        onChange={handleSelect}
        style={{ width: "200px" }}
        {...props}
      />
    </SelectContainer>
  );
}

export default CallerIdSelect;

const SelectContainer = styled.div<{ $error: boolean }>`
  background-color: ${(props) => (props.$error ? "red" : "")};
  padding: 1px;
  border-radius: 4px;
  margin-right: 8px;

  .mantine-InputWrapper-root .mantine-Select-root {
    padding-right: 0;
  }
`;
