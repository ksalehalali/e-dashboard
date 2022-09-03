import { useRouter } from "next/router";
import { useEffect } from "react";
// components
import Main from "@/components/layout/main";
import { Space, Table, Button, Tooltip, message, Modal } from "antd";
import {
  CameraOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
// hooks
import useFetch from "utils/useFetch";
// redux
import { useDispatch } from "react-redux";
import * as constants from "@/redux/modal/constants";
import { openModal } from "@/redux/modal/action";

function ProductsPropertyPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id, name } = router.query;

  // list general properties
  const { data, error, loading, executeFetch } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_GET_LIST_PRODUCT_COLOR_SIZE_BY_PRODUCT,
    "post",
    { id },
    false
  );

  // delete general properties
  const {
    data: deleteData,
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_DELETE_PRODUCT_COLOR_SIZE,
    "post",
    {},
    false
  );

  // functions
  // handle delete item
  const handleDeleteItem = (id, name) => {
    Modal.confirm({
      title: "Are you sure about delete this general property",
      content: <div>this general property will be deleted forever !</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  };

  //handle edit item
  const handleEditItem = (id, productName, productId) => {
    dispatch(
      openModal(
        constants.modalType_LinkProductToProperty,
        executeFetch,
        { id, productId, productName },
        true
      )
    );
  };

  // useEffects
  useEffect(() => {
    if (id) {
      executeFetch({ id });
    }
  }, [id]);

  // delete data use effect
  useEffect(() => {
    if (deleteData?.status === true) {
      message.success("General property has been deleted successfully.");
      executeFetch();
    } else if (deleteData?.status === false) {
      message.error("Something went wrong! Please try again later");
    }
  }, [deleteData, deleteLoading, deleteError]);

  // table column
  const columns = [
    {
      title: "Color",
      dataIndex: "color",
      key: "id",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "id",
    },
    {
      title: "Over Price",
      dataIndex: "overPrice",
      key: "id",
      render: (data) => <span>{data}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "id",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "",
      render: (data) => {
        return (
          <Space size="large" key={data.id}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteItem(data.id);
              }}
            >
              <DeleteOutlined style={{ color: "#f70202" }} />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleEditItem(data.id, name, id);
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
          <h3>Products Properties</h3>
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                openModal(
                  constants.modalType_LinkProductToProperty,
                  executeFetch,
                  { productId: id, productName: name },
                  false
                )
              );
            }}
          >
            New Product Property for {name}
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        rowKey={"id"}
        dataSource={data?.description}
        size="small"
        loading={loading}
      />
    </Main>
  );
}

export default ProductsPropertyPage;
