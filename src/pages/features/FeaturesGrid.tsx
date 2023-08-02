import {
  createStyles,
  Title,
  SimpleGrid,
  Text,
  Button,
  ThemeIcon,
  Grid,
  Col,
  rem,
} from "@mantine/core";
import features from "./features.data";

const useStyles = createStyles((theme) => ({
  wrapper: {
    padding: `calc(${theme.spacing.xl} * 2) ${theme.spacing.xl}`,
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(36),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: theme.spacing.md,
    color: theme.black,
  },
}));

export function FeaturesGrid() {
  const { classes } = useStyles();

  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ deg: 133, from: "blue", to: "cyan" }}
      >
        <feature.icon size={rem(26)} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <div className={classes.wrapper}>
      <Grid gutter={80}>
        <Col span={12} md={5}>
          <Title className={classes.title} order={2}>
            A fully featured React components library for your next project
          </Title>
          <Text c="dimmed">
            Build fully functional accessible web applications faster than ever
            – Mantine includes more than 120 customizable components and hooks
            to cover you in any situation
          </Text>

          <Button
            variant="gradient"
            gradient={{ deg: 133, from: "blue", to: "cyan" }}
            size="xl"
            radius="md"
            mt="xl"
          >
            Try for free
          </Button>
        </Col>
        <Col span={12} md={7}>
          <SimpleGrid
            cols={2}
            spacing={30}
            breakpoints={[{ maxWidth: "md", cols: 1 }]}
          >
            {items}
          </SimpleGrid>
        </Col>
      </Grid>
    </div>
  );
}
