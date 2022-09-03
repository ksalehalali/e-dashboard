import Link from "next/link";
import { useDispatch } from "react-redux";
//components
import { Modal, Form, Table, Button, message, Space } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
} from "@ant-design/icons";
// redux
import { openModal } from "../../../redux/modal/action";
// hooks
import useFetch from "../../../utils/useFetch";
// layout
import Main from "../../layout/main";
// actions
import * as constants from "../../../redux/modal/constants";
import { useEffect, useState } from "react";
//style
function Color() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_LIST_PRODUCT_COLOR,
    "post"
  );
  useEffect(() => {
    if (data?.status === true && !loading) {
      // {
      //   page: ,
      //   data: [],
      // }
      let found = false;
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].page === currentPage) {
          found = true;
          break;
        }
      }

      if (found === false) {
        setTableData((prev) => {
          let newData = prev;
          newData.push({
            page: currentPage,
            data: data?.description,
          });
          return [...newData];
        });
      }
    }
  }, [data, error, loading]);

  const {
    data: deleteData = {},
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_DELETE_PRODUCT_COLOR,
    "post",
    {},
    false
  );

  //useEffect for delete item
  useEffect(() => {
    if (deleteData?.status === true) {
      //refresh the table ....
      message.success("Color has been deleted succeeefully !");
      executeFetch();
    } else if (deleteData?.status === false || deleteError) {
      Modal.info({
        title: "Something went wrong !",
        content: (
          <p>
            Some error happend while trying to delete this color. Please try
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
      title: "Are you sure about delete this color ",
      content: <div>this color will be deleted forever.....!</div>,
      onOk() {
        deleteExecuteFetch({ id, Role: name });
      },
    });
  };

  //handle edit item
  const handleEditItem = (id) => {
    dispatch(
      openModal(constants.modalType_AddColor, executeFetch, { id }, true)
    );
  };

  // table column
  const columns = [
    {
      title: "Name en",
      dataIndex: "name_EN",
      key: "id",
    },
    {
      title: "Hex Colde",
      dataIndex: "hexCode",
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
  useEffect(() => {
    let isFound = tableData.find((d) => d.page === currentPage);
    if (!isFound) executeFetch({ PageNumber: currentPage });
  }, [currentPage]);

  let tab_data = tableData.find((i) => i.page === currentPage);

  return (
    <Main>
      <Button
        onClick={() =>
          dispatch(openModal(constants.modalType_AddColor, executeFetch))
        }
      >
        Add New Color
      </Button>

      <Table
        columns={columns}
        rowKey={"id"}
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: data?.total,
          current: currentPage,
        }}
        dataSource={tab_data?.data}
        size="small"
        loading={loading}
      />
    </Main>
  );
}
export default Color;
