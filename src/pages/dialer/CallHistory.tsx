import { useEffect, useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Center,
  rem,
  Text,
  Box,
  Flex,
  Title,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { format } from "date-fns";
//
import { useGetCallsQuery } from "../../services/call";
import phoneFormatter from "../../utils/phone-formatter";
import { Call } from "../../types";

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

function sortData(
  data: Call[],
  payload: { sortBy: keyof Call | null; reversed: boolean }
) {
  const { sortBy } = payload;

  return [...data].sort((a, b) => {
    if (payload.reversed) {
      // @ts-ignore
      return b[sortBy].localeCompare(a[sortBy]);
    }

    // @ts-ignore
    return a[sortBy].localeCompare(b[sortBy]);
  });
}

export function CallHistory() {
  const { data: calls } = useGetCallsQuery();
  const [sortedData, setSortedData] = useState(calls || []);
  const [sortBy, setSortBy] = useState<keyof Call | null>("created_at");
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof Call) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(calls || [], { sortBy: field, reversed }));
  };

  useEffect(() => {
    if (calls) {
      setSortedData(
        sortData(calls || [], { sortBy, reversed: !reverseSortDirection })
      );
    }
  }, [calls]);

  const rows = sortedData.map((row) => (
    <tr key={row.id}>
      <td>{format(new Date(row.created_at), "Pp")}</td>
      <td>{phoneFormatter(row.from_number)}</td>
      <td>{phoneFormatter(row.to_number)}</td>
      <td>{row.status}</td>
      <td>{row.duration_ms}</td>
    </tr>
  ));

  return (
    <Box>
      <Flex justify="space-between" align="center">
        <Title order={2} mb={16}>
          Call history
        </Title>
      </Flex>

      <ScrollArea h={400}>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          sx={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr>
              <Th
                sorted={sortBy === "created_at"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("created_at")}
              >
                Date
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
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <tr>
                <td colSpan={Object.keys(calls ? calls[0] : {}).length}>
                  <Text weight={500} align="center">
                    Nothing found
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </Box>
  );
}

export default CallHistory;
