//components
import {  Space, Modal, Popover, Radio, Button, message } from "antd";
import { Table } from "ant-table-extensions";

// hooks
import useFetch from "../../utils/useFetch";
// layout
import Main from "../layout/main";
import {
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
//style
function SuccessOrder() {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState(3);
  const [isModalVisible, setIsModalVisible] = useState({
    target: null,
    value: false,
  });
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_LIST_SUCCESS_ORDER,
    "post",{PageSize:1000}
  );

  const {
    data: editData = {},
    error: editError,
    loading: editLoading,
    executeFetch: editExecuteFetch,
  } = useFetch(
    "https://dashcommerce.click68.com/api/EditeStatusOrder",
    "post",
    
    false
  );

  useEffect(() => {
    if (editData?.status === true) {
      //refresh the table ....
      message.success("Order status has been edit  succeeefully !");
      setTableData([]);
      setValue(3);
      executeFetch();
    } else if (editData?.status === false || editError) {
      Modal.info({
        title: "Something went wrong !",
        content: (
          <p>
            Some error happend while trying to change status. Please try again
            later.
          </p>
        ),
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  }, [editData, editError, editLoading]);

  const handleEditItem = (id, v) => {
    setValue(v?.target?.value);
    editExecuteFetch({ id, Status: v?.target?.value });
    setIsModalVisible({ target: null, value: false });
  };
  const showModal = (target) => {
    setIsModalVisible({ target: target, value: true });
  };

  const handleCancel = () => {
    setIsModalVisible({ target: null, value: false });
  };
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

  // table column
  const columns = [
    {
      title: "User",
      dataIndex: "userName",
      key: "id",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "id",
    },
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "id",
    },
    {
      title: "Payment",
      dataIndex: "payment",
      key: "id",
      render: (data) => {
        if (data === 0)
          return (
            <>
              <h6 style={{ color: "red" }}>Cash</h6>
            </>
          );
        else if (data === 1)
          return (
            <>
              <h6 style={{ color: "red" }}>Credit Card</h6>
            </>
          );
        else if (data === 2)
          return (
            <>
              <h6 style={{ color: "red" }}> Wallet</h6>
            </>
          );
      },
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "data",
      render: (data) => {
        if (data.length > 20)
          return (
            <>
              {data.substring(0, 10)} {data.substring(11, 16)}{" "}
            </>
          );
      },
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "id",
      render: (data) => {
        return (
          <Space size="large" key={data?.id}>
            <Popover
              visible={
                isModalVisible.target === data?.id &&
                isModalVisible.value === true
              }
              content={
                <Radio.Group
                  value={value}
                  name="status"
                  onChange={(v) => handleEditItem(data?.id, v)}
                >
                  <Radio value={0} name="pending">
                    Pendding
                  </Radio>
                  <Radio value={1} name=" Processing">
                    Processing
                  </Radio>
                  <Radio value={2} name="delivery">
                    Delivering
                  </Radio>
                </Radio.Group>
              }
            >
              <Button type="primary" onClick={() => showModal(data?.id)}>
                change status
              </Button>
            </Popover>
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
      <Table
        columns={columns}
        rowKey={"id"}
        // pagination={{
        //   onChange: (page) => {
        //     setCurrentPage(page);
        //   },
        //   total: data?.total,
        //   current: currentPage,
        // }}
        dataSource={data?.description}
        size="small"
        loading={loading}
        exportable
      />
    </Main>
  );
}
export default SuccessOrder;
