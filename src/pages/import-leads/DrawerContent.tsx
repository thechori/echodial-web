import { Text, Input, Button } from "@mantine/core";
function DrawerContent() {
  return (
    <>
      <Text>Create a new property</Text>

      <Input placeholder="Group" py="lg" />
      <Input placeholder="Label" py="lg" />

      <Input placeholder="Description" py="lg" />
      <Button
        variant="gradient"
        gradient={{ from: "blue", to: "cyan", deg: 90 }}
      >
        Submit
      </Button>
    </>
  );
}

export default DrawerContent;
