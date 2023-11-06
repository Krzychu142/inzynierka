import { Button, Form, Input, Spin, message } from "antd";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MailOutlined, RollbackOutlined } from "@ant-design/icons";
import axios from "axios";
import useBaseURL from "../../customHooks/useBaseURL";
import "./forgotPassword.css";
import { FormInstance } from "antd/lib/form";

const ForgotPassword = () => {
  const baseUrl = useBaseURL();
  const [email, setEmail] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [isRequestInProccess, setIsRequestInProccess] = useState(false);
  const formRef = useRef<FormInstance | null>(null);

  const handleSendResetLink = () => {
    setIsRequestInProccess(true);
    axios
      .post(`${baseUrl}auth/forgotPassword`, { email })
      .then((res) => {
        if (res.status) {
          if (res.status === 201) {
            messageApi.open({
              type: "success",
              content: res.data?.message,
            });
            setEmail("");
            if (formRef.current) {
              formRef.current.resetFields();
            }
          }
        }
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "Something goes wrong",
        });
      })
      .finally(() => {
        setIsRequestInProccess(false);
      });
  };

  return (
    <>
      {isRequestInProccess && (
        <div className="loading-spin">
          <Spin size="large">
            <div />
          </Spin>
        </div>
      )}
      {contextHolder}
      <main className="login">
        <div className="login__background"></div>
        <section className="login__form">
          <Form
            className="login__form--border"
            layout="vertical"
            requiredMark={false}
            ref={formRef}
            onFinish={() => {
              handleSendResetLink();
            }}
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
                value={email}
                prefix={<MailOutlined className="main" />}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </Form.Item>
            <Form.Item className="login__form__button--center">
              <Button
                htmlType="submit"
                type="primary"
                title="Send reset link to the provided email."
              >
                Send reset link
              </Button>
            </Form.Item>
          </Form>
        </section>
        <Link to="/login">
          <RollbackOutlined
            className="login__home-icon"
            title="Back to login page."
          />
        </Link>
      </main>
    </>
  );
};

export default ForgotPassword;
