import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../customHooks/useLoading";
import { useAppSelector } from "../../hooks";
import useBaseURL from "../../customHooks/useBaseURL";
import axios, { AxiosResponse } from "axios";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Switch,
  Upload,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import "./addNewItem.css";
import dayjs from "dayjs";
import { Store } from "antd/es/form/interface";
import { CloseCircleOutlined, UploadOutlined } from "@ant-design/icons";

const EditItem = () => {
  const { id } = useParams();
  const { startLoading, stopLoading, RenderSpinner } = useLoading();
  const [form] = Form.useForm();
  const token = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const baseUrl = useBaseURL();
  const [isOnSale, setIsOnSale] = useState(false);
  const [productsImages, setProductsImages] = useState<string[] | null>(null);
  const [productId, setProductId] = useState("");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [messageApi, contextHolder] = message.useMessage();
  const getSingleProduct = (res: AxiosResponse) => {
    const product = res.data;
    setProductId(product._id);
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

    setProductsImages(product.images);

    if (product.isOnSale) {
      setIsOnSale(true);
    }
  };

  const handleDeleteImage = (url: string) => {
    startLoading();

    axios
      .delete(`${baseUrl}products/deleteImageByURL`, {
        ...config,
        data: { url },
      })
      .then(() => {
        if (productsImages) {
          const updatedImages = productsImages.filter((image) => image !== url);
          setProductsImages(updatedImages);

          form.setFieldsValue({ images: updatedImages });

          const currentFormData = form.getFieldsValue();
          processForm(currentFormData);
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

  const fetchProductData = () => {
    startLoading();
    axios
      .get(`${baseUrl}products/${id}`, config)
      .then((res) => {
        getSingleProduct(res);
      })
      .catch(() => {
        navigate("/warehouse");
      })
      .finally(() => {
        stopLoading();
      });
  };

  useEffect(() => {
    startLoading();
    if (id) {
      fetchProductData();
      // axios
      //   .get(`${baseUrl}products/${id}`, config)
      //   .then((res) => {
      //     getSingleProduct(res);
      //   })
      //   .catch(() => {
      //     navigate("/warehouse");
      //   })
      //   .finally(() => {
      //     stopLoading();
      //   });
    }
  }, []);

  const processForm = (formData: Store) => {
    startLoading();
    axios
      .put(`${baseUrl}products/${id}`, formData, config)
      .then((res) => {
        getSingleProduct(res);
        messageApi.open({
          type: "success",
          content: "Product edited successfully!",
        });
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

  const onFinish = (formObject: Store) => {
    processForm(formObject);
  };

  return (
    <section className="add-new-product">
      {contextHolder}
      <RenderSpinner fullscreen={true} />
      <Form
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        form={form}
        onFinish={onFinish}
        className="form__container"
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
        </Row>

        <Form.Item label="Description" name="description">
          <TextArea rows={5} />
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input the price!" }]}
            >
              <InputNumber min={0} precision={2} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Currency"
              name="currency"
              extra="PLN by default"
              rules={[
                { required: true, message: "Please provide the currency!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="On Sale" name="isOnSale" valuePropName="checked">
              <Switch onChange={(checked) => setIsOnSale(checked)} />
            </Form.Item>
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>

        <Form.Item label="Available" name="isAvailable" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item label="Sold At" name="soldAt">
          <DatePicker showTime />
        </Form.Item>
        {productsImages && productsImages.length > 0 && (
          <Form.Item
            className="images__container"
            label={productsImages.length >= 1 ? "Images" : "Image"}
            name="images"
          >
            <Row align="middle" gutter={16}>
              {productsImages.map((imageSrc, index) => {
                return (
                  <Col className="image-container" key={index}>
                    <img
                      className="image"
                      alt={`Product ${index}`}
                      width={200}
                      src={imageSrc}
                    />
                    <Button
                      danger
                      className="delete-btn"
                      type="text"
                      icon={<CloseCircleOutlined />}
                      title="Delete"
                      onClick={() => handleDeleteImage(imageSrc)}
                    />
                  </Col>
                );
              })}
            </Row>
          </Form.Item>
        )}

        {productsImages &&
          productsImages.length < 3 &&
          productsImages.length > 0 && (
            <Form.Item>
              <Upload
                name="image"
                method="PUT"
                headers={{
                  Authorization: `Bearer ${token}`,
                }}
                accept=".jpg,.jpeg,.png"
                maxCount={1}
                action={`${baseUrl}products/uploadImageToProduct/${productId}`}
                showUploadList={false}
                onChange={(info) => {
                  if (info.file.status === "done") {
                    messageApi.open({
                      type: "success",
                      content: "Image uploaded successfully",
                    });
                    fetchProductData();
                  } else if (info.file.status === "error") {
                    messageApi.open({
                      type: "error",
                      content: "Can't upload image to product",
                    });
                  }
                }}
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Form.Item>
          )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Edit Product
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default EditItem;
