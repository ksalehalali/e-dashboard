import { useEffect } from "react";
//redux
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/modal/action";
//hooks
import useFetch from "utils/useFetch";
//components
import { Table, Modal, Button, Space, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Main from "../layout/main";
//actions
import * as constants from "../../redux/modal/constants";
import Image from "next/image";
function Brand() {
  const dispatch = useDispatch();
  //List Product Brand
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_LIST_PRODUCT_BRAND,
    "post",
    {},
    true
  );

  const {
    data: deleteData = {},
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_DELETE_PRODUCT_BRAND,
    "post",
    {},
    false
  );
  //handle delete data
  const handleDeleteItem = (id, name) => {
    Modal.confirm({
      title: "Are you sure av-bout deleting this brand",
      content: <div>this brand will be deleted forever...!</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  };
  useEffect(() => {
    if (deleteData?.status === true) {
      executeFetch();
      message.success("Brand has been deleted successfully");
    } else if (deleteData?.status === false) {
      message.error(
        deleteError ?? "Something went wrong! Please try again later"
      );
    }
  }, [deleteData, deleteError, deleteLoading]);

  const handleEditItem = (id, image) => {
    dispatch(
      openModal(constants.modalType_AddBrand, executeFetch, { id, image }, true)
    );
  };

  //table column
  const columns = [
    {
      title: "Brand Image",
      dataIndex: "",
      key: "id",
      render: (data) => {
        return (
          <Image
            src={process.env.NEXT_PUBLIC_HOST_API + data.image}
            width={65}
            height={65}
            alt="image"
          />
        );
      },
    },
    {
      title: "Brand Name",
      dataIndex: "name_EN",
      key: "id",
    },
    {
      title: "user",
      dataIndex: "userName",
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
                handleEditItem(data.id, data.image);
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
      <Button
        onClick={() =>
          dispatch(openModal(constants.modalType_AddBrand, executeFetch))
        }
      >
        New Brand
      </Button>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data?.description}
        size="small"
      />
    </Main>
  );
}
export default Brand;
