import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Upload,
} from "antd";
import { toast } from "react-toastify";

import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/actions/product/addProductAction";
import { loadAllProductCategory } from "../../redux/actions/productCategory/getProductCategoryAction";
import UploadMany from "../Card/UploadMany";
import styles from "./AddProd.module.css";

const AddProd = () => {
  const unitType = ["kg", "ltr", "g"];
  const category = useSelector((state) => state.productCategories?.list);
  const dispatch = useDispatch();
  //useEffect for loading category list from redux
  useEffect(() => {
    dispatch(loadAllProductCategory({ page: 1, limit: 100 }));
  }, [dispatch]);

  const { Title } = Typography;
  const [fileList, setFileList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [sku, setSku] = useState("");

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      let formData = new FormData();
      formData.append("image", fileList[0].originFileObj);
      formData.append("name", values.name);
      formData.append("quantity", values.quantity);
      formData.append("volume", values.volume);
      formData.append("purchase_price", values.purchase_price);
      formData.append("sale_price", values.sale_price);
      formData.append("product_category_id", values.product_category_id);
      formData.append("sku", sku || values.sku); // use generated sku if available
      formData.append("unit_type", values.unit_type);
      formData.append("reorder_quantity", values.reorder_quantity);
      formData.append("unit_measurement", values.unit_measurement);

      const resp = await dispatch(addProduct(formData));

      if (resp.message === "success") {
        form.resetFields();
        setFileList([]);
        setLoader(false);
        setSku(""); // reset generated sku
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("creation error");
      setLoader(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoader(false);
    toast.error("fields with * must be completed");
    console.log("Failed:", errorInfo);
  };

  const handelChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const onClickLoading = () => {
    setLoader(true);
  };

  const handleGenerateSku = () => {
    const generatedSku = Math.floor(Math.random() * 900000000) + 100000000;
    const productName = form.getFieldValue("name").slice(0, 3).toUpperCase(); // Get the first three letters of the selected category
    setSku(`SKU-${productName}${generatedSku.toString()}`);
  };

  return (
    <Fragment>
      <Row className="mr-top" justify="space-between" gutter={[0, 30]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={11}
          xl={11}
          className="rounded column-design"
        >
          <Card bordered={false}>
            <Title level={4} className="m-2 text-center">
              Add Product
            </Title>
            <Form
              form={form}
              name="basic"
              labelCol={{
                span: 7,
              }}
              labelWrap
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the product name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                name="product_category_id"
                label="Select a category "
                rules={[
                  {
                    required: true,
                    message: "Please select the category!",
                  },
                ]}
              >
                <Select
                  name="product_category_id"
                  loading={!category}
                  showSearch
                  placeholder="Select a category"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {category &&
                    category.map((cate) => (
                      <Select.Option key={cate.id} value={cate.id}>
                        {cate.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                name="unit_type"
                label="Select unit type "
                rules={[
                  {
                    required: true,
                    message: "Please select unit type!",
                  },
                ]}
              >
                <Select
                  name="unit_type"
                  loading={!category}
                  showSearch
                  placeholder="Select unit type"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {unitType &&
                    unitType.map((unit) => (
                      <Select.Option key={unit} value={unit}>
                        {unit}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Format"
                name="unit_measurement"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Format!",
                  },
                ]}
              >

                <Input type="number" min={0} />

              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Quantity"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Quantity!",
                  },
                ]}
              >

                <Input type="number" min={0} />

              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Purchase price"
                name="purchase_price"
                rules={[
                  {
                    required: true,
                    message: " Please enter the Purchase Price!",
                  },
                ]}
              >
                <Input type="number"  min={0} value={0} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Selling price"
                name="sale_price"
                rules={[
                  {
                    required: true,
                    message: "Please enter the Sale Price!",
                  },
                ]}
              >

                <Input type="number" min={0} />

              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="Ordered quantity"
                name="reorder_quantity"
                rules={[
                  {
                    required: true,
                    message: "Please enter Ordered Quantity !",
                  },
                ]}
              >

                <Input type="number" min={0} />

              </Form.Item>

              <Form.Item label="Send image" valuePropName="image">
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  name="image"
                  fileList={fileList}
                  maxCount={1}
                  onChange={handelChange}
                >
                  <div>
                    <PlusOutlined />
                    <div
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Send
                    </div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: "15px" }}
                label="SKU"
                name="sku"
              >
                <Input
                  value={sku}
                  readOnly
                  addonBefore={sku && sku}
                  maxLength={9}
                  suffix={
                    <Button
                      type="primary"
                      size="small"
                      style={{
                        backgroundColor: "#1890ff",
                        borderColor: "#1890ff",
                        borderRadius: "4px",
                        marginRight: "5px",
                      }}
                      icon={<PlusOutlined style={{ color: "white" }} />}
                      onClick={handleGenerateSku}
                    />
                  }
                />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "15px" }}
                className={styles.addProductBtnContainer}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  shape="round"
                  loading={loader}
                  onClick={onClickLoading}
                >
                  Add Product
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={11} xl={11} className=" rounded">
          <Card className={`${styles.importCsvCard} column-design`}>
            <Title level={4} className="m-2 text-center">
              Import from CSV file
            </Title>
            <UploadMany urlPath={"product"} />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AddProd;
