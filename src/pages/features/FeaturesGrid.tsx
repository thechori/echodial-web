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
import { APP_NAME } from "../../configs/labels";
import routes from "../../configs/routes";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
        <Col span={12} md={7}>
          <SimpleGrid
            cols={2}
            spacing={30}
            breakpoints={[{ maxWidth: "md", cols: 1 }]}
          >
            {items}
          </SimpleGrid>
        </Col>
        <Col span={12} md={5}>
          <Title className={classes.title} order={2}>
            We specialize in dialing.
          </Title>
          <Text c="dimmed" maw={600}>
            Other CRMs specialize in nothing, because they try to do too much.
            With {APP_NAME}, you can get more done by becoming a super-human
            multi tasker.
          </Text>

          <Button
            variant="gradient"
            gradient={{ deg: 133, from: "blue", to: "cyan" }}
            size="xl"
            radius="md"
            mt="xl"
            onClick={() => navigate(routes.signUp)}
          >
            Try for free
          </Button>
        </Col>
      </Grid>
    </div>
  );
}
