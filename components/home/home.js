import React, { useEffect, useState, useRef } from "react";
import { Column, Line, Liquid, Menu, Dropdown } from "@ant-design/plots";
import { Pie } from "@ant-design/plots";
import Link from "next/link";
import {
    Row,
    Col,
    Button,
    Input,
    Checkbox,
    Table,
    Form,
    TimePicker,
    Select,
    DatePicker,
    Alert,
} from "antd";
import moment from "moment";
import useFetch from "utils/useFetch";
import axios from "axios";
import { useCookies } from "react-cookie";
import { withCookies } from "react-cookie";

function HomePage({ allCookies }) {
    const [form] = Form.useForm();
    const [cookies, setCookie] = useCookies(["user"]);
    const user = cookies.user;

    console.log("allCookies");
    console.log(user);

    // const {
    //   user: { token },
    // } = allCookies;

    const {
        data = [],
        error,
        loading,
        executeFetch,
    } = useFetch(
        "https://dashcommerce.click68.com/api/totalPaymentFromTo",
        "post",
        {},
        false
    );
    //Sum product State
    const [totalCategory, setTotalCategory] = useState({
        type: "Total Category",
        value: 0,
    });
    const [totalProduct, setTotalProduct] = useState({
        type: "Total Product ",
        value: 0,
    });
    const [totalProductCategory, setTotalProductCategory] = useState(null);

    //Sum Orders State
    const [AlldataPayment, setAlldataPayment] = useState({
        type: "All Order",
        value: 0,
    });
    const [dataPaymentDaily, setdataPaymentDaily] = useState({
        type: "Daily Order",
        value: 0,
    });
    const [dataPaymentMonthly, setdataPaymentMonthly] = useState({
        type: "Monthly Order",
        value: 0,
    });
    const [dataPaymentPendding, setdataPaymentPendding] = useState({
        type: "Pendding Order",
        value: 0,
    });
    const [dataPaymentProccessing, setdataPaymentProccessing] = useState({
        type: "Proccessing Order",
        value: 0,
    });
    const [dataPaymentDelivering, setdataPaymentDelivering] = useState({
        type: "Delivering Order",
        value: 0,
    });
    const [dataPaymentSuccess, setdataPaymentSuccess] = useState({
        type: "Success Order",
        value: 0,
    });

    const [TotalPayment, setTotalPayment] = useState({
        type: "Total Payment",
        value: 0,
    });
    const [TotalPaymentYear, setTotalPaymentYear] = useState({
        type: "Yearly",
        value: 0,
    });
    const [TotalPaymentMonth, setTotalPaymentMonth] = useState({
        type: "Monthly",
        value: 0,
    });
    const [TotalPaymentDay, setTotalPaymentDay] = useState({
        type: "Daily",
        value: 0,
    });
    //state

    useEffect(() => {
        const getData = async () => {
            const { data: TotalCategory } = await axios.get("https://dashcommerce.click68.com/api/totalCategory", {
                    headers: {
                        Authorization: `Bearer ${allCookies?.user?.token}`,
                    },
                })
                //.catch((err) => console.error(err));
            const { data: TotalProduct } = await axios.get(
                "https://dashcommerce.click68.com/api/totalProduct",
                {
                    headers: {
                        Authorization: `Bearer ${allCookies?.user?.token}`,
                    },
                }
            );
            const { data: AllCategory } = await axios.get(
                "https://dashcommerce.click68.com/api/AllCategory",
                {
                    headers: {
                        Authorization: `Bearer ${allCookies?.user?.token}`,
                    },
                }
            );
            console.log("sdsfs");
            console.log(AllCategory);
            const { data: PaymentData } = await axios.get(
                "https://dashcommerce.click68.com/api/totalPayment",
                {
                    headers: {
                        Authorization: `Bearer ${allCookies?.user?.token}`,
                    },
                }
            );

            const { data: sumOrder } = await axios.get(
                "https://dashcommerce.click68.com/api/SumOrder",

                {
                    headers: {
                        Authorization: `Bearer ${allCookies?.user?.token}`,
                    },
                }
            );
            console.log("sumOrder");
            console.log(sumOrder);

            const { data: PaymentDataYear } = await axios.get(
                "https://dashcommerce.click68.com/api/totalPaymentYear",
                {
                    headers: {
                        Authorization: `Bearer ${allCookies?.user?.token}`,
                    },
                }
            );
            const { data: PaymentDataMonth } = await axios.get(
                "https://dashcommerce.click68.com/api/totalPaymentMonth",
                {
                    headers: {
                        Authorization: `Bearer ${allCookies?.user?.token}`,
                    },
                }
            );
            const { data: PaymentDataDay } = await axios.get(
                "https://dashcommerce.click68.com/api/totalPaymentDay",
                {
                    headers: {
                        Authorization: `Bearer ${allCookies?.user?.token}`,
                    },
                }
            );

            setTotalPayment({
                ...TotalPayment,
                value: PaymentData.description,
            });

            setTotalPaymentYear({
                ...TotalPaymentYear,
                value: PaymentDataYear.description,
            });
            setTotalPaymentMonth({
                ...TotalPaymentMonth,
                value: PaymentDataMonth.description,
            });
            setTotalPaymentDay({
                ...TotalPaymentDay,
                value: PaymentDataDay.description,
            });
            setAlldataPayment({
                ...AlldataPayment,
                value: parseInt(sumOrder?.allOrder.split(",")[1]),
            });
            setdataPaymentDaily({
                ...dataPaymentDaily,
                value: parseInt(sumOrder?.dailyOrder.split(",")[1]),
            });
            setdataPaymentMonthly({
                ...dataPaymentMonthly,
                value: parseInt(sumOrder?.monthlyOrder.split(",")[1]),
            });
            setdataPaymentPendding({
                ...dataPaymentPendding,
                value: parseInt(sumOrder?.penddingOrder.split(",")[1]),
            });
            setdataPaymentProccessing({
                ...dataPaymentProccessing,
                value: parseInt(sumOrder?.proccessingOrder.split(",")[1]),
            });
            setdataPaymentSuccess({
                ...dataPaymentSuccess,
                value: parseInt(sumOrder?.successOrder.split(",")[1]),
            });

            setdataPaymentDelivering({
                ...dataPaymentDelivering,
                value: parseInt(sumOrder?.deliveringOrder.split(",")[1]),
            });

            setTotalCategory({
                ...totalCategory,
                value: TotalCategory?.description,
            });
            setTotalProduct({
                ...totalProduct,
                value: TotalProduct?.description,
            });
            setTotalProductCategory(AllCategory?.description);
        };

        getData();
    }, []);

    useEffect(() => {}, []);
    const onFinish = async (values) => {
        await form.validateFields(); // validate Fileds

        executeFetch(values); // start fetch
    };
    useEffect(() => {
        if (data?.status === true) {
            console.log("goood");
            // setdataPayment({
            //   ...dataPayment,
            //   value: data.description,
            // });
        } else {
        }
    }, [data, loading, error]);

    const config1 = {
        appendPadding: 10,
        data: [
            AlldataPayment,
            dataPaymentDaily,
            dataPaymentMonthly,
            dataPaymentPendding,
            dataPaymentProccessing,
            dataPaymentDelivering,
            dataPaymentSuccess,
        ],
        angleField: "value",
        colorField: "type",
        radius: 0.7,
        label: {
            type: "inner",
            offset: "-20%",
            style: {
                fontSize: 14,
                textAlign: "center",
            },
        },

        interactions: [
            {
                type: "tooltip",
                cfg: {
                    start: [
                        { trigger: "element:click", action: "tooltip:show" },
                    ],
                },
            },
        ],
    };
    const config2 = {
        data: [totalProduct],
        angleField: "value",
        colorField: "type",
        radius: 0.6,

        color: "#d62728",

        label: {
            type: "inner",
            offset: "-30%",
            style: {
                fontSize: 18,
                textAlign: "center",
            },
        },

        interactions: [
            {
                type: "tooltip",
                cfg: {
                    start: [
                        { trigger: "element:click", action: "tooltip:show" },
                    ],
                },
            },
        ],
    };
    const config3 = {
        data: [totalCategory],
        angleField: "value",
        colorField: "type",
        radius: 0.6,
        color: "#2ca02c",
        label: {
            type: "inner",
            offset: "-20%",
            style: {
                fontSize: 18,
                textAlign: "center",
            },
        },

        interactions: [
            {
                type: "tooltip",
                cfg: {
                    start: [
                        { trigger: "element:click", action: "tooltip:show" },
                    ],
                },
            },
        ],
    };

    const config = {
        data: [
            TotalPaymentDay,
            TotalPaymentMonth,
            TotalPaymentYear,
            TotalPayment,
        ],
        padding: "auto",
        seriesField: "name",
        xField: "type",
        yField: "value",

        label: {
            // 可手动配置 label 数据标签位置
            position: "middle",
            // 'top', 'bottom', 'middle',
            // 配置样式
            style: {
                fill: "black",
                opacity: 5.4,
                fontSize: 18,
            },
        },
        seriesField: "",
        color: "#1dd3d5",
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },

        meta: {
            type: {
                alias: "类别",
            },
            sales: {
                alias: "销售额",
            },
        },
    };

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

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
            title: "Order Number ",
            dataIndex: "orderNumber",
            key: "id",
        },
        {
            title: "Order Statue ",
            dataIndex: "orderStatus",
            key: "id",
        },
        {
            title: "Payment Getway",
            dataIndex: "paymentGetway",
            key: "id",
        },
        {
            title: "Payment Date",
            dataIndex: "paymentDate",
            key: "id",
        },
    ];
    const columns1 = [
        {
            title: "All Categories",
            dataIndex: "name",
            key: "id",
        },

        {
            title: "Total Number ",
            dataIndex: "numberTotal",
            key: "id",
        },
    ];

    return (
        <div>
            <Row gutter={[32, 32]}>
                <Col span={15}>
                    <Column {...config} />
                </Col>

                <Col span={9}>
                    <Table
                        columns={columns1}
                        dataSource={totalProductCategory}
                        size="small"
                    />
                </Col>
                <Col span={8}>
                    <Pie
                        {...config1}
                        onReady={(plot) => {
                            plot.on("label:click", (...args) => {
                                console.log(...args);
                            });
                        }}
                    />
                </Col>
                <Col span={8}>
                    <Pie {...config3} />
                </Col>
                <Col span={8}>
                    <Pie
                        {...config2}
                        onReady={(plot) => {
                            plot.on("label:click", (...args) => {
                                console.log(...args);
                            });
                        }}
                    />
                </Col>
                {/* <Col>
          <Row gutter={[24, 32]}>
            <Col span={6}>
             <a
                href={`/statistic?name=${
                  sumOrder?.allOrder
                }&url=${"https://dashcommerce.click68.com/api/AllOrder"}`}
              >
              </a>{" "} 
              {sumOrder?.allOrder.replace(",", ":")}
            </Col>
            <Col span={6}>{sumOrder?.dailyOrder?.split(",")[1]}</Col>
            <Col span={6}>{sumOrder?.monthlyOrder.replace(",", ":")} </Col>
            <Col span={6}>{sumOrder?.penddingOrder.replace(",", ":")} </Col>
            <Col span={6}>{sumOrder?.proccessingOrder.replace(",", ":")} </Col>
            <Col span={6}>{sumOrder?.deliveringOrder.replace(",", ":")} </Col>
            <Col span={6}>{sumOrder?.successOrder.replace(",", ":")} </Col>
          </Row>
        </Col> */}

                <Col span={24}>
                    {" "}
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Row gutter={24}>
                            <Col span={4}>
                                <Form.Item
                                    name="from"
                                    label="select start date"
                                >
                                    <Input placeholder="date" />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item name="to" label="select wanted date">
                                    <Input placeholder="date" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    {data?.description?.length > 0 && (
                        <Table
                            columns={columns}
                            rowKey={"id"}
                            dataSource={data?.description}
                            size="small"
                            loading={loading}
                        />
                    )}
                </Col>
            </Row>
        </div>
    );
}
export default withCookies(HomePage);
