import { useState } from "react";
import "./addNewEmployee.css";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
} from "antd";
import { Role } from "../../types/employee.interface";
import axios from "axios";
import useBaseURL from "../../customHooks/useBaseURL";
import { useAppSelector } from "../../hooks";
import { Store } from "antd/es/form/interface";
import MessageDisplayer from "../../components/messageDisplayer/MessageDisplayer";
import useGeneratePassword from "../../customHooks/useGeneratePassword";
import { useNavigate } from "react-router-dom";

const AddNewEmployee = () => {
  const [form] = Form.useForm();
  const baseUrl = useBaseURL();
  const token = useAppSelector((state) => state.auth.token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [errorMessage, setErrorMessage] = useState("");
  const { password } = useGeneratePassword();
  const naviagte = useNavigate();
  const [isRequestInProccess, setIsRequestInProccess] = useState(false);

  const onFinish = (values: Store) => {
    if (!values.employedAt) {
      values.employedAt = new Date().toISOString();
    }
    values.password = password;
    setIsRequestInProccess(true);
    axios
      .post(`${baseUrl}auth/register`, values, config)
      .then((res) => {
        if (res.status === 201) {
          naviagte("/employees");
        }
      })
      .catch((err) => {
        if (err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("Something went wrong!");
        }
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
      <section className="add-new-employee">
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Surname"
            name="surname"
            rules={[{ required: true, message: "Please input the surname!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input the email!" },
              { type: "email", message: "The input is not valid E-mail!" },
            ]}
            extra="Remember, it should be company email."
          >
            <Input />
          </Form.Item>

          {/* this need to be moved to some random function, then send it with email */}
          {/* <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input the password!" }]}
        >
          <Input.Password />
        </Form.Item> */}
          {/* FMI: it can be an example of not hardcodding - good pratice */}
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select the role!" }]}
          >
            <Select>
              {Object.values(Role).map((role) => (
                <Select.Option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Salary"
            name="salary"
            rules={[{ required: true, message: "Please input the salary!" }]}
            extra="PLN currency, brutto default"
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="Employed At"
            name="employedAt"
            extra="If you do not specify another, the current date will be stored."
          >
            <DatePicker showTime />
          </Form.Item>

          <Form.Item
            label="Birth Date"
            name="birthDate"
            rules={[{ required: true, message: "Please set date!" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please input the country!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please input the city!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Postal Code"
            name="postalCode"
            rules={[
              { required: true, message: "Please input the postal code!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Employee
            </Button>
          </Form.Item>
        </Form>
        {errorMessage && (
          <MessageDisplayer
            message={errorMessage}
            type="error"
            className="error"
          />
        )}
      </section>
    </>
  );
};

export default AddNewEmployee;
