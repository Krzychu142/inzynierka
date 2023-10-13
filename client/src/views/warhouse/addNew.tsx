import { useState } from "react";
import { Button, DatePicker, Form, Input, InputNumber, Switch } from "antd";
import "./addNew.css";
import { Store } from "antd/lib/form/interface";
import axios from "axios";
import { useAppSelector } from "../../hooks";
import { useNavigate } from "react-router-dom";
import ErrorDisplayer from "../../components/error/ErrorDisplayer";

const addNew = () => {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  let baseUrl = import.meta.env.VITE_BASE_BACKEND_URL;

  if (!baseUrl) {
    baseUrl = "http://localhost:3001/";
  }

  const [form] = Form.useForm();
  const [isOnSale, setIsOnSale] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const onFinish = (values: Store) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${baseUrl}products/createProduct`, values, config)
      .then((res) => {
        if (res.status == 201) {
          navigate("/warehouse");
        }
      })
      .catch((err) => {
        setIsError(true);
        if (err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("Something went wrong!");
        }
      });
  };

  return (
    <>
      <section className="add-new-product">
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          form={form}
          onFinish={onFinish}
          initialValues={{
            isAvailable: true,
          }}
        >
          <Form.Item
            label="SKU"
            name="sku"
            rules={[{ required: true, message: "Please input the SKU!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Stock Quantity"
            name="stockQuantity"
            rules={[
              { required: true, message: "Please input the stock quantity!" },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="Initial Stock Quantity"
            name="initialStockQuantity"
            rules={[
              {
                required: true,
                message: "Please input the initial stock quantity!",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber min={0} precision={2} />
          </Form.Item>

          <Form.Item label="On Sale" name="isOnSale" valuePropName="checked">
            <Switch onChange={(checked) => setIsOnSale(checked)} />
          </Form.Item>

          {isOnSale && (
            <Form.Item label="Promotional Price" name="promotionalPrice">
              <InputNumber min={0} precision={2} />
            </Form.Item>
          )}

          <Form.Item
            label="Available"
            name="isAvailable"
            valuePropName="checked"
          >
            <Switch onChange={(checked) => setIsAvailable(checked)} />
          </Form.Item>

          {!isAvailable && (
            <Form.Item label="Sold At" name="soldAt">
              <DatePicker showTime />
            </Form.Item>
          )}

          <Form.Item label="Images (comma separated URLs)" name="images">
            <Input placeholder="e.g., http://example.com/image1.jpg, http://example.com/image2.jpg" />
          </Form.Item>

          <Form.Item
            label="Added At"
            name="addedAt"
            extra="If you don't specify any the default will be today."
          >
            <DatePicker showTime />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        {isError && <ErrorDisplayer message={errorMessage} />}
      </section>
    </>
  );
};

export default addNew;
