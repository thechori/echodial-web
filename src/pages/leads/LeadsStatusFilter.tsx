import { Flex, Select, TextInput } from "@mantine/core";
import { useState } from "react";

const LeadsStatusFilter = () => {
  const [status, setStatus] = useState<string | null>("Fresh");
  const [keyword, setKeyword] = useState("");

  return (
    <Flex>
      <Select
        w="50%"
        label="Status"
        data={["Fresh", "Missed call", "Appointment", "Closed"]}
        onChange={(status) => setStatus(status)}
        value={status}
      />
      <TextInput
        w="50%"
        label="Search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
    </Flex>
  );
};

export default LeadsStatusFilter;
