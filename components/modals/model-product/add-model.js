import { useDispatch, useSelector } from "react-redux";
//components
import {
  Modal,
  Form,
  Row,
  message,
  Col,
  Table,
  Input,
  Space,
  Button,
  Alert,
} from "antd";

// redux
import { closeModal } from "../../../redux/modal/action";
// hooks
import useFetch from "../../../utils/useFetch";

// actions
import { useEffect, useState } from "react";
//style
function AddModel({ visible }) {
  const { successAction, editMode, mPayloads } = useSelector((state) => {
    return state.modal;
  });
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  //state
  const [editId, setEditId] = useState(null);
  //list role data
  // adding new role
  const {
    data: addData = {},
    error: addError,
    loading: addLoading,
    executeFetch: addexecuteFetch,
  } = useFetch(
    "https://dashcommerce.click68.com/api/AddModelProduct",
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
    "https://dashcommerce.click68.com/api/EditModelProduct",
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
    "https://dashcommerce.click68.com/api/GetModelProduct",
    "post",
    { id: mPayloads?.id },
    editMode
  );

  const handleFormOnFinish = async () => {
    await form.validateFields();
    if (editMode) {
      editExecuteFetch({
        id: editId,
        ModelName: form.getFieldValue("ModelName"),
      });
    } else {
      addexecuteFetch({
        ModelName: form.getFieldValue("ModelName"),
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
        ModelName: getData.description.modelProducr,
      });
      setEditId(getData.description.id);
    }
  }, [getData, getError, getLoading]);

  //useEffect for editting data
  useEffect(() => {
    if (editData?.status === true) {
      successAction;
      dispatch(closeModal());
    }
  }, [editData, editError, editLoading]);

  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(closeModal())}
      title="Add ModelName"
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
                  name="ModelName"
                  label="Adding ModelName"
                  rules={[
                    {
                      required: true,
                      message: "Add ModelName",
                    },
                  ]}
                >
                  <Input placeholder="Add ModelName" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
}
export default AddModel;
