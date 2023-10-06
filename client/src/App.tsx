import React from "react";
import { ConfigProvider } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/auth/Login";

const App: React.FC = () => {
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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />}></Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </>
  );
};

export default App;
