import React from "react";
import "./dashboard.css";
import { useAppSelector } from "../../hooks";
useAppSelector;
import { IDecodedToken } from "../../types/decodedToken.interace";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Dashboard: React.FC = () => {
  const decodedToken: IDecodedToken | null = useAppSelector(
    (state) => state.auth.decodedToken
  );

  let userName: string | null = null;
  let userRole: string | null = null;
  let userEmail: string | null = null;

  if (decodedToken) {
    userName = decodedToken.name;
    userRole = decodedToken.role.toUpperCase();
    userEmail = decodedToken.email;
  }

  return (
    <>
      <main className="dashboard">
        <section className="dashboard__user">
          <Avatar icon={<UserOutlined />} size={128} />
          <h2>
            Hello <span className="darker bold">{userName}</span>
          </h2>
          <h2>
            Your role: <span className="main">{userRole}</span>
          </h2>
          <h2>
            Your email: <span className="secondary">{userEmail}</span>
          </h2>
        </section>
        <section className="dashboard__last--activity">
          <p>There will be last activity</p>
        </section>
      </main>
    </>
  );
};

export default Dashboard;
