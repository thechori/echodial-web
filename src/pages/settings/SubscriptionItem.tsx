import { styled } from "styled-components";
import { Box, List, Text, ThemeIcon, Title } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
//
import { TSubscription } from "./settings-data";

const Container = styled.div<{ selected: boolean }>`
  border: ${(props) => (props.selected ? "2px solid green" : "none")};
  padding: 1rem;
  border-radius: 4px;
`;

export type TSubscriptionItemProps = {
  selected: boolean;
  onSelect: () => void;
  data: TSubscription;
};

const SubscriptionItem = ({
  selected,
  onSelect,
  data,
}: TSubscriptionItemProps) => {
  const { title, price, subtitle, features } = data;
  return (
    <Container onClick={onSelect} selected={selected}>
      <Box>
        <Title order={3}>{title}</Title>
      </Box>

      <Box p="md">
        <Title order={1}>${price}</Title>
      </Box>

      <Box p="md">
        <Text>{subtitle}</Text>
      </Box>

      <Box p="md">
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <IconCircleCheck size="1rem" />
            </ThemeIcon>
          }
        >
          {features.map((f) => (
            <List.Item key={f}>{f}</List.Item>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default SubscriptionItem;
