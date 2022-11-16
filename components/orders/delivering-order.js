//components
import {  Space, Modal, Popover, Radio, Button, message } from "antd";
import { Table } from "ant-table-extensions";
// hooks
import useFetch from "../../utils/useFetch";
// layout
import Main from "../layout/main";
import { WarningOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

//style
function DeliveringOrder() {
  const [tableData, setTableData] = useState([]);
  const [data1, setData1] = useState([]);
  const fileName = "myfile";
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState(2);
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
      process.env.NEXT_PUBLIC_LIST_DELIVERING_ORDER,
    "post",{PageSize:1000}
  );
  useEffect(() => {
    if (data?.status === true && !loading) {
      setData1(data?.description);
     
    }
  }, [data, error, loading]);
  const {
    data: editData = {},
    error: editError,
    loading: editLoading,
    executeFetch: editExecuteFetch,
  } = useFetch(
    "https://dashcommerce.click68.com/api/EditeStatusOrder",
    "post",
    {},
    false
  );

  useEffect(() => {
    if (editData?.status === true) {
      //refresh the table ....
      message.success("Order status has been edit  succeeefully !");
      setTableData([]);
      setValue(2);
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
  const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const exportToCSV = (data1, fileName) => {
  const ws = XLSX.utils.json_to_sheet(data1);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};
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
                  <Radio value={0} name="Pendding">
                    Pendding
                  </Radio>
                  <Radio value={1} name=" Processing">
                    Processing
                  </Radio>
                  <Radio value={3} name="success">
                    Success
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
        {/* <button onClick={(e) => exportToCSV(data1, fileName)}>Export</button> */}

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
        exportable
      />
    </Main>
  );
}
export default DeliveringOrder;
