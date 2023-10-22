import { Button, Form, Input } from "antd";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();

  return (
    <main className="login">
      <section className="login__form">
        <Form
          className="login__form--border"
          layout="vertical"
          onFinish={() => {
            console.log("here");
          }}
        >
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input Your password!" }]}
          >
            <Input
              placeholder="password"
              type="password"
              id="password"
              // onChange={(event) => {
              //   setLoginData({ ...loginData, password: event.target.value });
              // }}
            />
          </Form.Item>
          <Form.Item
            name="password2"
            label="Confirm password"
            rules={[
              {
                required: true,
                message: "Please input Your confirm password!",
              },
            ]}
          >
            <Input
              placeholder="repeat password"
              type="password"
              id="password2"
              // onChange={(event) => {
              //   setLoginData({ ...loginData, password: event.target.value });
              // }}
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
  );
};

export default ResetPassword;
