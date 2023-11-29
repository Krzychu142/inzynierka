import { useState } from "react";
import "./addNewItem.css";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Switch,
  Upload,
  UploadFile,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { Store } from "antd/es/form/interface";
import { RcFile, UploadProps } from "antd/es/upload";
import { PlusOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../hooks";
import useBaseURL from "../../customHooks/useBaseURL";
import { useLoading } from "../../customHooks/useLoading";
import axios from "axios";

type FileListType = UploadFile[];

const AddNewItem = () => {
  const [form] = Form.useForm();
  const [isOnSale, setIsOnSale] = useState(false);
  const token = useAppSelector((state) => state.auth.token);
  const baseUrl = useBaseURL();
  const { startLoading, stopLoading, RenderSpinner } = useLoading();
  const [messageApi, contextHolder] = message.useMessage();
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const onFinish = (values: Store) => {
    startLoading();

    // let initial stock quantity will be equal the first provided stock quantiti
    if (values.initialStockQuantity === undefined) {
      values.initialStockQuantity = values.stockQuantity;
    }

    axios
      .post(`${baseUrl}products/create`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 201) {
          messageApi.open({
            type: "success",
            content: "Product added successful",
          });
          setIsFormDisabled(true);
          setNewAddedItemId(res.data.product._id);
          setCanAddImages(true);
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

  const [canAddImages, setCanAddImages] = useState(false);
  const [newAddedItemId, setNewAddedItemId] = useState("");

  // uploads
  const [fileList, setFileList] = useState<FileListType>([]);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleCancel = () => setPreviewOpen(false);

  return (
    <>
      {contextHolder}
      <RenderSpinner fullscreen={true} />
      <section className="add-new-product">
        <Form
          disabled={isFormDisabled}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          form={form}
          onFinish={onFinish}
          initialValues={{
            isAvailable: true,
            currency: "PLN",
          }}
        >
          <Form.Item
            label="SKU"
            name="sku"
            rules={[{ required: true, message: "Please provide the SKU!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please provide the name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please provide the description!" },
            ]}
          >
            <TextArea rows={5} />
          </Form.Item>

          <Form.Item
            label="Stock Quantity"
            name="stockQuantity"
            rules={[
              {
                required: true,
                message: "Please provide  the stock quantity!",
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please provide the price!" }]}
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
            <Form.Item
              label="Promotional Price"
              name="promotionalPrice"
              rules={[
                {
                  required: isOnSale,
                  message: "Please provide the promotial price",
                },
              ]}
            >
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
          {!canAddImages && (
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Product
              </Button>
            </Form.Item>
          )}
        </Form>
        {canAddImages && (
          <section className="add-new-product">
            <h3>Add some images of product</h3>
            <Upload
              name="image"
              method="PUT"
              headers={{
                Authorization: `Bearer ${token}`,
              }}
              action={`${baseUrl}products/uploadImageToProduct/${newAddedItemId}`}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              accept=".jpg,.jpeg,.png"
            >
              {fileList.length >= 3 ? null : uploadButton}
            </Upload>
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt={`preview ${previewTitle}`}
                style={{ width: "100%" }}
                src={previewImage}
              />
            </Modal>
          </section>
        )}
      </section>
    </>
  );
};

export default AddNewItem;
