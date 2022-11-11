import { memo } from "react";
import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// import Image from "next/image";

import { useEffect, useState } from "react";
//components
import {
    Table,
    Button,
    Space,
    Modal,
    message,
    Tooltip,
    Typography,
    Image as AntImage,
    Dropdown,
    Menu,
} from "antd";
import {
    CameraOutlined,
    DeleteOutlined,
    EditOutlined,
    FilterFilled,
    FilterOutlined,
    DownOutlined,
} from "@ant-design/icons";
import { IoMdImages } from "react-icons/io";
//hooks
import useFetch from "../../../utils/useFetch";
//layout
import Main from "../../../components/layout/main";
// redux
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "@/redux/modal/action";
import * as constants from "@/redux/modal/constants";
import { drawerType_AddImageToProperty } from "@/redux/drawer/constants";
import { openDrawer } from "@/redux/drawer/action";
import TableHeader from "@/components/utils/table-header-with-action";

const { Text } = Typography;

function ProductsPage() {
    const router = useRouter();

    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [tableData, setTableData] = useState([]);
    // const [filterValue, setFilterValue] = useState(null);

    const {
        data = [],
        error,
        loading,
        executeFetch,
    } = useFetch(
        process.env.NEXT_PUBLIC_HOST_API + process.env.NEXT_PUBLIC_LIST_PRODUCT,
        "post",
        {},
        false
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
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

    // get category list
    const {
        data: categoryList,
        error: categoryListError,
        loading: categoryListLoading,
        executeFetch: getCategoryList,
    } = useFetch(
        process.env.NEXT_PUBLIC_HOST_API +
            process.env.NEXT_PUBLIC_LIST_CATEGORY,
        "get",
        {},
        false
    );
    // delete data
    const {
        data: deleteData = {},
        error: deleteError,
        loading: deleteLoading,
        executeFetch: deleteExecuteFetch,
    } = useFetch(
        process.env.NEXT_PUBLIC_HOST_API +
            process.env.NEXT_PUBLIC_DELETE_PRODUCT,
        "post",
        {},

        false
    );

    // edit product element
    const handleEditItem = (id) => {
        router.push(`/product-management/product/edit-product?id=${id}`);
    };
    // delete item
    const handleDeleteItem = (id) => {
        Modal.confirm({
            title: "Are you sure about delete this product",
            content: <div>this product will be deleted forever !</div>,
            onOk() {
                deleteExecuteFetch({ id });
            },
        });
    };

    // useEffect for delete Item
    useEffect(() => {
        if (deleteData?.status === true) {
            executeFetch();
            message.success("Product has been deleted successfully!");
        } else if (deleteData?.status === false) {
            message.error(
                deleteError ?? "Something went wrong! Please try again later"
            );
        }
    }, [deleteData, deleteError, deleteLoading]);
    const Actions = ({ data }) => {
        const menu = (
            <Menu>
                <Menu.Item key="1">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleDeleteItem(data.id);
                        }}
                    >
                        <DeleteOutlined style={{ color: "#f70202" }} />
                    </a>
                </Menu.Item>
                <Menu.Item key="2">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleEditItem(data.id, data.image);
                        }}
                    >
                        <EditOutlined style={{ color: "#1dd3d5" }} />
                    </a>
                </Menu.Item>
                <Menu.Item key="3">
                    <Tooltip placement="top" title="Add Images">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(
                                    openDrawer(
                                        drawerType_AddImageToProperty,
                                        null,
                                        {
                                            productId: data.id,
                                            productName: data.name_EN,
                                        },
                                        false
                                    )
                                );
                            }}
                        >
                            <CameraOutlined style={{ color: "orange" }} />
                        </a>
                    </Tooltip>
                </Menu.Item>
                <Menu.Item key="4">
                    <Link
                        href={`/product-management/product/images?id=${data.id}&name=${data.name_EN}`}
                    >
                        <Tooltip placement="top" title="All Images">
                            <a href="#">
                                <IoMdImages
                                    style={{ color: "green", fontSize: 18 }}
                                />
                            </a>
                        </Tooltip>
                    </Link>
                </Menu.Item>
                <Menu.Item key="5">
                    <Link
                        href={`/product-management/product/products-property?id=${data.id}&name=${data.name_EN}`}
                    >
                        General Properties
                    </Link>
                </Menu.Item>
                <Menu.Item key="6">
                    <Link
                        href={`/product-management/product/special-adjective?id=${data.id}&name=${data.name_EN}`}
                    >
                        Special Product
                    </Link>
                </Menu.Item>
            </Menu>
        );
        return (
            <Space size="large">
                <Dropdown overlay={menu} trigger={["click"]}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            Actions
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Space>
        );
    };
    // table column
    const columns = [
        {
            title: "Product Image",
            dataIndex: "",
            key: "id",
            // width: "10%",
            render: (data) => {
                return (
                    <AntImage
                        src={process.env.NEXT_PUBLIC_HOST_API + data.image}
                        width={100}
                        height={100}
                        preview={true}
                    />
                );
            },
        },
        {
            title: "Product Name",
            dataIndex: "name_EN",
            key: "id",
            render: (data) => {
                if (data.length > 50)
                    return (
                        <React.Fragment key={data}>
                            {data.substring(0, 10)}
                        </React.Fragment>
                    );
            },
        },
        {
            title: () => {
                return (
                    <TableHeader
                        title={"Category Name"}
                        icon={<FilterFilled />}
                        isFilter={true}
                        reqUrl={process.env.NEXT_PUBLIC_LIST_CATEGORY}
                        requiredTableAction={executeFetch}
                    />
                );
            },

            dataIndex: "categoryName_EN",
            key: "id",
        },
        {
            title: "Model Name",
            dataIndex: "modelName",
            key: "id",
        },
        {
            title: "Brand Name",
            dataIndex: "brandNameEN",
            key: "id",
        },
        {
            title: "Price / Offer",
            dataIndex: "",
            key: "id",
            render: (data) => (
                <Space split={"/"}>
                    <Tooltip placement="top" title="Price">
                        <Text>{data.price}</Text>
                    </Tooltip>
                    <Tooltip
                        placement="top"
                        title="Offer"
                        // color={"#f00"}
                        arrowContent={null}
                    >
                        <Text code italic>
                            {data.offer}
                        </Text>
                    </Tooltip>
                </Space>
            ),
        },
        {
            title: "Action",
            dataIndex: "",
            key: "id",
            render: (data) => {
                return (
                    <Actions data={data} />
                    // <Space size="large" key={data.id}>
                    //   <a
                    //     href="#"
                    //     onClick={(e) => {
                    //       e.preventDefault();
                    //       handleDeleteItem(data.id);
                    //     }}
                    //   >
                    //     <DeleteOutlined style={{ color: "#f70202" }} />
                    //   </a>
                    //   <a
                    //     href="#"
                    //     onClick={(e) => {
                    //       e.preventDefault();
                    //       handleEditItem(data.id, data.image);
                    //     }}
                    //   >
                    //     <EditOutlined style={{ color: "#1dd3d5" }} />
                    //   </a>
                    //   <Tooltip placement="top" title="Add Images">
                    //     <a
                    //       href="#"
                    //       onClick={(e) => {
                    //         e.preventDefault();
                    //         dispatch(
                    //           openDrawer(
                    //             drawerType_AddImageToProperty,
                    //             null,
                    //             {
                    //               productId: data.id,
                    //               productName: data.name_EN,
                    //             },
                    //             false
                    //           )
                    //         );
                    //       }}
                    //     >
                    //       <CameraOutlined style={{ color: "orange" }} />
                    //     </a>
                    //   </Tooltip>
                    //   <Link
                    //     href={`/product-management/product/images?id=${data.id}&name=${data.name_EN}`}
                    //   >
                    //     <Tooltip placement="top" title="All Images">
                    //       <a href="#">
                    //         <IoMdImages style={{ color: "green", fontSize: 18 }} />
                    //       </a>
                    //     </Tooltip>
                    //   </Link>
                    //   {/* <a
                    //     href="#"
                    //     onClick={(e) => {
                    //       e.preventDefault();
                    //       dispatch(
                    //         openModal(
                    //           constants.modalType_LinkProductToProperty,
                    //           null,
                    //           { productId: data.id, productName: data.name_EN },
                    //           false
                    //         )
                    //       );
                    //     }}
                    //   >
                    //     General Property
                    //   </a> */}
                    //   <Link
                    //     href={`/product-management/product/products-property?id=${data.id}&name=${data.name_EN}`}
                    //   >
                    //     General Properties
                    //   </Link>
                    //   <Link
                    //     href={`/product-management/product/special-adjective?id=${data.id}&name=${data.name_EN}`}
                    //   >
                    //     Special Product
                    //   </Link>
                    // </Space>
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
            <Link href="/product-management/product/add-product">
                <Button style={{ margin: "10px 0" }}>Add New Product</Button>
            </Link>
            <Table
                rowKey={"id"}
                loading={loading}
                columns={columns}
                pagination={{
                    onChange: (page) => {
                        setCurrentPage(page);
                    },
                    total: data?.total,
                    current: currentPage,
                }}
                dataSource={tab_data?.data}
                size="small"
                onChange={(pagination, filters, sorter, extra) => {
                    console.log("filters", filters);
                    console.log(extra.currentDataSource)
                    console.log("filtersm");
                    let id = filters?.id;
                    if (id) {
                        console.log("MUST RELOD");
                        executeFetch({ catID: id[0] });
                        return null;
                    }
                }}
            />
        </Main>
    );
}

export default memo(ProductsPage);
