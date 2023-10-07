import React from "react";
import { ConfigProvider } from "antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./views/home/Home";
import Login from "./views/auth/Login";
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
            colorBgContainer: "#514AA8",
            colorBorder: "#DBB59E",
            controlOutline: "#DBB59E",
            controlOutlineWidth: 2,
            colorTextPlaceholder: "#A8A4D4",
            colorText: "#FFFFFF",
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
              <Route path="*" element={<Navigate to="/" />} />
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
