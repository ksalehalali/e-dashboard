import dynamic from "next/dynamic";
import Image from "next/image";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
// components
import {
  Form,
  Alert,
  Row,
  Col,
  Input,
  Upload,
  Button,
  message,
  Select,
  Divider,
} from "antd";
import UploadFileComponent from "../../../components/upload-file/upload-file";
import Main from "../../../components/layout/main";

// hooks
import useFetch from "../../../utils/useFetch";
// redux
import { useDispatch, useSelector } from "react-redux";
// styles
import style from "./style.module.css";

import { DeleteFilled, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { withCookies } from "react-cookie";

function AddProduct({ allCookies, ...rest }) {
  const router = useRouter();
  const { id } = router.query;

  const [form] = Form.useForm();

  const [newImage, setNewImage] = useState({
    prev: null,
    file: null,
    validate: false,
  });
  const [imageFile, setImageFile] = useState({
    prev: null,
    file: null,
    validate: false,
  });
  const [img, setImg] = useState(null);
  const [value, setValue] = useState("");
  const [valueAr, setValueAr] = useState("");

  console.log("id");
  console.log(id);

  const addDataUrl = `${process.env.NEXT_PUBLIC_HOST_API}${
    id
      ? process.env.NEXT_PUBLIC_EDIT_PRODUCT
      : process.env.NEXT_PUBLIC_ADD_PRODUCT
  }`;

  console.log("addDataUrl");
  console.log(addDataUrl);
  // adding new category
  const {
    data: addData = {},
    error: addError,
    loading: addLoading,
    executeFetch: addExecuteFetch,
  } = useFetch(addDataUrl, "post", {}, false);
  const {
    data: editData = {},
    error: editError,
    loading: editLoading,
    executeFetch: editExecuteFetch,
  } = useFetch(addDataUrl, "post", {}, false);

  const {
    data: getData,
    error: getError,
    loading: getLoading,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API + process.env.NEXT_PUBLIC_GET_PRODUCT,
    "post",
    { id },
    true
  );

  const {
    data: categoryData = {},
    error: categoryError,
    loading: categoryLoading,
    executeFetch: categoryExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API + process.env.NEXT_PUBLIC_LIST_CATEGORY,
    "get",
    {},
    false
  );

  const {
    data: brandData = {},
    error: brandError,
    loading: brandLoading,
    executeFetch: brandExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_LIST_PRODUCT_BRAND,
    "post",
    {},
    false
  );

  const {
    data: modelData = {},
    error: modelError,
    loading: modelLoading,
    executeFetch: modelExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_LIST_MODEL_PRODUCT,
    "post",
    {},
    false
  );

  const handleFormOnFinish = async (values) => {
    await form.validateFields();
    if (id) {
      let formData = new FormData();
      formData.append("Name_ar", form.getFieldValue("Name_ar"));
      formData.append("Name_en", form.getFieldValue("Name_en"));
      formData.append("Offer", form.getFieldValue("Offer"));
      formData.append("Price", form.getFieldValue("Price"));
      formData.append("CatID", form.getFieldValue("Cat_id"));
      formData.append("ModelID", form.getFieldValue("ModelID"));
      formData.append("desc_EN", value);
      formData.append("desc_AR", valueAr);
      formData.append("brandID", form.getFieldValue("brandID"));
      formData.append("id", id);
      if (newImage.file !== null) {
        formData.append("Image", newImage.file);
      }
      addExecuteFetch(formData, true);
      return;
    }
    if (!newImage.file) {
      return false;
    }
    let formData = new FormData();
    formData.append("Name_ar", form.getFieldValue("Name_ar"));
    formData.append("Name_en", form.getFieldValue("Name_en"));
    formData.append("Offer", form.getFieldValue("Offer"));
    formData.append("Price", form.getFieldValue("Price"));
    formData.append("CatID", form.getFieldValue("Cat_id"));
    formData.append("ModelID", form.getFieldValue("ModelID"));
    formData.append("brandID", form.getFieldValue("brandID"));
    formData.append("desc_EN", value);
    formData.append("desc_AR", valueAr);
    formData.append("Image", newImage.file);
    addExecuteFetch(formData, true);
  };

  const imageProps = {
    accept: "image/png, image/jpeg",
    showUploadList: false,
    disabled: newImage.file ?? false,
    onRemove: (file) => {
      setNewImage({ file: null, prev: null, validate: false });
    },
    beforeUpload: (file) => {
      if (file.size >= 1048576) {
        message.error("File size must be less than 1Mb");
        return false;
      }
      setNewImage((prev) => {
        // validate image
        //     const validate = imageValidate(file);
        //     if (!validate) return prev;
        // set File
        let newObj = prev;
        newObj.file = file;
        newObj.prev = URL.createObjectURL(file);
        newObj.validate = false;
        return {
          ...newObj,
        };
      });
      return false;
    },
    newImage,
  };
  //list of category
  const getCategoriesList = async () => {
    if (categoryData?.description?.length > 0) {
      return;
    } else {
      categoryExecuteFetch();
    }
  };
  //list of Model
  const getModelList = async () => {
    if (modelData?.description?.length > 0) {
      return;
    } else {
      modelExecuteFetch();
    }
  };
  //list of Brand
  const getBrandList = async () => {
    if (brandData?.description?.length > 0) {
      return;
    } else {
      brandExecuteFetch();
    }
  };

  //useEffect for adding data
  useEffect(() => {
    if (addData?.status === true) {
      message.success("product has been added.");
      router.push("/product-management/product");
    } else if (addData?.status === false) {
      message.error(addError ?? "Something went wrong! Please try again later");
    }
  }, [addData, addError, addLoading]);

  // useFetch for getting data when page is edit
  useEffect(() => {
    if (id) {
      if (getData?.status === true) {
        console.log("getData", getData?.description);
        // adding data to from
        form.setFieldsValue({
          Cat_id: getData?.description?.catID,
          ModelID: getData?.description?.modelID,
          brandID: getData?.description?.brandID,
          Price: getData?.description?.price,
          Offer: getData?.description?.offer,
          Name_en: getData?.description?.name_EN,
          Name_ar: getData?.description?.name_AR,
        });
        setValue(getData?.description?.desc_EN),
          setValueAr(getData?.description?.desc_AR),
          setImageFile({
            prev:
              process.env.NEXT_PUBLIC_HOST_API +
              getData?.description?.primaryImage,
            file: null,
            validate: false,
          });
      } else if (getData?.status === false) {
        message.error(
          getData?.description ??
            "Something went wrong! Please try again later."
        );
      }
    }
  }, [getData, getError, getLoading, id]);
  // useEffect(() => {
  //   if (id) {
  //     setImageFile({
  //       prev: process.env.NEXT_PUBLIC_HOST_API + editData?.description?.image,
  //     });
  //   }
  // }, []);
  //useEffect for editting data
  useEffect(() => {
    if (editData?.status === true) {
      message.success("Category has been edited.");
    } else if (editData?.status === false) {
      message.error(
        editError ?? "Something went wrong! Please try again later"
      );
    }
  }, [editData, editError, editLoading]);

  return (
    <Main>
      <div className={style.box}>
        <Form form={form} layout="vertical" onFinish={handleFormOnFinish}>
          <Row>
            <Col
              span={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Row>
                <Col span={24}>
                  <h2>Product Image</h2>{" "}
                </Col>
                <Col>
                  <Upload {...imageProps}>
                    {imageFile.prev || newImage.prev ? (
                      <Image
                        src={`${
                          newImage.prev ? newImage.prev : imageFile.prev
                        }`}
                        width={200}
                        height={200}
                      />
                    ) : (
                      <UploadFileComponent />
                    )}
                    <div>
                      {newImage.prev ? (
                        <span>
                          <Button
                            type="danger"
                            shape="circle"
                            onClick={() =>
                              setNewImage({
                                prev: null,
                                file: null,
                                validate: false,
                              })
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: 10,
                            }}
                          >
                            <DeleteFilled
                              style={{ color: "white", fontSize: 24 }}
                            />
                          </Button>
                        </span>
                      ) : (
                        <span>
                          <EditOutlined />{" "}
                          {newImage.prev || imageFile.prev
                            ? "Edit Image"
                            : "Add Image"}
                        </span>
                      )}
                    </div>
                  </Upload>
                </Col>
              </Row>
            </Col>

            <Col span={12}>
              <Row gutter={24}>
                <Col span={24}>
                  <h2>Product Information</h2>{" "}
                </Col>
                <Col span={24}>
                  <Form.Item name="Cat_id" label="Parent Category">
                    <Select
                      placeholder="Parent Category"
                      onFocus={getCategoriesList}
                      loading={categoryLoading}
                    >
                      {id && (
                        <Select.Option value={getData?.description?.catID}>
                          {getData?.description?.categoryName}
                        </Select.Option>
                      )}
                      {categoryData?.description?.map((item) => {
                        if (
                          id &&
                          (item.id === getData?.description?.catID ||
                            item.id === getData?.description?.categoryName)
                        )
                          return;
                        return (
                          <Select.Option value={item.id} key={item.id}>
                            {item.name_EN}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="ModelID" label="Model ">
                    <Select
                      placeholder="ModelID"
                      onFocus={getModelList}
                      loading={modelLoading}
                    >
                      {id && (
                        <Select.Option value={getData?.description?.modelID}>
                          {getData?.description?.modelName}
                        </Select.Option>
                      )}
                      {modelData?.description?.map((item) => {
                        if (
                          id &&
                          (item.id === getData?.description?.modelID ||
                            item.id === getData?.description?.brandName)
                        )
                          return;
                        return (
                          <Select.Option value={item.id} key={item.id}>
                            {item.modelProducr}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="brandID" label="Brand ">
                    <Select
                      placeholder="Brand"
                      onFocus={getBrandList}
                      loading={brandLoading}
                    >
                      {id && (
                        <Select.Option value={getData?.description?.brandID}>
                          {getData?.description?.brandName}
                        </Select.Option>
                      )}
                      {brandData?.description?.map((item) => {
                        if (
                          id &&
                          (item.id === getData?.description?.brandID ||
                            item.id === getData?.description?.id)
                        )
                          return;
                        return (
                          <Select.Option value={item.id} key={item.id}>
                            {item.name_EN}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="Name_en" label="Name English">
                    <Input placeholder="Name English" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="Name_ar" label="Name Arabic">
                    <Input placeholder="Name Arabic" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="Price" label="Price">
                    <Input placeholder="Price" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="Offer" label="Offer ">
                    <Input placeholder="Offer " />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <h2>Description in english</h2>
              <ReactQuill
                name="desc_EN"
                onChange={setValue}
                value={value}
                theme="snow"
              />
            </Col>
            <Col span={24}>
              <h2>Description in arabic</h2>
              <ReactQuill
                name="desc_AR"
                onChange={setValueAr}
                value={valueAr}
                theme="snow"
              />
            </Col>
            <Col span={24}>
              <Button htmlType="submit" type="primery">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Main>
  );
}

export default withCookies(AddProduct);
