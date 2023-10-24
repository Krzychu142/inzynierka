import { Button, Form, Input, Spin, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useBaseURL from "../../customHooks/useBaseURL";

const ResetPassword = () => {
  const { token } = useParams();
  const baseUrl = useBaseURL();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [messageApi, contextHolder] = message.useMessage();
  const [isRequestInProccess, setIsRequestInProccess] = useState(false);
  const naviagte = useNavigate();

  const validatePasswords = (_: any, value: string) => {
    if (value !== password) {
      return Promise.reject(new Error("Passwords do not match!"));
    }
    return Promise.resolve();
  };

  const handleSetNewPassword = () => {
    if (password && confirmPassword && password === confirmPassword && token) {
      setIsRequestInProccess(true);
      axios
        .post(`${baseUrl}auth/resetPassword`, {
          token: token,
          password: password,
        })
        .then((res) => {
          if (res.status) {
            if (res.status === 201) {
              naviagte("/login");
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
    }
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
        <section className="login__form">
          <Form
            className="login__form--border"
            layout="vertical"
            requiredMark={false}
            onFinish={() => {
              handleSetNewPassword();
            }}
          >
            <Form.Item
              name="password"
              label="New password"
              rules={[
                { required: true, message: "Please input Your password!" },
                {
                  min: 6,
                  message: "Password should be minimum 6 characters!",
                },
              ]}
            >
              <Input.Password
                placeholder="new password"
                type="password"
                id="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="password2"
              label="Confirm new password"
              dependencies={["password"]}
              rules={[
                {
                  validator: validatePasswords,
                },
              ]}
            >
              <Input.Password
                placeholder="repeat password"
                type="password"
                id="password2"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
              />
            </Form.Item>
            <Form.Item className="login__form__button--center">
              <Button htmlType="submit" type="primary" title="Set new password">
                Set new password
              </Button>
            </Form.Item>
          </Form>
        </section>
        <div className="login__background"></div>
      </main>
    </>
  );
};

export default ResetPassword;
