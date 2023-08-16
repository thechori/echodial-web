import { TCall, useGetCallsQuery } from "../../services/call";
import CallHistoryStyled from "./CallHistory.styles";
import { extractErrorMessage } from "../../utils/error";
import phoneFormatter from "../../utils/phone-formatter";

// const CallHistory = () => {
//   const { data: calls, error, isLoading } = useGetCallsQuery();

//   return (
//     <CallHistoryStyled>
//       <Title order={2}>Call history</Title>

//       <Box p="md">
//         {isLoading ? (
//           <Text>Loading...</Text>
//         ) : error ? (
//           <Text>{extractErrorMessage(error)}</Text>
//         ) : calls && calls.length ? (
//           <List p="md">
//             {calls.map((c) => (
//               <List.Item key={c.id}>
//                 Lead #{c.lead_id} .. From: {phoneFormatter(c.from_number)} ..
//                 To: {phoneFormatter(c.to_number)} (
//                 {new Date(c.created_at).toDateString()})
//               </List.Item>
//             ))}
//           </List>
//         ) : (
//           <Text>No calls found</Text>
//         )}
//       </Box>
//     </CallHistoryStyled>
//   );
// };

// export default CallHistory;

import { useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Center,
  TextInput,
  rem,
  Text,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21),
  },
}));

interface TableSortProps {
  data: TCall[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();

  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;

  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: TCall[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => {
      if (!item || key === null || item[key] === null) return false;

      // item[key].toLowerCase().includes(query)
    })
  );
}

// function sortData(
//   data: TCall[],
//   payload: { sortBy: keyof TCall | null; reversed: boolean; search: string }
// ) {
//   const { sortBy } = payload;

//   if (!sortBy) {
//     return filterData(data, payload.search);
//   }

//   return filterData(
//     [...data].sort((a, b) => {
//       if (payload.reversed) {
//         // return b[sortBy].localeCompare(a[sortBy]);
//       }

//       return a[sortBy].localeCompare(b[sortBy]);
//     }),
//     payload.search
//   );
// }

export function CallHistory() {
  const { data } = useGetCallsQuery();
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof TCall | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof TCall) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    // setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    // setSortedData();
    // sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
  };

  // const rows = sortedData.map((row) => (
  //   <tr key={row.id}>
  //     <td>{row.lead_id}</td>
  //     <td>{row.from_number}</td>
  //     <td>{row.to_number}</td>
  //     <td>{row.status}</td>
  //     <td>{row.duration_ms}</td>
  //     <td>{new Date(row.created_at).toDateString()}</td>
  //   </tr>
  // ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size="0.9rem" stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        sx={{ tableLayout: "fixed" }}
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === "lead_id"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("lead_id")}
            >
              Lead ID
            </Th>
            <Th
              sorted={sortBy === "from_number"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("from_number")}
            >
              From
            </Th>
            <Th
              sorted={sortBy === "to_number"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("to_number")}
            >
              To
            </Th>
            <Th
              sorted={sortBy === "status"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("status")}
            >
              Status
            </Th>
            <Th
              sorted={sortBy === "duration_ms"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("duration_ms")}
            >
              Duration
            </Th>
            <Th
              sorted={sortBy === "created_at"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("created_at")}
            >
              Date
            </Th>
          </tr>
        </thead>
        {/* <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody> */}
      </Table>
    </ScrollArea>
  );
}

export default CallHistory;
