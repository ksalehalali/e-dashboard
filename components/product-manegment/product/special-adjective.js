import { useEffect, useState } from "react";
// components
import {
  Modal,
  Form,
  Row,
  Col,
  Table,
  Input,
  Button,
  Space,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
} from "@ant-design/icons";
// redux
import { useDispatch } from "react-redux";
import { closeModal, openModal } from "../../../redux/modal/action";
// hooks
import useFetch from "../../../utils/useFetch";
// layout
import Main from "../../layout/main";
// actions
import * as constants from "../../../redux/modal/constants";
import Image from "next/image";
import { useRouter } from "next/router";

function SpecialProduct() {
  const router = useRouter();
  const { id, name } = router.query;
  const dispatch = useDispatch();
  //list categories
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_LIST_SPECIAL_PRODUCT,
    "post",
    { id },
    true
  );

  // adding new category
  const {
    data: deleteData = {},
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_DELETE_SPECIAL_PRODUCT,
    "post",
    {},

    false
  );

  //handle edit item
  const handleEditItem = (id, image, prodId) => {
    dispatch(
      openModal(
        constants.modalType_AddSpecialAdjective,
        executeFetch,
        { id, image, prodId },
        true
      )
    );
  };
  // handle delete item
  const handleDeleteItem = (id, name) => {
    Modal.confirm({
      title: "Are you sure about delete this special adj",
      content: <div>this special adj will be deleted forever !</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  };

  // useEffect for delete Item
  useEffect(() => {
    if (deleteData?.status === true) {
      executeFetch();
      message.success(" special adj has been deleted successfully!");
    } else if (deleteData?.status === false) {
      message.error(
        deleteError ?? "Something went wrong! Please try again later"
      );
    }
  }, [deleteData, deleteError, deleteLoading]);

  // table column
  const columns = [
    {
      title: "properity",
      dataIndex: "prorerty_EN",
      key: "id",
    },
    {
      title: "value",
      dataIndex: "value_EN",
      key: "id",
    },

    {
      title: "Actions",
      dataIndex: "",
      key: "id",
      render: (data) => {
        return (
          <Space size="large" key={data}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteItem(data.id, data.name);
              }}
            >
              <DeleteOutlined style={{ color: "#f70202" }} />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleEditItem(data.id, data.image, id);
              }}
            >
              <EditOutlined style={{ color: "#1dd3d5" }} />
            </a>
          </Space>
        );
      },
    },
  ];

  return (
    <Main>
      <div className="content_header">
        <Space split={<span> | </span>}>
          <h3>
            Special Adjectives For{" "}
            <span style={{ textDecoration: "underline" }}>{name}</span> Product
          </h3>
          <Button
            onClick={() =>
              dispatch(
                openModal(
                  constants.modalType_AddSpecialAdjective,
                  executeFetch,
                  { name, prodId: id },
                  false
                )
              )
            }
          >
            Add new special adjective for this product
          </Button>
        </Space>
      </div>

      <Table
        rowKey={"id"}
        loading={loading}
        columns={columns}
        dataSource={data?.description}
        size="small"
      />
    </Main>
  );
}

export default SpecialProduct;
