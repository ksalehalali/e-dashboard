import Image from "next/image";
import { memo, useCallback, useEffect, useState } from "react";
// components
import {
  Button,
  Col,
  Drawer,
  Upload,
  Row,
  Space,
  Typography,
  Form,
  Select,
  message,
  Alert,
  Empty,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// redux
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer } from "@/redux/drawer/action";
// hooks
import useFetch from "utils/useFetch";

import styled from "styled-components";
import Link from "next/link";
const { Title } = Typography;

// styled components

const ImagePrevBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  > a {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      color: red;
    }
  }
`;

const UploadBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border: 1px dashed #ddd;
  width: 100px;
  height: 100px;
  padding: 20px;
  &:hover {
    cursor: pointer;
    border-width: 2px;
  }
`;

const fileListInitial = {
  image1: {
    prevFile: null,
    file: null,
  },
  image2: {
    prevFile: null,
    file: null,
  },
  image3: {
    prevFile: null,
    file: null,
  },
  image4: {
    prevFile: null,
    file: null,
  },
};

function AddImagePropertyDrawer({ visible }) {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const {
    dPayloads: { id, productId, productName },
    editMode,
    successAction,
  } = useSelector((state) => state.drawer);

  const [fileList, setFileList] = useState({
    image1: {
      prevFile: null,
      file: null,
    },
    image2: {
      prevFile: null,
      file: null,
    },
    image3: {
      prevFile: null,
      file: null,
    },
    image4: {
      prevFile: null,
      file: null,
    },
  });
  const [colorId, setColorId] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleCloseDrawer = useCallback(() => dispatch(closeDrawer()), []);

  // list general properties
  const { data, error, loading, executeFetch } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_LIST_PRODUCT_COLOR_BY_PRODUCT,
    "post",
    {},
    false
  );

  const {
    data: getData,
    error: getError,
    loading: getLoading,
    executeFetch: getImages,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_GET_PRODUCT_IMAGES_COLOR_SIZE,
    "post",
    {},
    false
  );

  useEffect(() => {
    if (productId) {
      if (editMode) {
        getImages({ id: id });
      } else {
        executeFetch({ id: productId });
      }
    }
  }, [productId]);

  // add images
  const {
    data: addData,
    error: addError,
    loading: addLoading,
    executeFetch: addDataFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_ADD_PRODUCT_IMAGES_COLOR_SIZE,
    "post",
    {},
    false
  );
  // edit data
  const {
    data: editData,
    error: editError,
    loading: editLoading,
    executeFetch: editDataFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_EDIT_PRODUCT_IMAGES_COLOR_SIZE,
    "post",
    {},
    false
  );

  const handleBeforeUpload = useCallback(
    (file, type) => {
      const prevFile = URL.createObjectURL(file);
      setFileList((prev) => {
        let newFileList = prev;
        newFileList[`image${type}`].prevFile = prevFile;
        newFileList[`image${type}`].file = file;
        return { ...newFileList };
      });
      return false;
    },
    [fileList]
  );

  // handle remove file
  const handleRemoveFile = useCallback(
    (file, type) => {
      setFileList((prev) => {
        let newFileList = prev;
        newFileList[`image${type}`].prevFile = null;
        newFileList[`image${type}`].file = null;
        return { ...newFileList };
      });
      // setFileList((prev) => {
      //   let newArr = prev.filter((i) => i.prevFile !== file);
      //   return [...newArr];
      // });
    },
    [fileList]
  );

  // handle submit images
  const handleSubmit = useCallback(() => {
    const formData = new FormData();

    fileList.image1.file && formData.append("Image1", fileList.image1.file);
    fileList.image2.file && formData.append("Image2", fileList.image2.file);
    fileList.image3.file && formData.append("Image3", fileList.image3.file);
    fileList.image4.file && formData.append("Image4", fileList.image4.file);

    formData.append("ColorID", colorId);
    formData.append("ProductID", productId);
    if (editMode === true) {
      formData.append("id", selected);
      editDataFetch(formData, true);
    } else {
      addDataFetch(formData, true);
    }
  }, [colorId, selected]);

  // add data useEffect
  useEffect(() => {
    if (addData?.status === true) {
      message.success("Images has been added successfully to product");
      handleCloseDrawer();
    } else if (addData?.status === false) {
      message.error("Something went wrong! Please try again later");
    }
  }, [addData, addLoading, addError]);
  // edit data useEffect
  useEffect(() => {
    if (editData?.status === true) {
      message.success("Images has been edited successfully to product");
      successAction();
      handleCloseDrawer();
    } else if (editData?.status === false) {
      message.error("Something went wrong! Please try again later");
    }
  }, [editData, editLoading, editError]);
  //add data useEffect
  useEffect(() => {
    if (getData?.status === true) {
      form.setFieldsValue({
        ColorID: getData?.description?.colorID,
      });
      setColorId(getData?.description?.colorID);
      setSelected(getData?.description?.id);
      setFileList((prev) => {
        let newFileList = prev;
        if (getData?.description?.image1)
          newFileList.image1.prevFile =
            process.env.NEXT_PUBLIC_HOST_API + getData.description.image1;
        if (getData?.description?.image2)
          newFileList.image2.prevFile =
            process.env.NEXT_PUBLIC_HOST_API + getData.description.image2;
        if (getData?.description?.image3)
          newFileList.image3.prevFile =
            process.env.NEXT_PUBLIC_HOST_API + getData.description.image3;
        if (getData?.description?.image4)
          newFileList.image4.prevFile =
            process.env.NEXT_PUBLIC_HOST_API + getData.description.image4;
        return { ...newFileList };
      });
    } else if (getData?.status === false) {
      message.error("Something went wrong! Please try again later");
    }
  }, [getData, getError, getLoading]);

  // get data
  useEffect(() => {
    if (data?.status === true) {
    } else if (data?.status === false) {
      message.error("Something went wrong! Please try again later");
    }
  }, [data, loading, error]);

  const uploadButton = (
    <UploadBox>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </UploadBox>
  );

  console.log("fileList", fileList);

  console.log("colorId", colorId);

  return (
    <Drawer
      placement="right"
      title={`Add Images To ${productName}`}
      width={500}
      destroyOnClose={true}
      onClose={handleCloseDrawer}
      visible={visible}
      closable={!addLoading}
      extra={
        <Space>
          <Button onClick={handleCloseDrawer} disabled={addLoading}>
            Cancel
          </Button>
          <Button
            type="primary"
            loading={addLoading || editLoading}
            onClick={handleSubmit}
          >
            {editMode ? "Edit" : "Add"} Images
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" form={form}>
        {loading ? (
          <h2>Loading ...</h2>
        ) : (
          <>
            {data?.description?.length === 0 ? (
              <Empty
                description={
                  <span>
                    This product don&apos;t have any properties.{" "}
                    <Link
                      href={`/product-management/product/products-property?id=${productId}&name=${productName}`}
                    >
                      <a
                        onClick={() => handleCloseDrawer()}
                        style={{ textDecoration: "underline" }}
                      >
                        Click
                      </a>
                    </Link>{" "}
                    to add property to thi product
                  </span>
                }
              />
            ) : (
              <Row>
                {addError && (
                  <Col span={24}>
                    <Alert
                      description={
                        addError ??
                        "Something went wrong! Please try again later"
                      }
                      type="error"
                      showIcon
                    />
                  </Col>
                )}
                <Col span={24}>
                  <Form.Item
                    label="Select Color"
                    name="ColorID"
                    rules={[
                      {
                        required: true,
                        message: "Please select color id to add images",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Colors"
                      onChange={(value, ...rest) => {
                        setColorId(value);
                        setSelected(rest[0].id);
                        setFileList({
                          image1: {
                            prevFile: null,
                            file: null,
                          },
                          image2: {
                            prevFile: null,
                            file: null,
                          },
                          image3: {
                            prevFile: null,
                            file: null,
                          },
                          image4: {
                            prevFile: null,
                            file: null,
                          },
                        });
                      }}
                      disabled={editMode}
                    >
                      {editMode ? (
                        <>
                          {getData?.description && (
                            <Select.Option
                              value={getData?.description?.colorID}
                              id={getData?.description?.id}
                              key={getData?.description?.id}
                            >
                              {getData?.description?.color}
                            </Select.Option>
                          )}
                        </>
                      ) : (
                        <>
                          {data?.description?.map((item) => (
                            <Select.Option
                              value={item.colorID}
                              id={item.id}
                              key={item.id}
                            >
                              {item.color}
                            </Select.Option>
                          ))}
                        </>
                      )}
                    </Select>
                  </Form.Item>
                </Col>

                {colorId && (
                  <>
                    <Row gutter={[24, 24]}>
                      <Col>
                        {fileList.image1?.prevFile === null ? (
                          <Upload
                            showUploadList={false}
                            beforeUpload={(file) => handleBeforeUpload(file, 1)}
                            onRemove={handleRemoveFile}
                          >
                            {uploadButton}
                          </Upload>
                        ) : (
                          <ImagePrevBox>
                            <Image
                              width={100}
                              height={100}
                              src={fileList.image1.prevFile}
                              alt="image"
                            />
                            <a
                              href="#"
                              onClick={() => handleRemoveFile(null, 1)}
                            >
                              <DeleteOutlined />
                            </a>
                          </ImagePrevBox>
                        )}
                      </Col>
                      <Col>
                        <Upload
                          showUploadList={false}
                          beforeUpload={(file) => handleBeforeUpload(file, 2)}
                          onRemove={handleRemoveFile}
                        >
                          {fileList.image2?.prevFile === null ? (
                            <>{uploadButton}</>
                          ) : (
                            <ImagePrevBox>
                              <Image
                                width={100}
                                height={100}
                                alt="image"
                                src={fileList.image2.prevFile}
                              />
                              <a
                                href="#"
                                onClick={() => handleRemoveFile(null, 2)}
                              >
                                <DeleteOutlined />
                              </a>
                            </ImagePrevBox>
                          )}
                        </Upload>
                      </Col>
                      <Col>
                        <Upload
                          showUploadList={false}
                          beforeUpload={(file) => handleBeforeUpload(file, 3)}
                          onRemove={handleRemoveFile}
                        >
                          {fileList.image3?.prevFile === null ? (
                            <>{uploadButton}</>
                          ) : (
                            <ImagePrevBox>
                              <Image
                                width={100}
                                height={100}
                                src={fileList.image3.prevFile}
                                alt="image"
                              />
                              <a
                                href="#"
                                onClick={() => handleRemoveFile(null, 3)}
                              >
                                <DeleteOutlined />
                              </a>
                            </ImagePrevBox>
                          )}
                        </Upload>
                      </Col>
                      <Col>
                        <Upload
                          showUploadList={false}
                          beforeUpload={(file) => handleBeforeUpload(file, 4)}
                          onRemove={handleRemoveFile}
                        >
                          {fileList.image4?.prevFile === null ? (
                            <>{uploadButton}</>
                          ) : (
                            <ImagePrevBox>
                              <Image
                                width={100}
                                height={100}
                                alt="image"
                                src={fileList.image4.prevFile}
                              />
                              <a
                                href="#"
                                onClick={() => handleRemoveFile(null, 4)}
                              >
                                <DeleteOutlined />
                              </a>
                            </ImagePrevBox>
                          )}
                        </Upload>
                      </Col>
                    </Row>
                  </>
                )}
              </Row>
            )}
          </>
        )}
      </Form>
    </Drawer>
  );
}

export default AddImagePropertyDrawer;
