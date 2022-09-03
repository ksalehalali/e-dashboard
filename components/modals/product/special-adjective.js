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
  Select,
} from "antd";

// redux
import { closeModal } from "../../../redux/modal/action";
// hooks
import useFetch from "../../../utils/useFetch";
import axios from "axios";
// actions
import { useEffect, useState } from "react";
import { withCookies } from "react-cookie";

//style
function AddSpecialAdjective({ visible, allCookies }) {
  const { successAction, editMode, mPayloads } = useSelector((state) => {
    console.log("state.modal", state.modal);
    return state.modal;
  });
  const {
    user: { token },
  } = allCookies;

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  //state
  const [editId, setEditId] = useState(null);
  const [pLoading, setPLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  //list role data
  // adding new role
  const {
    data: addData = {},
    error: addError,
    loading: addLoading,
    executeFetch: addexecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_ADD_SPECIAL_PRODUCT,
    "post",
    {},
    false
  );

  // for edit
  const {
    data: editData,
    error: editError,
    loading: editLoading,
    executeFetch: editExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_EDIT_SPECIAL_PRODUCT,
    "post",
    {},
    false
  );
  //data for get by id
  const {
    data: getData,
    error: getError,
    loading: getLoading,
    executeFetch: getExecuteFecth,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_GET_SPECIAL_PRODUCT,
    "post",
    { id: mPayloads?.id },
    editMode
  );
  const getProductList = async () => {
    if (productList.length > 0) {
      return;
    } else {
      setPLoading(true);
      const { data: res } = await axios.post(
        process.env.NEXT_PUBLIC_HOST_API +
          process.env.NEXT_PUBLIC_LIST_PRODUCT_BY_USER,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPLoading(false);
      if (res?.status === true) {
        setProductList(res?.description);
      }
    }
  };
  const handleFormOnFinish = async () => {
    await form.validateFields();
    if (editMode) {
      editExecuteFetch({
        id: editId,
        Prorerty_EN: form.getFieldValue("Prorerty_EN"),
        Prorerty_AR: form.getFieldValue("Prorerty_AR"),
        Value_EN: form.getFieldValue("Value_EN"),
        Value_AR: form.getFieldValue("Value_AR"),
        ProdID: mPayloads.prodId,
      });
    } else {
      addexecuteFetch({
        Prorerty_EN: form.getFieldValue("Prorerty_EN"),
        Prorerty_AR: form.getFieldValue("Prorerty_AR"),
        Value_EN: form.getFieldValue("Value_EN"),
        Value_AR: form.getFieldValue("Value_AR"),
        ProdID: mPayloads.prodId,
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
        ModelName: getData.description.modelProducr,
        Prorerty_EN: getData.description.prorerty_EN,
        Prorerty_AR: getData.description.prorerty_AR,
        Value_EN: getData.description.value_EN,
        Value_AR: getData.description.value_AR,
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

  console.log("mPayloads", mPayloads);

  return (
    <Modal
      visible={visible}
      onCancel={() => dispatch(closeModal())}
      title={
        !editMode
          ? `Add special adjective for ${mPayloads?.name}`
          : "Edit Special Adjective Product"
      }
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
                  name="Prorerty_EN"
                  label="Adding Prorerty_EN"
                  rules={[
                    {
                      required: true,
                      message: "Add Prorerty_EN",
                    },
                  ]}
                >
                  <Input placeholder="Add Prorerty_EN" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Prorerty_AR"
                  label="Adding Prorerty_AR"
                  rules={[
                    {
                      required: true,
                      message: "Add Prorerty_AR",
                    },
                  ]}
                >
                  <Input placeholder="Add Prorerty_AR" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Value_EN"
                  label="Adding Value_EN"
                  rules={[
                    {
                      required: true,
                      message: "Add Value_EN",
                    },
                  ]}
                >
                  <Input placeholder="Add Value_EN" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="Value_AR"
                  label="Adding Value_AR"
                  rules={[
                    {
                      required: true,
                      message: "Add Value_AR",
                    },
                  ]}
                >
                  <Input placeholder="Add Value_AR" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
}
export default withCookies(AddSpecialAdjective);
