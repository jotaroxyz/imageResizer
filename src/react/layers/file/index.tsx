import { Flex, Paper, Image as MantineImage, rem, Stack, Text } from '@mantine/core';
import React from 'react';
import classes from "./File.module.css";
import { useFileState } from '../../state';

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const FileLayer: React.FC = () => {
  const [file, setFile] = useFileState();
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [resolution, setResolution] = React.useState<{ width: number; height: number } | null>(null);

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setResolution(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const img = new Image();

    img.onload = () => {
      setResolution({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      setResolution(null);
    };

    img.src = objectUrl;

    // Revoke the URL only when this file is replaced/cleared
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (file)
    return (
      <Flex
        w="100%"
        h="100%"

        justify="flex-start"
        align="center"
        direction="column"
        gap={rem(10)}

        pt={rem(34)}
        pb={rem(34)}
      >
        {previewUrl && (
          <MantineImage
            src={previewUrl}
            alt={file.name}
            radius="sm"
            mah={200}
            fit="contain"
          />
        )}
        <Paper shadow="xs" className={classes.paper}>
          <Stack
            gap={rem(2)}
            align="stretch"
            justify="center"
          >
            <Text size="sm" fw={400} truncate>File name: {file.name}</Text>
            <Text size="sm" fw={400}>
              Resolution: {resolution ? `${resolution.width} × ${resolution.height}` : 'Loading...'}
            </Text>
            <Text size="sm" fw={400}>Size: {formatSize(file.size)}</Text>
          </Stack>
        </Paper>
      </Flex>
    );
  else
    return <h3>Loading data...</h3>
};

export default FileLayer;