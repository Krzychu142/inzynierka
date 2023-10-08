import React from "react";
import { ConfigProvider } from "antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./views/home/Home";
import Login from "./views/login/Login";
import Dashboard from "./views/dashboard/Dashboard";
import { useAppSelector } from "./hooks";

const App: React.FC = () => {
  const isAuthenticated = useAppSelector((store) => store.auth.isAuthenticated);

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#514AA8",
            fontSize: 16,
            borderRadius: 16,
            controlOutlineWidth: 2,
          },
        }}
      >
        <BrowserRouter>
          <Routes>
            {isAuthenticated ? (
              // only for authenticated
              <Route path="/dashboard" element={<Dashboard />}></Route>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
            {!isAuthenticated ? (
              // only for guests
              <Route path="/login" element={<Login />}></Route>
            ) : (
              <Route path="*" element={<Navigate to="/dashboard" />} />
            )}
            <Route
              path="/"
              element={<Home isAuthenticated={isAuthenticated} />}
            />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </>
  );
};

export default App;
