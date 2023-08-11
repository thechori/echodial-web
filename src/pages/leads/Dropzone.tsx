import { Group, Text, useMantineTheme, rem } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone as DropzoneMantine, MIME_TYPES } from "@mantine/dropzone";

function Dropzone({
  filename,
  onDrop,
  onReject,
}: {
  filename?: string;
  onDrop: (files: any) => void;
  onReject: (error: any) => void;
}) {
  const theme = useMantineTheme();
  return (
    <DropzoneMantine
      onDrop={onDrop}
      onReject={onReject}
      maxSize={3 * 1024 ** 2}
      accept={[MIME_TYPES.csv, MIME_TYPES.xls, MIME_TYPES.xlsx]}
      maxFiles={1}
    >
      <Group
        position="center"
        spacing="lg"
        style={{ minHeight: rem(75), pointerEvents: "none" }}
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
          <IconPhoto size="2.5rem" stroke={1.5} />
        </DropzoneMantine.Idle>

        <div>
          {filename ? (
            <Text>{filename}</Text>
          ) : (
            <>
              <Text size="md" inline align="center">
                Drag .CSV file here or click to select files
              </Text>
              <Text size="xs" color="dimmed" inline mt={7} align="center">
                Attach one file at a time (max 5mb)
              </Text>
            </>
          )}
        </div>
      </Group>
    </DropzoneMantine>
  );
}

export default Dropzone;
