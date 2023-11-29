import { Group, Text, useMantineTheme, rem } from "@mantine/core";
import { IconFileUpload, IconFileCheck, IconX } from "@tabler/icons-react";
import { Dropzone as DropzoneMantine, MIME_TYPES } from "@mantine/dropzone";

export const MAX_FILE_SIZE_IN_MB = 5;

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
      maxSize={MAX_FILE_SIZE_IN_MB * 1024 ** 2}
      accept={[MIME_TYPES.csv]}
      maxFiles={1}
      multiple={false}
    >
      <Group
        position="center"
        spacing="lg"
        style={{ minHeight: rem(75), pointerEvents: "none" }}
      >
        <DropzoneMantine.Accept>
          <IconFileCheck
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
          <IconFileUpload size="2.5rem" stroke={1.5} />
        </DropzoneMantine.Idle>

        <div>
          {filename ? (
            <Text>{filename}</Text>
          ) : (
            <>
              <Text size="md" inline align="center">
                Drag .csv file here or click to select file
              </Text>
              <Text size="xs" color="dimmed" inline mt={10} align="center">
                Max file size {MAX_FILE_SIZE_IN_MB} MB
              </Text>
            </>
          )}
        </div>
      </Group>
    </DropzoneMantine>
  );
}

export default Dropzone;
