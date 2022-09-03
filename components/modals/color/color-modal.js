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
function AddColor({ visible }) {
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
    executeFetch: addexecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_ADD_PRODUCT_COLOR,
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
      process.env.NEXT_PUBLIC_EDIT_PRODUCT_COLOR,
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
      process.env.NEXT_PUBLIC_GET_PRODUCT_COLOR,
    "post",
    { id: mPayloads?.id },
    editMode
  );

  const handleFormOnFinish = async () => {
    await form.validateFields();
    if (editMode) {
      editExecuteFetch({
        id: editId,
        Name_EN: form.getFieldValue("Name_EN"),
        Name_AR: form.getFieldValue("Name_AR"),
        HexCode: form.getFieldValue("HexCode"),
      });
    } else {
      addexecuteFetch({
        Name_EN: form.getFieldValue("Name_EN"),
        Name_AR: form.getFieldValue("Name_AR"),
        HexCode: form.getFieldValue("HexCode"),
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
        Name_EN: getData.description.name_EN,
        Name_AR: getData.description.name_AR,
        HexCode: getData.description.hexCode,
      });
      setEditId(getData.description.id);
    }
  }, [getData, getError, getLoading]);

  //useEffect for editting data
  useEffect(() => {
    if (editData?.status === true) {
      successAction();
      dispatch(closeModal());
    }
  }, [editData, editError, editLoading]);

  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(closeModal())}
      title="Add Product Color"
      okButtonProps={{
        onClick: handleFormOnFinish,
        loading: addLoading,
      }}
    >
      <Form form={form} layout="vertical">
        {getLoading ? (
          <h2>Loading.......</h2>
        ) : (
          <>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="Name_EN"
                  label="Adding Color EN"
                  rules={[
                    {
                      required: true,
                      message: "Add Color EN",
                    },
                  ]}
                >
                  <Input placeholder="Add Color EN" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Name_AR"
                  label="Adding Color AR"
                  rules={[
                    {
                      required: true,
                      message: "Add Color AR",
                    },
                  ]}
                >
                  <Input placeholder="Add Color AR" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="HexCode"
                  label="Adding Color HexCode"
                  rules={[
                    {
                      required: true,
                      message: "Add Color HexCode",
                    },
                  ]}
                >
                  <Input placeholder="Add Color HexCode" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
}
export default AddColor;
