import React from "react";
import { ConfigProvider } from "antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks";
import Home from "./views/home/Home";
import Login from "./views/login/Login";
import Dashboard from "./views/dashboard/Dashboard";
import Navbar from "./components/navbar/Navbar";
import WarehouseListing from "./views/warehouse/WarehouseListing";
import AddNewItem from "./views/warehouse/AddNewItem";
import Footer from "./components/footer/Footer";
import EmployeesListing from "./views/employees/EmployeesListing";
import ForgotPassword from "./views/forgotPassword/ForgotPassword";
import ResetPassword from "./views/resetPassword/ResetPassword";
import AddNewEmployee from "./views/employees/AddNewEmployee";
import ClientsListing from "./views/clients/ClientsListing";
import AddNewClient from "./views/clients/AddNewClient";
import OrdersListing from "./views/orders/OrdersListing";
import SingleClientOrders from "./views/clients/SingleClientOrders";
import AddNewOrder from "./views/orders/AddNewOrder";

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
            borderRadius: 8,
            controlOutlineWidth: 1,
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
                  path="/warehouse"
                  element={
                    <>
                      <Navbar />
                      <WarehouseListing />
                    </>
                  }
                ></Route>
                <Route
                  path="/orders"
                  element={
                    <>
                      <Navbar />
                      <OrdersListing />
                    </>
                  }
                ></Route>
                {role === "manager"} && (
                <>
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
                  <Route
                    path="/employees/:id"
                    element={
                      <>
                        <Navbar />
                        <AddNewEmployee />
                        <Footer />
                      </>
                    }
                  ></Route>
                </>
                )
                {role !== "cart operator" && (
                  <>
                    <Route
                      path="/warehouse/addNew"
                      element={
                        <>
                          <Navbar />
                          <AddNewItem />
                          <Footer />
                        </>
                      }
                    ></Route>
                    <Route
                      path="/warehouse/:id"
                      element={
                        <>
                          <Navbar />
                          <AddNewItem />
                          <Footer />
                        </>
                      }
                    ></Route>
                  </>
                )}
                {role !== "cart operator" && role !== "warehouseman" && (
                  <>
                    <Route
                      path="/employees"
                      element={
                        <>
                          <Navbar />
                          <EmployeesListing />
                        </>
                      }
                    ></Route>
                    <Route
                      path="/clients"
                      element={
                        <>
                          <Navbar />
                          <ClientsListing />
                        </>
                      }
                    ></Route>
                    <Route
                      path="/clients/addNew"
                      element={
                        <>
                          <Navbar />
                          <AddNewClient />
                          <Footer />
                        </>
                      }
                    ></Route>
                    <Route
                      path="/clients/:id"
                      element={
                        <>
                          <Navbar />
                          <AddNewClient />
                          <Footer />
                        </>
                      }
                    ></Route>
                    <Route
                      path="/clients/orders/:email"
                      element={
                        <>
                          <Navbar />
                          <SingleClientOrders />
                          <Footer />
                        </>
                      }
                    ></Route>
                    <Route
                      path="/orders/addNew"
                      element={
                        <>
                          <Navbar />
                          <AddNewOrder />
                          <Footer />
                        </>
                      }
                    ></Route>
                  </>
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
