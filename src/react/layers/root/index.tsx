import React from 'react';
import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import classes from "./Root.module.css";
import TitleBar from './TitleBar';

const RootLayer: React.FC = () => {
  return (
    <AppShell className={classes.root}>
      <AppShell.Header withBorder={false} className={classes.header}>
        <TitleBar />
      </AppShell.Header>

      <AppShell.Main className={classes.main}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default RootLayer;