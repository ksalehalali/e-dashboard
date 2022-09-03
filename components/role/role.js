import { useDispatch } from "react-redux";
//components
import { Modal, Form, Table, Button, message, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
} from "@ant-design/icons";
// redux
import { openModal } from "../../redux/modal/action";
// hooks
import useFetch from "../../utils/useFetch";
// layout
import Main from "../layout/main";
// actions
import * as constants from "../../redux/modal/constants";
import { useEffect, useState } from "react";
//style
function Rule() {
  const dispatch = useDispatch();
  //list role data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch("https://dashcommerce.click68.com/api/ListRole", "get");
  // adding new role
  const {
    data: deleteData = {},
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    "https://dashcommerce.click68.com/api/RemoveRole",
    "post",
    {},
    false
  );

  //useEffect for delete item
  useEffect(() => {
    if (deleteData?.status === true) {
      //refresh the table ....
      message.success("Role has been deleted succeeefully !");
      executeFetch();
    } else if (deleteData?.status === false || deleteError) {
      Modal.info({
        title: "Something went wrong !",
        content: (
          <p>
            Some error happend while trying to delete this role. Please try
            again later.
          </p>
        ),
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  }, [deleteData, deleteError, deleteLoading]);

  //handle Delete item
  const handleDeleteItem = (id, name) => {
    Modal.confirm({
      title: "Are you sure about delete this role",
      content: <div>this role will be deleted forever.....!</div>,
      onOk() {
        deleteExecuteFetch({ id, Role: name });
      },
    });
  };

  //handle edit item
  const handleEditItem = (id) => {
    dispatch(
      openModal(constants.modalType_AddRole, executeFetch, { id }, true)
    );
    console.log("clickeddddd");
    console.log(
      dispatch(
        openModal(constants.modalType_AddRole, executeFetch, { id }, true)
      )
    );
  };

  // table column
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Roles",
      dataIndex: "normalizedName",
      key: "normalizedName",
    },

    {
      title: "Actions",
      dataIndex: "",
      key: "",
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
                handleEditItem(data.id);
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
      <Button onClick={() => dispatch(openModal(constants.modalType_AddRole))}>
        Add New Role
      </Button>

      <Table columns={columns} dataSource={data?.description} size="small" />
    </Main>
  );
}
export default Rule;
