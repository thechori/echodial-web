import { Grid, Card, Title, Table, Pagination, Center } from "@mantine/core";
import { useState } from "react";
import { useAppSelector } from "../../store/hooks";

function BillingHistory() {
  const [activePage, setPage] = useState(1);
  const billingData = useAppSelector((state) => state.billing.billingData);

  function fillData() {
    let renderedData = [];
    for (let i = 0; i < billingData.length; i++) {
      renderedData.push(
        billingData[i].map((item) => (
          <tr>
            <th>{item.date}</th>
            <th>{item.description}</th>
            <th>{item.amount}</th>
            <th>{item.pdf}</th>
          </tr>
        ))
      );
    }
    return renderedData;
  }

  const billingHistoryData = fillData();
  const currentPage = billingHistoryData[activePage - 1];

  return (
    <Grid py="sm">
      <Grid.Col>
        <Card withBorder py="md">
          <Title order={3}>Billing History</Title>
          <Center py="md">
            <Table horizontalSpacing="lg" highlightOnHover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{currentPage}</tbody>
            </Table>
          </Center>

          <Center py="md">
            <Pagination
              value={activePage}
              onChange={setPage}
              total={billingHistoryData.length}
            />
          </Center>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
export default BillingHistory;
