//components
import { Table } from "antd";

// hooks
import useFetch from "../../utils/useFetch";
// layout
import Main from "../layout/main";

import { useEffect, useState } from "react";
//style
function RemovedOrder() {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch("https://dashcommerce.click68.com/api/ListRemoveOrder", "post");

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
export default RemovedOrder;
