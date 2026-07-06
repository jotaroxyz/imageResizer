import React from 'react';
import { Route, Routes, Navigate, useSearchParams } from "react-router-dom";
import RootLayer from './layers/root';
import AppLayer from './layers/home';
import FileLayer from './layers/file';
import { useSetId } from './state';

const App: React.FC = () => {
  const [searchParams] = useSearchParams();
  const setId = useSetId();

  React.useEffect(() => {
    const id = searchParams.get("id");

    if (!id) {
      setId(null);
      return;
    }

    console.log("[App] ID", id);

    window.appWindow.ready(id);
    setId(id);

    return () => setId(null);
  }, [searchParams]);

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