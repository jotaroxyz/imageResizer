import { Group, NumberInput, ActionIcon, Button, Stack, Text, rem } from "@mantine/core";
import { IconLock, IconLockOpen } from "@tabler/icons-react";
import React from "react";
import { getAspectRatio } from ".";

interface ResizeInputsProps {
  originalWidth: number;
  originalHeight: number;
}

const ResizeInputs: React.FC<ResizeInputsProps> = ({
  originalWidth,
  originalHeight
}) => {
  const [width, setWidth] = React.useState(originalWidth);
  const [height, setHeight] = React.useState(originalHeight);
  const [squareLocked, setSquareLocked] = React.useState(false);

  const emit = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
  };

  const handleWidthChange = (val: number | string) => {
    const w = typeof val === "number" ? val : parseInt(val) || 0;
    if (squareLocked) {
      emit(w, w);
    } else {
      setWidth(w);
    }
  };

  const handleHeightChange = (val: number | string) => {
    const h = typeof val === "number" ? val : parseInt(val) || 0;
    if (squareLocked) {
      emit(h, h);
    } else {
      setHeight(h);
    }
  };

  const toggleLock = () => {
    const next = !squareLocked;
    setSquareLocked(next);

    if (next) {
      emit(width, width);
    }
  };

  const applyPreset = (ratioW: number, ratioH: number) => {
    setSquareLocked(false);
    const w = width;
    const h = Math.round((w * ratioH) / ratioW);
    emit(w, h);
  };

  const resetToOriginal = () => {
    setSquareLocked(false);
    emit(originalWidth, originalHeight);
  };

  return (
    <Stack
      h="100%"
      w="100%"
      align="flex-start"
      justify="space-between"
    >
      <Group
        h="100%"
        w="100% "
        gap={rem(8)}
        align="center"
        justify="center"
      >  
        <NumberInput
          value={width}
          onChange={handleWidthChange}
          min={1}
          w={rem(100)}
          suffix=" px"
        />

        <ActionIcon
          variant={squareLocked ? "filled" : "default"}
          color={squareLocked ? "navy.0" : "snow"}
          size="md"
          bdrs={rem(8)}
          onClick={toggleLock}
        >
          {squareLocked ? <IconLock size={rem(14)} /> : <IconLockOpen size={rem(14)} />}
        </ActionIcon>

        <NumberInput
          value={height}
          onChange={handleHeightChange}
          w={rem(100)}
          min={1}
          suffix=" px"
          disabled={squareLocked}
        />
      </Group>

      <Group
        h="100%"
        w="100%"
        gap={rem(12)}
        align="center"
        justify="center"
      >
        <Button size="sm" variant="light" color="navy.0" c="snow.0" onClick={() => window.ipcRenderer.invoke("app:resize-image", { height, width })}>RESIZE</Button>
        <Button size="sm" variant="light" color="navy.0" c="snow.0" onClick={resetToOriginal}>RESET</Button>
      </Group>

      <Stack gap={rem(16)}>
        <Stack gap={0}>
          <Text size="xs" c="dimmed">Presets:</Text>
          <Group gap={6}>
            <Button size="xs" variant="light" color="snow" c="snow.0" onClick={() => applyPreset(1, 1)}>1:1</Button>
            <Button size="xs" variant="light" color="snow" c="snow.0" onClick={() => applyPreset(4, 3)}>4:3</Button>
            <Button size="xs" variant="light" color="snow" c="snow.0" onClick={() => applyPreset(16, 9)}>16:9</Button>
            <Button
              size="xs"
              variant="light"
              color="snow"
              onClick={() => applyPreset(originalWidth, originalHeight)}
            >
              Original ({getAspectRatio(originalWidth, originalHeight)})
            </Button>
          </Group>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ResizeInputs;