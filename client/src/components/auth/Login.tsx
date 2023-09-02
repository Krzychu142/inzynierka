import React, { useState, useRef } from "react";
import "./login.css";
import LoginData from "./interface";
import { Form, FormInstance, Input, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const formRef = useRef<FormInstance>(null);

  const loginHandler = (): void => {
    formRef.current
      ?.validateFields()
      .then((values) => {
        console.log(values);
      })
      .catch((errorInfo) => {
        // Obsługuje błędy
        console.log(errorInfo);
      });
  };

  return (
    <main className="login">
      <div className="login__background"></div>
      <section className="login__form">
        <Form
          ref={formRef}
          className="login__form--border"
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input Your email!" },
              { type: "email", message: "The input is not valid email!" },
            ]}
          >
            <Input
              placeholder="email@yourWarehouse.com"
              id="email"
              onChange={(event) => {
                setLoginData({ ...loginData, email: event.target.value });
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input Your password!" }]}
          >
            <Input
              placeholder="password"
              type="password"
              id="password"
              onChange={(event) => {
                setLoginData({ ...loginData, password: event.target.value });
              }}
            />
          </Form.Item>
          <Form.Item className="login__form__button--center">
            <Button type="primary" onClick={() => loginHandler()}>
              LogIn
            </Button>
          </Form.Item>
        </Form>
      </section>
      <Link to="/">
        <HomeOutlined className="login__home-icon" title="Back to home page." />
      </Link>
    </main>
  );
};

export default Login;
