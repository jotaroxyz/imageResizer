import React from "react";
import { Group, ActionIcon, rem, Text, } from "@mantine/core";
import classes from "./Root.module.css";
import { useId } from "../../state";
import { useLocation } from "react-router-dom";

interface AActionIconT {
  icon: string;
  type?: string;
  click: () => void
}

const AActionIcon: React.FC<AActionIconT> = ({ icon, type, click }) => {
  return <ActionIcon
    className={classes.action_icon}
    data-type={type ?? "default"}
    variant="subtle"
    color="snow.3"
    size={rem(32)}
    onClick={() => click?.()}
    style={{ borderRadius: 0 }}
  >
    {icon}
  </ActionIcon>;
}

const TitleBar: React.FC = () => {
  const id = useId();
  const location = useLocation();

  const isHome = location.pathname === "/home";

  return (
    <Group
      justify={"center"}
      align="center"
      style={{
        height: rem(32),
        backgroundColor: "var(--mantine-color-navy-8)",
        WebkitAppRegion: "drag",
        userSelect: "none",
        position: "relative",
      }}
    >
      {!isHome && (
        <Group className={classes.go_back} gap={0}>
          <AActionIcon icon="&#x2190;" click={async () => await window.ipcRenderer.invoke("app:reload")} />
        </Group>
      )}

      <Text size="md" fw={500} c={"snow.3"}>Image Resizer</Text>

      {/* Buttons must NOT be draggable */}
      <Group className={classes.title_bar_controls} gap={0}>
        <AActionIcon icon="&#x2013;" click={() => window.appWindow.minimize(id)} />
        <AActionIcon icon="&#x2715;" type="close" click={() => window.appWindow.close(id)} />
      </Group>
    </Group>
  );
};

export default TitleBar;