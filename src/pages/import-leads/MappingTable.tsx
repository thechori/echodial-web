import {
  Title,
  Text,
  Table,
  Select,
  Flex,
  CheckIcon,
  ThemeIcon,
  Container,
} from "@mantine/core";
function MappingTable() {
  return (
    <>
      <Container py="md">
        <Flex justify="center" py="xs">
          <Title order={2}>
            Map columns in your file to contact properties
          </Title>
        </Flex>
        <Flex justify="center">
          <Text c="dimmed">
            Each column header below should be mapped to a contact property{" "}
          </Text>
        </Flex>
      </Container>

      <Table
        highlightOnHover
        horizontalSpacing="lg"
        verticalSpacing="md"
        withBorder
        py="md"
      >
        <thead>
          <tr>
            <th>Column Header</th>
            <th>Preview Information</th>
            <th>Mapped</th>
            <th>Property</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>Hans Zhang</td>
            <td>
              <ThemeIcon radius="lg" color="green">
                <CheckIcon style={{ width: "70%", height: "70%" }} />
              </ThemeIcon>
            </td>
            <td>
              <Flex justify="flex-start">
                <Select placeholder="Select" data={["Select"]} />
              </Flex>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default MappingTable;
