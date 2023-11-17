import { useEffect, useState } from "react";
import { Button, Form, InputNumber, Select } from "antd";
import { useGetAllClientsQuery } from "../../features/clientsSlice";
import { useLoading } from "../../customHooks/useLoading";
import { IClient } from "../../types/client.interface";
import "./addNewOrder.css";
import { useGetAllProductsQuery } from "../../features/productsApi";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { IProduct } from "../../types/product.interface";
import { Store } from "antd/es/form/interface";

const { Option } = Select;

const AddNewOrder = () => {
  const [form] = Form.useForm();
  const { data: clients, isLoading: isClientsLoading } =
    useGetAllClientsQuery("");
  const { data: products, isLoading: isProductsLoading } =
    useGetAllProductsQuery("");
  const { startLoading, stopLoading, RenderSpinner } = useLoading();

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
  };

  const onFinish = (values: Store) => {
    console.log("Received values of form:", values);
  };

  return (
    <>
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
                      name={[name, "product"]}
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
                            <Option key={product._id} value={product._id}>
                              {product.name}
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
                        placeholder={`Quantity max ${productQuantities[name]}`}
                        min={1}
                        max={productQuantities[name]}
                      />
                    </Form.Item>

                    <Button
                      className="link"
                      type="link"
                      onClick={() => remove(name)}
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
