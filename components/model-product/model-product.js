import { useEffect, useState } from "react";
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
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
} from "@ant-design/icons";
// hooks
import useFetch from "../../utils/useFetch";
// layout
import Main from "../layout/main";
// redux
import { openModal } from "../../redux/modal/action";
import { useDispatch } from "react-redux";
// actions
import * as constants from "../../redux/modal/constants";

function ModelProduct() {
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);

  const dispatch = useDispatch();
  //state
  //list role data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch("https://dashcommerce.click68.com/api/ListModelProduct", "post");
  // adding new role
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
    "https://dashcommerce.click68.com/api/DeleteModelProduct",
    "post",
    {},
    false
  );

  //useEffect for delete item
  useEffect(() => {
    if (deleteData?.status === true) {
      //refresh the table ....
      message.success("ModelName has been deleted succeeefully !");
      executeFetch();
    } else if (deleteData?.status === false || deleteError) {
      Modal.info({
        title: "Something went wrong !",
        content: (
          <p>
            Some error happend while trying to delete this ModelName. Please try
            again later.
          </p>
        ),
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  }, [deleteData, deleteError, deleteLoading]);

  //handle Delete item
  const handleDeleteItem = (id) => {
    Modal.confirm({
      title: "Are you sure about delete this ModelName",
      content: <div>this ModelName will be deleted forever.....!</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  };

  //handle edit item
  const handleEditItem = (id) => {
    // openModal(constants.modalType_AddModel, executeFetch, { id }, true);
    dispatch(
      openModal(constants.modalType_AddModel, executeFetch, { id }, true)
    );
  };

  // table column
  const columns = [
    {
      title: "Model Name",
      dataIndex: "modelProducr",
      key: "modelProducr",
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
                handleDeleteItem(data.id);
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
      <Button onClick={() => dispatch(openModal(constants.modalType_AddModel))}>
        Add New Model
      </Button>

      <Table
        columns={columns}
        rowKey="id"
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: data?.total,
          current: currentPage,
        }}
        dataSource={tab_data?.data}
        size="small"
      />
    </Main>
  );
}
export default ModelProduct;
