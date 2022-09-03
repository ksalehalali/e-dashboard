import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
//components
import {
  Modal,
  Form,
  Row,
  Col,
  Table,
  Input,
  Button,
  Space,
  Alert,
  Select,
  TreeSelect,
  message,
  InputNumber,
} from "antd";

// redux
import { closeModal } from "../../../redux/modal/action";
// hooks
import useFetch from "../../../utils/useFetch";

import { useEffect, useState } from "react";

const { TreeNode } = TreeSelect;

function LinkProductToPropertyModal({ visible }) {
  const { successAction, editMode, mPayloads } = useSelector((state) => {
    return state.modal;
  });

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  //state
  const [editId, setEditId] = useState(null);
  // adding new role
  const {
    data: addData = {},
    error: addError,
    loading: addLoading,
    executeFetch: addExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_ADD_PRODUCT_COLOR_SIZE,
    "post",
    {},
    false
  );

  // for edit role
  const {
    data: editData,
    error: editError,
    loading: editLoading,
    executeFetch: editExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_EDIT_PRODUCT_COLOR_SIZE,
    "post",
    {},
    false
  );

  //data for get data
  const {
    data: getData,
    error: getError,
    loading: getLoading,
    executeFetch: getExecuteFecth,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_GET_PRODUCT_COLOR_SIZE,
    "post",
    { id: mPayloads?.id },
    editMode
  );

  // get color list
  const {
    data: colorData,
    error: colorErorr,
    loading: colorLoading,
    executeFetch: getColors,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_LIST_PRODUCT_COLOR,
    "post",
    { PageSize: 1000 },
    false
  );
  // get size list
  const {
    data: sizeData,
    error: sizeErorr,
    loading: sizeLoading,
    executeFetch: getSizes,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_LIST_PRODUCT_SIZE,
    "post",
    { PageSize: 1000 },
    false
  );

  const handleGetList = useCallback((listType) => {
    console.log(listType, "listType");
    if (listType === "color") {
      if (
        (!colorData && !Array.isArray(colorData?.description)) ||
        (Array.isArray(colorData?.description) &&
          colorData?.description?.length === 0)
      ) {
        getColors();
      }
    } else if (listType === "size") {
      if (
        (!sizeData && !Array.isArray(sizeData?.description)) ||
        (Array.isArray(sizeData?.description) &&
          sizeData?.description?.length === 0)
      ) {
        getSizes();
      }
    }
  });

  const handleFormOnFinish = useCallback(async () => {
    await form.validateFields();
    let obj = {};
    obj.ColorID = form.getFieldValue("ColorID");
    obj.SizeID = form.getFieldValue("SizeID");
    obj.Quantity = form.getFieldValue("Quantity");
    obj.ProductID = mPayloads.productId;
    obj.OverPrice = form.getFieldValue("OverPrice") ?? 0;
    if (editMode) {
      obj.id = editId;
      editExecuteFetch(obj);
    } else {
      addExecuteFetch(obj);
    }
  }, [editId]);

  useEffect(() => {
    if (addData?.status === true) {
      message.success(
        "General Properties has been added to " +
          mPayloads.productName +
          " product"
      );
      successAction();
      dispatch(closeModal());
    }
  }, [addData, addError, addLoading]);

  //useEffect for getting data
  useEffect(() => {
    if (getData?.status === true) {
      form.setFieldsValue({
        ColorID: getData?.description?.colorID,
        SizeID: getData?.description?.sizeID,
        Quantity: getData?.description?.quantity,
        OverPrice: getData?.description?.overPrice,
      });
      console.log("getData?.description?.id");
      console.log(getData?.description?.id);
      setEditId(getData?.description?.id);
    }
  }, [getData, getError, getLoading]);

  //useEffect for editting data
  useEffect(() => {
    console.log("editData", editData);
    if (editData?.status === true) {
      successAction();
      dispatch(closeModal());
    }
  }, [editData, editError, editLoading]);

  useEffect(() => {
    if (colorErorr) {
      message.error("Something went wrong! Please try again later");
    }
    if (colorData?.status === false) {
      message.error(
        colorData?.description ?? "Something went wrong! Please try again later"
      );
    }
  }, [colorData, colorErorr, colorLoading]);
  useEffect(() => {
    if (sizeErorr) {
      message.error("Something went wrong! Please try again later");
    }
    if (sizeData?.status === false) {
      message.error(
        sizeData?.description ?? "Something went wrong! Please try again later"
      );
    }
  }, [sizeData, sizeErorr, sizeLoading]);

  console.log("editId", editId);

  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(closeModal())}
      title={
        !editMode
          ? `Add General Property To ${mPayloads?.productName}`
          : "Edit General Property"
      }
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: addLoading || editLoading,
        disabled: getLoading,
      }}
    >
      <Form form={form} layout="vertical">
        {getLoading ? (
          <h2>Loading.......</h2>
        ) : (
          <>
            <Row>
              {editData?.status === false && (
                <Alert
                  description={
                    editData?.description ??
                    "Something went wrong! Please try again later"
                  }
                  showIcon
                  type="error"
                />
              )}
              <Col span={24}>
                <Form.Item
                  name="ColorID"
                  label="Color"
                  rules={[
                    {
                      required: true,
                      message: "Please choose color",
                    },
                  ]}
                >
                  <Select
                    placeholder="Color"
                    onFocus={() => handleGetList("color")}
                  >
                    {getData?.description?.colorID && (
                      <Select.Option value={getData.description.colorID}>
                        {getData.description.color}
                      </Select.Option>
                    )}
                    {colorData?.description?.map((item) => {
                      if (item.id === editData?.description?.colorID) return;
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
                <Form.Item
                  name="SizeID"
                  label="Size"
                  rules={[
                    {
                      required: true,
                      message: "Please choose size",
                    },
                  ]}
                >
                  <Select
                    placeholder="Size"
                    onFocus={() => handleGetList("size")}
                  >
                    {getData?.description?.sizeID && (
                      <Select.Option value={getData.description.sizeID}>
                        {getData.description.size}
                      </Select.Option>
                    )}
                    {sizeData?.description?.map((item) => {
                      if (item.id === editData?.description?.sizeID) return;
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
                <Form.Item
                  name="Quantity"
                  label="Quantity"
                  rules={[
                    {
                      required: true,
                      message: "Please add product quantity",
                    },
                  ]}
                >
                  <Input placeholder="Quantity" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="OverPrice" label="Over Price" rules={[]}>
                  <InputNumber
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
}
export default memo(LinkProductToPropertyModal);
