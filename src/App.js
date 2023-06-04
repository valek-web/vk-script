import React from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./page/Layout";
import { DeleteUser } from "./page/DeleteUser/DeleteUser";
import { NotFound } from "./page/NotFound/NotFound";
import "bootstrap/dist/css/bootstrap.min.css";
import { DownloadListUsers } from "./page/DownloadListUsers/DownloadListUsers";

function App() {
  const [load, setLoad] = React.useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="delete_user" />} />
          <Route
            path="delete_user"
            element={<DeleteUser load={load} setLoad={setLoad} />}
          />
          <Route
            path="downlaod_user"
            element={<DownloadListUsers load={load} setLoad={setLoad} />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
