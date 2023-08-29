import { useEffect, useState } from "react";
import {
  Container,
  Select,
  Title,
  Flex,
  Grid,
  Card,
  SelectItem,
} from "@mantine/core";
//
import DialerStyled from "./Dialer.styles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setFromNumber } from "../../store/dialer/slice";
import ContactQueue from "./ContactQueue";
import { useGetCallerIdsQuery } from "../../services/caller-id";
import phoneFormatter from "../../utils/phone-formatter";
import numbers from "../../configs/numbers";

function Dialer() {
  const dispatch = useAppDispatch();
  //
  const [callerIdItems, setCallerIdItems] = useState<SelectItem[]>([]);
  //
  const { token, fromNumber } = useAppSelector((state) => state.dialer);
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
    <DialerStyled>
      <Container fluid py="md">
        <Flex justify={"space-between"} align={"center"} mb="md">
          <Title order={2}>Dialer</Title>
          <Flex align="center">
            <Flex align="flex-end">
              <Select
                px="xs"
                label="Your number"
                placeholder="Pick one"
                data={callerIdItems}
                value={fromNumber}
                onChange={(number) => dispatch(setFromNumber(number))}
              />
            </Flex>
          </Flex>
        </Flex>

        <Grid>
          <Grid.Col xs={12} sm={12} md={12}>
            <Card className={!token ? "disabled" : ""} withBorder shadow="md">
              <ContactQueue />
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </DialerStyled>
  );
}

export default Dialer;
