import { useEffect, useState } from "react";
// components
import {
  Modal,
  Form,
  Alert,
  Row,
  Col,
  Input,
  Upload,
  Button,
  message,
  Select,
} from "antd";
import UploadFileComponent from "../../upload-file/upload-file";
import Image from "next/image";
// hooks
import useFetch from "../../../utils/useFetch";
// redux
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/modal/action";
// styles
import style from "../category/style.module.css";
import { DeleteFilled, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { withCookies } from "react-cookie";

function AddBrand({ visible }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [editId, setEditId] = useState(null);
  const { successAction, editMode, mPayloads } = useSelector((state) => {
    return state.modal;
  });
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
  // adding new brand
  const {
    data: addData = {},
    error: addError,
    loading: addLoading,
    executeFetch: addExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_ADD_PRODUCT_BRAND,
    "post",
    {},
    false
  );
  // for edit brand
  const {
    data: editData,
    error: editError,
    loading: editLoading,
    executeFetch: editExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_EDIT_PRODUCT_BRAND,
    "post",
    {},
    false
  );
  // get brand by id
  const {
    data: getData,
    error: getError,
    loading: getLoading,
    executeFetch: getExecuteFecth,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_GET_PRODUCT_BRAND,
    "post",
    { id: mPayloads?.id },
    editMode,
    {}
  );
  const handleFormOnFinish = async () => {
    await form.validateFields();
    if (editMode) {
      let formData = new FormData();
      formData.append("id", editId);
      formData.append("Name_AR", form.getFieldValue("Name_AR"));
      formData.append("Name_EN", form.getFieldValue("Name_EN"));
      if (newImage.file) {
        formData.append("Image", newImage.file);
      }
      editExecuteFetch(formData, true);
    } else {
      if (!newImage.file) {
        return false;
      }
      let formData = new FormData();
      formData.append("Name_AR", form.getFieldValue("Name_AR"));
      formData.append("Name_EN", form.getFieldValue("Name_EN"));
      formData.append("Image", newImage.file);
      addExecuteFetch(formData, true);
    }
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

  useEffect(() => {
    if (editMode) {
      setImageFile({
        prev: process.env.NEXT_PUBLIC_HOST_API + mPayloads?.image,
      });
    }
  }, [mPayloads]);

  useEffect(() => {
    if (getData?.status === true) {
      form.setFieldsValue({
        Name_AR: getData?.description?.name_AR,
        Name_EN: getData?.description?.name_EN,
      });
      setEditId(getData.description.id);
    }
  }, [getData, getError, getLoading]);
  //useEffect for adding data
  useEffect(() => {
    if (addData?.status === true) {
      message.success("Brand has been added.");
      successAction();
      dispatch(closeModal());
    } else if (addData?.status === false) {
      message.error(addError ?? "Something went wrong! Please try again later");
    }
  }, [addData, addError, addLoading]);

  //useEffect for editting data
  useEffect(() => {
    if (editData?.status === true) {
      message.success("Brand has been edited.");
      successAction();
      dispatch(closeModal());
    } else if (editData?.status === false) {
      message.error(
        editError ?? "Something went wrong! Please try again later"
      );
    }
  }, [editData, editError, editLoading]);

  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(closeModal())}
      title="Add Product Brand"
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: addLoading,
      }}
    >
      <Form form={form} layout="vertical">
        {getLoading ? (
          <h2>Loading....</h2>
        ) : (
          <>
            {getError ? (
              <Alert description={getError} type="error" />
            ) : (
              <Row>
                <Col span={24}>
                  <Form.Item name="Name_AR" label="Name Arabic">
                    <Input placeholder="Name Arabic" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="Name_EN" label="Name English">
                    <Input placeholder="Nmae English" />
                  </Form.Item>{" "}
                </Col>
                <Col
                  xs={24}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Upload {...imageProps} className={style.upload}>
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
                    <div className={style.edit_btn}>
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
            )}
          </>
        )}
      </Form>
    </Modal>
  );
}
export default AddBrand;
