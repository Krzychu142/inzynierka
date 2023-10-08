import React from "react";
import "./dashboard.css";
import Navbar from "../../components/navbar/Navbar";

const Dashboard: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="dashboard">
        There can be newset orders or messages from boos.
      </main>
    </>
  );
};

export default Dashboard;
