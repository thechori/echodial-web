import { Grid, Card, Title, Table, Pagination, Center } from "@mantine/core";
import { useState } from "react";
function BillingHistory() {
  const [activePage, setPage] = useState(1);

  function fillData() {
    const billingData = [];
    let newPage = [];
    for (let i = 0; i < 45; i++) {
      newPage.push({
        date: "September 28, 2023",
        description: "Payment (Visa)",
        amount: i,
        pdf: "Download: PDF",
      });
      if (newPage.length === 10) {
        billingData.push(
          newPage.map((item) => (
            <tr>
              <th>{item.date}</th>
              <th>{item.description}</th>
              <th>{item.amount}</th>
              <th>{item.pdf}</th>
            </tr>
          ))
        );
        newPage = [];
      }
    }
    if (newPage.length > 0) {
      billingData.push(
        newPage.map((item) => (
          <tr>
            <th>{item.date}</th>
            <th>{item.description}</th>
            <th>{item.amount}</th>
            <th>{item.pdf}</th>
          </tr>
        ))
      );
    }
    return billingData;
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
