import React from "react";
import Home from "./components/Home/Home";
import { ConfigProvider } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#514AA8",
            colorTextLightSolid: "#514AA8",
            colorBorder: "#A94A8F",
            colorPrimaryHover: "#72DBDB",
            fontSize: 16,
            colorTextDescription: "#A94A8F",
          },
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </>
  );
};

export default App;
