import {
  createStyles,
  Group,
  Paper,
  SimpleGrid,
  Text,
  rem,
} from "@mantine/core";
import {
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
  IconArrowRight,
  IconPhone,
  IconClock,
} from "@tabler/icons-react";
import { extractErrorMessage } from "../../utils/error";
import { TMetricResolution } from "../../services/metric";

const useStyles = createStyles((theme) => ({
  value: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color: theme.colors.yellow[6],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

const icons = {
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
  phone: IconPhone,
  clock: IconClock,
};

interface StatsGridProps {
  data: {
    title: string;
    icon: keyof typeof icons;
    value: string;
    diff: number;
  }[];
  error: unknown;
  metricResolution: TMetricResolution;
}

function StatsGrid({ data, error, metricResolution }: StatsGridProps) {
  const { classes } = useStyles();

  function generateText() {
    switch (metricResolution) {
      case "day": {
        return "Compared to yesterday";
      }
      case "week": {
        return "Compared to last week";
      }
      case "month": {
        return "Compared to last month";
      }
      default: {
        return "";
      }
    }
  }

  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon =
      stat.diff === 0
        ? IconArrowRight
        : stat.diff > 0
        ? IconArrowUpRight
        : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group position="apart" style={{ flexWrap: "nowrap" }}>
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size="1.4rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text
            color={stat.diff === 0 ? "teal" : stat.diff > 0 ? "teal" : "red"}
            fz="sm"
            fw={500}
            className={classes.diff}
          >
            <span>{stat.diff}%</span>
            <DiffIcon size="1rem" stroke={1.5} />
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          {generateText()}
        </Text>

        <Text fz="xs" c="red" mt={7}>
          {extractErrorMessage(error)}
        </Text>
      </Paper>
    );
  });
  return (
    <SimpleGrid
      cols={4}
      breakpoints={[
        { maxWidth: "md", cols: 2 },
        { maxWidth: "xs", cols: 1 },
      ]}
    >
      {stats}
    </SimpleGrid>
  );
}

export default StatsGrid;
