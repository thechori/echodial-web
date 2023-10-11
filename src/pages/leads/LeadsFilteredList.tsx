import { Box, Button, Card, Flex, Text, ThemeIcon, Title } from "@mantine/core";
import { IconUserSearch } from "@tabler/icons-react";
//
import { Lead } from "../../types";

function LeadsFilteredList() {
  const results: Lead[] = [];

  const renderLeads = results.length ? (
    results.map((l) => (
      <Flex key={l.id}>
        <Text>
          {l.first_name} {l.last_name}
        </Text>
      </Flex>
    ))
  ) : (
    <Text color="dimmed" ta="center">
      No results found
    </Text>
  );

  return (
    <Card withBorder>
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <ThemeIcon radius="xl" size="xl" mr="xs">
            <IconUserSearch style={{ width: "70%", height: "70%" }} />
          </ThemeIcon>
          <Title order={2}>Results</Title>
        </Flex>

        <Flex>
          <Button>Action 1</Button>
          <Button>Action 2</Button>
        </Flex>
      </Flex>
      <Box py="lg">{renderLeads}</Box>
    </Card>
  );
}

export default LeadsFilteredList;
