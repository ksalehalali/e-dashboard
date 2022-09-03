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
function AddRole({ visible }) {
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
    "https://dashcommerce.click68.com/api/AddRole",
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
    "https://dashcommerce.click68.com/api/EditeRole",
    "post",
    {},
    false
  );
  //data for get role role by id
  const {
    data: getData,
    error: getError,
    loading: getLoading,
    executeFetch: getExecuteFecth,
  } = useFetch(
    "https://dashcommerce.click68.com/api/GetRole",
    "post",
    { id: mPayloads?.id },
    editMode
  );

  const handleFormOnFinish = async () => {
    await form.validateFields();
    if (editMode) {
      editExecuteFetch({
        id: editId,
        Role: form.getFieldValue("Role"),
      });
    } else {
      addexecuteFetch({
        Role: form.getFieldValue("Role"),
      });
    }
  };
  useEffect(() => {
    if (addData?.status === true) {
      successAction;
      dispatch(closeModal());
    }
  }, [addData, addError, addLoading]);

  //useEffect for getting data
  useEffect(() => {
    if (getData?.status === true) {
      form.setFieldsValue({
        Role: getData.description.name,
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
      title="Add Role"
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
                  name="Role"
                  label="Adding Role"
                  rules={[
                    {
                      required: true,
                      message: "Add Role",
                    },
                  ]}
                >
                  <Input placeholder="Add Role" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
}
export default AddRole;
