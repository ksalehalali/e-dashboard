//components
import {
    Space,
    Modal,
    Popover,
    Radio,
    Dropdown,
    Menu,
    Row,
    Col,
    Button,
    message,
    Tooltip,
} from "antd";
import { Table } from "ant-table-extensions";
import Link from "next/link";
// hooks
import useFetch from "../../utils/useFetch";
// layout
import Main from "../layout/main";
import { WarningOutlined, DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
//style
function AllOrder() {
    const [tableData, setTableData] = useState([]);
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
    } = useFetch(" https://dashcommerce.click68.com/api/AllOrder", "post", {
        PageSize: 1000,
    });

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
    const Actions = () => {
        const menu = (
            <Menu>
                <Menu.Item key="1">
                    <Link href={`/statistic?url=${"api/PenddingOrder"}`}>
                        Pendding Order
                    </Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link href={`/statistic?url=${"api/ProccessingOrder"}`}>
                        Proccessing Order
                    </Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link href={`/statistic?url=${"api/DeliveringOrder"}`}>
                        Delivering Order
                    </Link>
                </Menu.Item>
                <Menu.Item key="4">
                    <Link href={`/statistic?url=${"api/SuccessOrder"}`}>
                        Success Order
                    </Link>
                </Menu.Item>
                <Menu.Item key="5">
                    <Link href={`/statistic?url=${"api/DailyOrder"}`}>
                        Daily Order
                    </Link>
                </Menu.Item>
                <Menu.Item key="6">
                    <Link href={`/statistic?url=${"api/MonthlyOrder"}`}>
                        Monthly Order
                    </Link>
                </Menu.Item>
            </Menu>
        );
        return (
            <Space size="large">
                <Dropdown
                    overlay={menu}
                    trigger={["click"]}
                    style={{
                        margin: "10px",
                        padding: "10px",

                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>Choose Orders Statistic</Space>
                    </a>
                </Dropdown>
            </Space>
        );
    };
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

    useEffect(() => {
        let isFound = tableData.find((d) => d.page === currentPage);
        if (!isFound) executeFetch({ PageNumber: currentPage });
    }, [currentPage]);

    let tab_data = tableData.find((i) => i.page === currentPage);

    return (
        <Main>
            <Row>
                <Col
                    span={4}
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
                    <Actions />
                </Col>
            </Row>
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
export default AllOrder;
