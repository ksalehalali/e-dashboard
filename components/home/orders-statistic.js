import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
//components
import { Modal, Row, Col, Form, Table, Button, message, Space } from "antd";
// layout
import Main from "../layout/main";
// hooks
import useFetch from "utils/useFetch";
//style
function OrdersStatistic() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { url } = router.query;
  const { data, error, loading, executeFetch } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API + url,
    "post",
    {},
    true
  );
  console.log("dataaa");
  console.log(data);
  // table column
  const columns = [
    {
      title: "User",
      dataIndex: "userName",
      key: "id",
    },
    {
      title: "Adress",
      dataIndex: "addressName",
      key: "id",
    },
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "remove_Date",
      key: "id",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "id",
    },
  ];

  return (
    <Main>
      <Row>
        <Col
          span={6}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#1dd3d5",
            color: "#fff",
          }}
        >
          {" "}
          Count Of Order : {data?.countOrder}
        </Col>
        <Col
          span={6}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#1dd3d5",
            color: "#fff",
          }}
        >
          {" "}
          Sum Of Order : {data?.sumOrder}
        </Col>
      </Row>
      <Table
        columns={columns}
        rowKey={"id"}
        size="small"
        dataSource={data?.description}
      />
    </Main>
  );
}
export default OrdersStatistic;
