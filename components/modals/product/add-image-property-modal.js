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
  Select,
  TreeSelect,
  message,
} from "antd";

// redux
import { closeModal } from "../../../redux/modal/action";
// hooks
import useFetch from "../../../utils/useFetch";

import { useEffect, useState } from "react";

const { TreeNode } = TreeSelect;

function AddImagePropertyModal({ visible }) {
  const { successAction, editMode, mPayloads } = useSelector((state) => {
    return state.modal;
  });

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  //state
  const [editId, setEditId] = useState(null);
  const [fileList, setFileList] = useState([]);
  // adding new role
  const {
    data: addData = {},
    error: addError,
    loading: addLoading,
    executeFetch: addExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_ADD_GENERAL_PROPERTY_TO_PRODUCT,
    "post",
    {},
    false
  );

  const handleFormOnFinish = async () => {
    await form.validateFields();
    if (editMode) {
      editExecuteFetch({
        id: editId,
        Value_AR: form.getFieldValue("Value_AR"),
        Value_EN: form.getFieldValue("Value_EN"),
        PropertyID: mPayloads.pId,
      });
    } else {
      let obj = {};

      form
        .getFieldValue("Properties")
        ?.map(
          (id, i) =>
            (obj[`ValueProperty${i === 0 ? "" : i}ID`] = id.split("*")[0])
        );
      obj.Quantity = form.getFieldValue("Quantity");
      obj.ProdID = mPayloads.productId;
      addExecuteFetch(obj);
    }
  };
  useEffect(() => {
    if (addData?.status === true) {
      message.success(
        "General Properties has been added to " +
          mPayloads.productName +
          " product"
      );
      dispatch(closeModal());
    }
  }, [addData, addError, addLoading]);

  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(closeModal())}
      title={
        !editMode ? `Add Images To General Property` : "Edit General Property"
      }
      okButtonProps={{
        onClick: handleFormOnFinish,
        // loading: addLoading || editLoading,
        loading: addLoading,
      }}
    >
      <Form form={form} layout="vertical">
        {/* {getLoading ? (
          <h2>Loading.......</h2>
        ) : (
          <> */}
        <Row>
          {/* {editData?.status === false && (
                <Alert
                  description={
                    editData?.description ??
                    "Something went wrong! Please try again later"
                  }
                  showIcon
                  type="error"
                />
              )} */}
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
        </Row>
        {/* </>
        )} */}
      </Form>
    </Modal>
  );
}
export default memo(AddImagePropertyModal);
