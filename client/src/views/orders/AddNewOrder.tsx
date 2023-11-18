import { useEffect, useState } from "react";
import { Button, Form, InputNumber, Select, message } from "antd";
import { useGetAllClientsQuery } from "../../features/clientsSlice";
import { useLoading } from "../../customHooks/useLoading";
import { IClient } from "../../types/client.interface";
import "./addNewOrder.css";
import { useGetAllProductsQuery } from "../../features/productsApi";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { IProduct } from "../../types/product.interface";
import { Store } from "antd/es/form/interface";
import axios from "axios";
import useBaseURL from "../../customHooks/useBaseURL";
import { useAppSelector } from "../../hooks";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const AddNewOrder = () => {
  const [form] = Form.useForm();
  const { data: clients, isLoading: isClientsLoading } =
    useGetAllClientsQuery("");
  const { data: products, isLoading: isProductsLoading } =
    useGetAllProductsQuery("");
  const { startLoading, stopLoading, RenderSpinner } = useLoading();
  const [messageApi, contextHolder] = message.useMessage();
  const baseUrl = useBaseURL();
  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (isClientsLoading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [isClientsLoading, startLoading, stopLoading]);

  const [productQuantities, setProductQuantities] = useState<
    Record<number, number>
  >({});
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const updateSelectedProducts = (index: number, productId: string) => {
    const newSelectedProducts = [...selectedProductIds];
    newSelectedProducts[index] = productId;
    setSelectedProductIds(newSelectedProducts.filter(Boolean));
  };

  const handleRemoveProduct = (index: number) => {
    const newSelectedProducts = [...selectedProductIds];
    newSelectedProducts.splice(index, 1);
    setSelectedProductIds(newSelectedProducts);
  };

  const handleProductChange = (productId: string, index: number) => {
    const selectedProduct = products.find(
      (product: IProduct) => product._id === productId
    );
    if (selectedProduct) {
      setProductQuantities((prev: Record<number, number>) => ({
        ...prev,
        [index]: selectedProduct.stockQuantity,
      }));
    }
    updateSelectedProducts(index, productId);
  };

  const onFinish = (values: Store) => {
    startLoading();
    axios
      .post(
        `${baseUrl}orders/create`,
        {
          clientId: values.clientId,
          products: values.products,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 201) {
          navigate("/orders");
        }
      })
      .catch((err) => {
        messageApi.open({
          type: "error",
          content:
            err.response && err.response.data.message
              ? err.response.data.message
              : "Something goes wrong",
        });
      })
      .finally(() => {
        stopLoading();
      });
  };

  return (
    <>
      {contextHolder}
      {RenderSpinner()}
      <section className="add-new-order">
        <Form
          form={form}
          layout="vertical"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="clientId"
            label="Client:"
            rules={[{ required: true, message: "Please select the client!" }]}
          >
            <Select placeholder="Select a client" loading={isClientsLoading}>
              {clients?.map((client: IClient) => (
                <Option key={client._id} value={client._id}>
                  <span>
                    {client.name} {client.surname}
                  </span>
                  <span className="block">{client.email}</span>
                  <span className="block">{client.priority}</span>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item key={key}>
                    <Form.Item
                      label="Product:"
                      {...restField}
                      name={[name, "productId"]}
                      rules={[{ required: true, message: "Missing product" }]}
                    >
                      <Select
                        placeholder="Select a product"
                        loading={isProductsLoading}
                        onChange={(value) => handleProductChange(value, name)}
                      >
                        {products
                          ?.filter(
                            (product: IProduct) =>
                              product.isAvailable && product.stockQuantity > 0
                          )
                          .map((product: IProduct) => (
                            <Option
                              key={product._id}
                              value={product._id}
                              disabled={selectedProductIds.includes(
                                product._id
                              )}
                            >
                              {product.name}
                              <span className="block">{product.sku}</span>
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[{ required: true, message: "Missing quantity" }]}
                    >
                      <InputNumber
                        placeholder={
                          form.getFieldValue(["products", name, "productId"])
                            ? `Quantity max ${productQuantities[name] || ""}`
                            : "Set product"
                        }
                        min={1}
                        max={productQuantities[name]}
                      />
                    </Form.Item>

                    <Button
                      className="link"
                      type="link"
                      onClick={() => {
                        handleRemoveProduct(name);
                        remove(name);
                      }}
                    >
                      <MinusCircleOutlined />
                      Delete product
                    </Button>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add product
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Order
            </Button>
          </Form.Item>
        </Form>
      </section>
    </>
  );
};

export default AddNewOrder;
