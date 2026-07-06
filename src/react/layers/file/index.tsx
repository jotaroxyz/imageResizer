import { Flex, Paper, Image as MantineImage, rem, Text } from '@mantine/core';
import React from 'react';
import classes from "./File.module.css";
import { useFileState } from '../../state';
import { useIpc } from '../../hooks/useIpc';
import ResizeInputs from './ResizeInputs';

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

export const getAspectRatio = (width: number, height: number) => {
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
};

const getOrientation = (width: number, height: number) => {
  if (width > height) return "Landscape";
  if (height > width) return "Portrait";
  return "Square";
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getContainedSize = (width: number, height: number, maxSize: number) => {
  const scale = Math.min(1, maxSize / width, maxSize / height);
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
};

const FileLayer: React.FC = () => {
  const [file, setFile] = useFileState();
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [resolution, setResolution] = React.useState<{ width: number; height: number } | null>(null);
  const [path, setPath] = React.useState<string | null>(null);

  const containedSize = resolution
    ? getContainedSize(resolution.width, resolution.height, 200)
    : null;

  useIpc<{
    name: string;
    type: string;
    buffer: Uint8Array;
    path: string
  }>("react:send-image", (data) => {
    const bytes = new Uint8Array(data.buffer); // copies into a fresh ArrayBuffer-backed Uint8Array
    const file = new File([bytes], data.name, { type: data.type });
    setFile(file);
    setPath(data.path);
  });

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

  if (file && resolution)
    return (
      <Flex
        w="100%"
        h="100%"

        justify="stretch"
        align="stretch"
        direction="column"
        gap={rem(24)}

        p={rem(24)}
      >
        <Flex
          w="100%"
          h={rem(200)}

          justify="space-between"
          align="stretch"
          direction="row"
          gap={rem(24)}
        >
          {(containedSize) && (
            <>
              {previewUrl && (
                <Flex
                  h={rem(200)}
                  w={rem(200)}
                  style={{ flexShrink: 0 }}
                  justify="center"
                  align="center"
                >
                  <MantineImage
                    w="auto" h="auto" mah={rem(200)} maw={rem(200)}
                    src={previewUrl} alt={file.name} radius="md" fit="contain"
                  />
                </Flex>
              )}
              <Paper
                h="100%"
                mih={rem(120)}
                p={rem(12)}
                shadow="xs"
                radius="md"
                className={classes.paper}
              >
                <Flex
                  h="100%"
                  w="auto"

                  direction="column"
                  justify="space-around"
                  align="stretch"
                >
                  <Text size="sm" fw={400} truncate>File name: {file.name}</Text>
                  <Text size="sm" fw={400} truncate>File path: {path}</Text>
                  <Text size="sm" fw={400}>File type: {file.type.replace("image/", "")}</Text>
                  <Text size="sm" fw={400}>Resolution: {resolution.width} &#120; {resolution.height}</Text>
                  <Text size="sm" fw={400}>Aspect ratio: {getAspectRatio(resolution.width, resolution.height)}</Text>
                  <Text size="sm" fw={400}>Orientation: {getOrientation(resolution.width, resolution.height)}</Text>
                  <Text size="sm" fw={400}>Size: {formatSize(file.size)}</Text>
                </Flex>
              </Paper>
            </>
          )}
        </Flex>
        <ResizeInputs originalWidth={resolution.width} originalHeight={resolution.height} />
      </Flex>
    );
  else
    return <h3>Loading data...</h3>
};

export default FileLayer;