import { Card, Flex, ThemeIcon, Title } from "@mantine/core";
import { IconUserSearch } from "@tabler/icons-react";

//

function LeadsFilteredList() {
  return (
    <Card withBorder>
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <ThemeIcon radius="xl" size="xl" mr="xs">
            <IconUserSearch style={{ width: "70%", height: "70%" }} />
          </ThemeIcon>
          <Title order={2}>Results</Title>
        </Flex>

        <Flex align="center"></Flex>
      </Flex>
    </Card>
  );
}

export default LeadsFilteredList;
