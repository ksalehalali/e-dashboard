//components
import {
  Modal,
  Form,
  Popover,
  Radio,
  Table,
  Button,
  message,
  Space,
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

import { useEffect, useState } from "react";
//style
function WaittingRemovedOrder() {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState(1);
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
    "https://dashcommerce.click68.com/api/ListWatingRemoverList",
    "post"
  );
  const {
    data: editData = {},
    error: editError,
    loading: editLoading,
    executeFetch: editExecuteFetch,
  } = useFetch(
    "https://dashcommerce.click68.com/api/RemoveStatusOrder",
    "post",
    {},
    false
  );

  const handleEditItem = (id, v) => {
    setValue(v?.target?.value);
    editExecuteFetch({ id, Remove: v?.target?.value });
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

  //useEffect for edit item
  useEffect(() => {
    if (editData?.status === true) {
      //refresh the table ....
      message.success("Waitting order status has been chanded succeeefully !");
      setTableData([]);
      setValue(1);
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

  //handle edit item

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
      title: "Date",
      dataIndex: "orderDate",
      key: "id",
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
                <>
                  <span>Are you sure about deleting this order ? </span>
                  <Radio.Group
                    value={value}
                    name="Remove"
                    onChange={(v) => handleEditItem(data?.id, v)}
                  >
                    <Radio value={0} name="cancel">
                      Cancel
                    </Radio>
                    <Radio value={2} name="ok">
                      Ok
                    </Radio>
                  </Radio.Group>
                </>
              }
            >
              <Button type="primary" onClick={() => showModal(data?.id)}>
                Remove Order
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
export default WaittingRemovedOrder;
