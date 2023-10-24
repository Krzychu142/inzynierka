import React, { useState, useRef } from "react";
import "./login.css";
import { Form, FormInstance, Input, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { login } from "../../features/authSlice";
import MessageDisplayer from "../../components/messageDisplayer/MessageDisplayer";

interface LoginDataType {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [loginData, setLoginData] = useState<LoginDataType>({
    email: "",
    password: "",
  });

  const formRef = useRef<FormInstance>(null);

  const loginHandler = (): void => {
    formRef.current?.validateFields().then((values) => {
      dispatch(login({ email: values.email, password: values.password }));
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
            <Input.Password
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
          <Form.Item className="login__form__button--center">
            <Link to="/forgotPassword" id="form__link-reset" className="link">
              Forgot Your password?
            </Link>
          </Form.Item>
          <MessageDisplayer
            type="error"
            className="error"
            message={authState?.error}
          />
        </Form>
      </section>
      <Link to="/">
        <HomeOutlined className="login__home-icon" title="Back to home page." />
      </Link>
    </main>
  );
};

export default Login;
