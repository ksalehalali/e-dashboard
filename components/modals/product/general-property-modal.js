import { memo } from "react";
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
} from "antd";

// redux
import { closeModal } from "../../../redux/modal/action";
// hooks
import useFetch from "../../../utils/useFetch";

import { useEffect, useState } from "react";
//style
function GeneralPropertyModal({ visible }) {
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
      process.env.NEXT_PUBLIC_ADD_GENERAL_PROPERTY,
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
      process.env.NEXT_PUBLIC_EDIT_GENERAL_PROPERTY,
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
      process.env.NEXT_PUBLIC_GET_GENERAL_PROPERTY,
    "post",
    { id: mPayloads?.id },
    editMode
  );

  const handleFormOnFinish = async () => {
    await form.validateFields();
    if (editMode) {
      console.log("editId", editId);
      console.log("mPayloads.pId", mPayloads.pId);
      editExecuteFetch({
        id: editId,
        Value_AR: form.getFieldValue("Value_AR"),
        Value_EN: form.getFieldValue("Value_EN"),
        PropertyID: mPayloads.pId,
      });
    } else {
      addExecuteFetch({
        Value_AR: form.getFieldValue("Value_AR"),
        Value_EN: form.getFieldValue("Value_EN"),
        PropertyID: mPayloads.id,
      });
    }
  };
  useEffect(() => {
    if (addData?.status === true) {
      successAction();
      dispatch(closeModal());
    }
  }, [addData, addError, addLoading]);

  //useEffect for getting data
  useEffect(() => {
    if (getData?.status === true) {
      form.setFieldsValue({
        Value_AR: getData?.description?.value_AR,
        Value_EN: getData?.description?.value_EN,
      });
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

  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(closeModal())}
      title={
        !editMode
          ? `Add General Attribute For ${mPayloads?.attributeName}`
          : "Edit General Attribute Product"
      }
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: addLoading || editLoading,
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
                  name="Value_EN"
                  label="General Value EN"
                  rules={[
                    {
                      required: true,
                      message: "Please add general value en",
                    },
                  ]}
                >
                  <Input placeholder="Add Prorerty_EN" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Value_AR"
                  label="General Value AR"
                  rules={[
                    {
                      required: true,
                      message: "Please add general value ar",
                    },
                  ]}
                >
                  <Input placeholder="Add Prorerty_AR" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
}
export default memo(GeneralPropertyModal);
