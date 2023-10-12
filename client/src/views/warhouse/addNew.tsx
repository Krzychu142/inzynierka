import Footer from "../../components/footer/Footer";
import { Button, DatePicker, Form, Input, InputNumber, Switch } from "antd";
import "./addNew.css";
import { Store } from "antd/lib/form/interface";

const addNew = () => {
  const [form] = Form.useForm();

  // const handleValuesChange = (changedValues: Store, allValues: Store) => {

  // };

  const onFinish = (values: Store) => {
    console.log(values);
  };

  return (
    <>
      <section className="add-new-product">
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          form={form}
          onFinish={onFinish}
          // onValuesChange={handleValuesChange}
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
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber min={0} precision={2} />
          </Form.Item>

          <Form.Item label="Promotional Price" name="promotionalPrice">
            <InputNumber min={0} precision={2} />
          </Form.Item>

          <Form.Item label="On Sale" name="isOnSale" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            label="Available"
            name="isAvailable"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Images (comma separated URLs)" name="images">
            <Input placeholder="e.g., http://example.com/image1.jpg, http://example.com/image2.jpg" />
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

          <Form.Item label="Added At" name="addedAt">
            <DatePicker showTime />
          </Form.Item>

          <Form.Item label="Sold At" name="soldAt">
            <DatePicker showTime />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </section>
      <Footer />
    </>
  );
};

export default addNew;
