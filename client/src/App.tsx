import React from "react";
import { ConfigProvider } from "antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks";
import Home from "./views/home/Home";
import Login from "./views/login/Login";
import Dashboard from "./views/dashboard/Dashboard";
import Navbar from "./components/navbar/Navbar";
import WarhouseListing from "./views/warhouse/WarhouseListing";
import AddNew from "./views/warhouse/AddNew";
import Footer from "./components/footer/Footer";
import EmployeesListing from "./views/employees/EmployeesListing";
import ForgotPassword from "./views/forgotPassword/ForgotPassword";
import ResetPassword from "./views/resetPassword/ResetPassword";
import AddNewEmployee from "./views/employees/AddNewEmployee";

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
                {role === "manager"} && (
                <Route
                  path="/employees/addNew"
                  element={
                    <>
                      <Navbar />
                      <AddNewEmployee />
                      <Footer />
                    </>
                  }
                ></Route>
                )
                {role !== "cart operator" && (
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
                )}
                {role !== "cart operator" && role !== "warehouseman" && (
                  <Route
                    path="/employees"
                    element={
                      <>
                        <Navbar />
                        <EmployeesListing />
                      </>
                    }
                  ></Route>
                )}
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
            {!isAuthenticated ? (
              // only for guests
              <>
                <Route path="/login" element={<Login />}></Route>
                <Route
                  path="/forgotPassword"
                  element={<ForgotPassword />}
                ></Route>
                <Route
                  path="/resetPassword/:token"
                  element={<ResetPassword />}
                ></Route>
              </>
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
