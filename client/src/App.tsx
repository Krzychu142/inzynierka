import React from "react";
import { ConfigProvider } from "antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks";
import Home from "./views/home/Home";
import Login from "./views/login/Login";
import Dashboard from "./views/dashboard/Dashboard";
import Navbar from "./components/navbar/Navbar";
import WarhouseListing from "./views/warhouse/WarhouseListing";
import AddNew from "./views/warhouse/addNew";
import Footer from "./components/footer/Footer";

const App: React.FC = () => {
  const isAuthenticated = useAppSelector((store) => store.auth.isAuthenticated);
  const decodedToken = useAppSelector((store) => store.auth.decodedToken);
  const role = decodedToken?.role;

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
              <>
                <Route
                  path="/dashboard"
                  element={
                    <>
                      <Navbar />
                      <Dashboard />
                    </>
                  }
                ></Route>
                <Route
                  path="/warhouse"
                  element={
                    <>
                      <Navbar />
                      <WarhouseListing />
                    </>
                  }
                ></Route>
                {role != "cart operator" ? (
                  <>
                    <Route
                      path="/warhouse/addNew"
                      element={
                        <>
                          <Navbar />
                          <AddNew />
                          <Footer />
                        </>
                      }
                    ></Route>
                    <Route
                      path="/warhouse/:id"
                      element={
                        <>
                          <Navbar />
                          <AddNew />
                          <Footer />
                        </>
                      }
                    ></Route>
                  </>
                ) : (
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                )}
              </>
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
