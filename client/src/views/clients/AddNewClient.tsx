import { useEffect, useState } from "react";
import { Button, Form, Input, Switch, Select, DatePicker } from "antd";
import axios from "axios";
import { useAppSelector } from "../../hooks";
import { useNavigate, useParams } from "react-router-dom";
import MessageDisplayer from "../../components/messageDisplayer/MessageDisplayer";
import useBaseURL from "../../customHooks/useBaseURL";
import { useLoading } from "../../customHooks/useLoading";
import { IClient, Priority } from "../../types/client.interface";
import "./addNewClient.css";
import dayjs from "dayjs";

const AddNewClient = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const baseUrl = useBaseURL();
  const { startLoading, stopLoading, RenderSpinner } = useLoading();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const onFinish = (values: IClient) => {
    startLoading();
    clearMessages();
    const url = id ? `${baseUrl}clients/${id}` : `${baseUrl}clients/create`;
    const method = id ? "put" : "post";

    axios[method](url, values, config)
      .then((res) => {
        if (res.status === 201) {
          navigate("/clients");
          setSuccessMessage("Client added successfully!");
        }
        if (res.status === 202) {
          setSuccessMessage("Client edited successfully!");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("Something went wrong!");
        }
      })
      .finally(() => {
        stopLoading();
      });
  };

  useEffect(() => {
    if (id) {
      startLoading();
      clearMessages();
      axios
        .get(`${baseUrl}clients/${id}`, config)
        .then((res) => {
          const client = res.data;
          form.setFieldsValue({
            name: client.name,
            surname: client.surname,
            email: client.email,
            address: client.address,
            shippingAddress: client.shippingAddress,
            city: client.city,
            country: client.country,
            postalCode: client.postalCode,
            phoneNumber: client.phoneNumber,
            description: client.description,
            priority: client.priority,
            addedAt: dayjs(client.addedAt),
            regular: client.regular,
            // countOfOrder: client.countOfOrder,
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

  return (
    <>
      <RenderSpinner />
      <section className="add-new-client">
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          form={form}
          onFinish={onFinish}
          initialValues={{ priority: Priority.NORMAL }}
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
              {
                required: true,
                message: "Please input the email!",
                type: "email",
              },
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

          <Form.Item
            label="Shipping Address"
            name="shippingAddress"
            extra="Provide if the shipping address is different from the customer's address."
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
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please input the country!" }]}
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
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: "Please select the priority!" }]}
          >
            <Select>
              {Object.values(Priority).map((priority) => (
                <Select.Option key={priority} value={priority}>
                  {priority.charAt(0) + priority.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Added at"
            name="addedAt"
            extra="If you don't specify any the default will be today."
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Regular Client"
            name="regular"
            valuePropName="checked"
            extra="Automatically, one becomes regular after 5 orders."
          >
            <Switch />
          </Form.Item>

          {/* <Form.Item label="Count of order" name="countOfOrder">
            <Input type="number" className="add-new-client__input--number" />
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {id ? "Edit Client" : "Add Client"}
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
        {successMessage && (
          <MessageDisplayer
            message={successMessage}
            type="success"
            className="success"
          />
        )}
      </section>
    </>
  );
};

export default AddNewClient;
