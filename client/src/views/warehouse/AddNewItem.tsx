import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, InputNumber, Switch } from "antd";
import "./addNewItem.css";
import { useParams } from "react-router-dom";
import { Store } from "antd/lib/form/interface";
import axios from "axios";
import { useAppSelector } from "../../hooks";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import MessageDisplayer from "../../components/messageDisplayer/MessageDisplayer";
import useBaseURL from "../../customHooks/useBaseURL";
import { useLoading } from "../../customHooks/useLoading";

const AddNewItem = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const baseUrl = useBaseURL();
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
        .get(`${baseUrl}products/${id}`, config)
        .then((res) => {
          const product = res.data;
          form.setFieldsValue({
            sku: product.sku,
            name: product.name,
            description: product.description,
            stockQuantity: product.stockQuantity,
            initialStockQuantity: product.initialStockQuantity,
            price: product.price,
            currency: product.currency,
            isOnSale: product.isOnSale,
            promotionalPrice: product.promotionalPrice,
            isAvailable: product.isAvailable,
            soldAt: product.soldAt ? dayjs(product.soldAt) : null,
            images: product.images,
            addedAt: product.addedAt ? dayjs(product.addedAt) : null,
          });

          if (product.isOnSale) {
            setIsOnSale(true);
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
    }
  }, [id]);

  const [isOnSale, setIsOnSale] = useState(false);

  const onFinish = (values: Store) => {
    startLoading();
    clearMessages();

    if (values.initialStockQuantity === undefined) {
      values.initialStockQuantity = values.stockQuantity;
    }

    const url = id ? `${baseUrl}products/${id}` : `${baseUrl}products/create`;

    const method = id ? "put" : "post";

    axios[method](url, id ? { id, ...values } : values, config)
      .then((res) => {
        if (res.status == 201) {
          navigate("/warhouse");
        }
        if (res.status == 202) {
          setSuccessMessage("Product updated!");
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
      <RenderSpinner />
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
          {!id && (
            <Form.Item
              label="SKU"
              name="sku"
              rules={[{ required: true, message: "Please input the SKU!" }]}
            >
              <Input />
            </Form.Item>
          )}

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

          {id && (
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
          )}

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber min={0} precision={2} />
          </Form.Item>

          <Form.Item label="Currency" name="currency" extra="PLN by default">
            <Input />
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
            <Switch />
          </Form.Item>

          {id && (
            <Form.Item label="Sold At" name="soldAt">
              <DatePicker showTime />
            </Form.Item>
          )}

          <Form.Item label="Images (comma separated URLs)" name="images">
            <Input placeholder="e.g., http://example.com/image1.jpg, http://example.com/image2.jpg" />
          </Form.Item>

          {id && (
            <Form.Item
              label="Added At"
              name="addedAt"
              // extra="If you don't specify any the default will be today."
            >
              <DatePicker showTime />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {id ? "Edit " : "Add "}Product
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

export default AddNewItem;
