import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import RootLayer from './layers/root';
import AppLayer from './layers/home';
import FileLayer from './layers/file';

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        key="root-layer"
        path="/"
        element={<RootLayer />}
      >
        <Route index element={<Navigate to={"/home"} replace />} />

        <Route path="/home" element={<AppLayer />} />
        <Route path="/file" element={<FileLayer />} />
      </Route>

      {/* Catch-all: redirect any unknown route to /home */}
      <Route path="*" element={<Navigate to={"/home"} replace />} />
    </Routes>
  );
};

export default App;