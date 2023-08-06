import { Group, Text, useMantineTheme, rem } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import {
  Dropzone as DropzoneMantine,
  DropzoneProps,
  MIME_TYPES,
} from "@mantine/dropzone";

function Dropzone(props: Partial<DropzoneProps>) {
  const theme = useMantineTheme();
  return (
    <DropzoneMantine
      onDrop={(files) => console.log("accepted files", files)}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={3 * 1024 ** 2}
      accept={[MIME_TYPES.csv, MIME_TYPES.xls, MIME_TYPES.xlsx]}
      {...props}
      maxFiles={1}
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: rem(220), pointerEvents: "none" }}
      >
        <DropzoneMantine.Accept>
          <IconUpload
            size="3.2rem"
            stroke={1.5}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 4 : 6
              ]
            }
          />
        </DropzoneMantine.Accept>
        <DropzoneMantine.Reject>
          <IconX
            size="3.2rem"
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </DropzoneMantine.Reject>
        <DropzoneMantine.Idle>
          <IconPhoto size="3.2rem" stroke={1.5} />
        </DropzoneMantine.Idle>

        <div>
          <Text size="xl" inline>
            Drag .CSV file here or click to select files
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            Attach one file at a time (max 5mb)
          </Text>
        </div>
      </Group>
    </DropzoneMantine>
  );
}

export default Dropzone;
