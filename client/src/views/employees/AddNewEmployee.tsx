import { useEffect, useState } from "react";
import "./addNewEmployee.css";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from "antd";
import { Role } from "../../types/employee.interface";
import axios from "axios";
import useBaseURL from "../../customHooks/useBaseURL";
import { useAppSelector } from "../../hooks";
import { Store } from "antd/es/form/interface";
import MessageDisplayer from "../../components/messageDisplayer/MessageDisplayer";
import useGeneratePassword from "../../customHooks/useGeneratePassword";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useLoading } from "../../customHooks/useLoading";
import { ContractType } from "../../types/contractType.enum";

const AddNewEmployee = () => {
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form] = Form.useForm();
  const baseUrl = useBaseURL();
  const token = useAppSelector((state) => state.auth.token);
  const { password } = useGeneratePassword();
  const naviagte = useNavigate();
  const { startLoading, stopLoading, RenderSpinner } = useLoading();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  useEffect(() => {
    if (id) {
      startLoading();
      clearMessages();
      axios
        .get(`${baseUrl}employees/${id}`, config)
        .then((res) => {
          const employee = res.data;
          form.setFieldsValue({
            name: employee.name,
            surname: employee.surname,
            email: employee.email,
            role: employee.role,
            salary: employee.salary,
            currency: employee?.currency,
            contractType: employee.contractType,
            employedAt: dayjs(employee.employedAt),
            birthDate: dayjs(employee.birthDate),
            phoneNumber: employee.phoneNumber,
            country: employee.country,
            city: employee.city,
            postalCode: employee.postalCode,
            address: employee.address,
          });
        })
        .catch((err) => {
          if (err.response.data.message) {
            setErrorMessage(err.response.data.message);
          } else {
            setErrorMessage("Something went wrong!");
          }
        })
        .finally(() => {
          stopLoading();
        });
    }
  }, [id]);

  const onFinish = (values: Store) => {
    startLoading();
    clearMessages();
    if (!values.employedAt) {
      values.employedAt = new Date().toISOString();
    }

    if (!id) {
      values.password = password;
    }

    const url = id ? `${baseUrl}employees/${id}` : `${baseUrl}auth/register`;

    const method = id ? "put" : "post";

    axios[method](url, values, config)
      .then((res) => {
        if (res.status === 201) {
          naviagte("/employees");
        }
        if (res.status === 202) {
          setSuccessMessage("Edited successfully");
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
        stopLoading();
      });
  };

  return (
    <>
      {RenderSpinner()}
      <section className="add-new-employee">
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          form={form}
          initialValues={{
            currency: "PLN",
            employedAt: dayjs(),
          }}
          className="box-shadow"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input the name!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Surname"
                name="surname"
                rules={[
                  { required: true, message: "Please input the surname!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Salary"
                name="salary"
                rules={[
                  { required: true, message: "Please input the salary!" },
                ]}
                extra="brutto"
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Currency"
                name="currency"
                rules={[
                  { required: true, message: "Please input the currency!" },
                ]}
                extra="Default is PLN"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Contract type"
            name="contractType"
            rules={[
              { required: true, message: "Please select the contract type!" },
            ]}
          >
            <Select>
              {Object.values(ContractType).map((contractType) => (
                <Select.Option key={contractType} value={contractType}>
                  {contractType.charAt(0).toUpperCase() + contractType.slice(1)}
                </Select.Option>
              ))}
            </Select>
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
          <Row gutter={16}>
            <Col>
              <Form.Item
                label="Country"
                name="country"
                rules={[
                  { required: true, message: "Please input the country!" },
                ]}
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
            </Col>
            <Col>
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
                rules={[
                  { required: true, message: "Please input the address!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {id ? "Edit Employee" : "Add Employee"}
            </Button>
          </Form.Item>
        </Form>
        {errorMessage && (
          <MessageDisplayer
            message={errorMessage}
            type="error"
            className="error margin-vertical"
          />
        )}
        {successMessage && (
          <MessageDisplayer
            message={successMessage}
            type="success"
            className="success margin-vertical"
          />
        )}
      </section>
    </>
  );
};

export default AddNewEmployee;
