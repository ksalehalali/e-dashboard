import { memo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
// components
import Main from "@/components/layout/main";
import {
  CameraOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Space, Table, Image as AntImage, Tooltip, Modal, message } from "antd";
// hooks
import useFetch from "utils/useFetch";
// redux
import { useDispatch } from "react-redux";
import { openDrawer } from "@/redux/drawer/action";
import * as constnats from "@/redux/drawer/constants";

function ProductImagesPage() {
  const router = useRouter();

  const dispatch = useDispatch();

  const { id, name } = router.query;

  // get product images
  const { data, error, loading, executeFetch } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_LIST_PRODUCT_IMAGES_COLOR_SIZE,
    "post",
    { id },
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
      process.env.NEXT_PUBLIC_DELETE_PRODUCT_IMAGES_COLOR_SIZE,
    "post",
    {},

    false
  );

  const handleDeleteItem = useCallback((id) => {
    Modal.confirm({
      title: "Are you sure about delete this product images",
      content: <div>this product images will be deleted forever !</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  }, []);

  // useEffects
  useEffect(() => {
    if (id) {
      executeFetch({ id });
    }
  }, [id]);

  // useEffect for delete Item
  useEffect(() => {
    if (deleteData?.status === true) {
      executeFetch();
      message.success("Product images has been deleted successfully!");
    } else if (deleteData?.status === false) {
      message.error(
        deleteError ?? "Something went wrong! Please try again later"
      );
    }
  }, [deleteData, deleteError, deleteLoading]);

  const columns = [
    {
      title: "Product Image",
      dataIndex: "",
      key: "id",
      width: `${90 * 4}px`,
      render: (data) => {
        return (
          <AntImage.PreviewGroup>
            <Space>
              {data?.image1 && (
                <AntImage
                  src={process.env.NEXT_PUBLIC_HOST_API + data?.image1}
                  width={80}
                  height={80}
                />
              )}
              {data?.image2 && (
                <AntImage
                  src={process.env.NEXT_PUBLIC_HOST_API + data?.image2}
                  width={80}
                  height={80}
                />
              )}
              {data?.image3 && (
                <AntImage
                  src={process.env.NEXT_PUBLIC_HOST_API + data?.image3}
                  width={80}
                  height={80}
                />
              )}
              {data?.image4 && (
                <AntImage
                  src={process.env.NEXT_PUBLIC_HOST_API + data?.image4}
                  width={80}
                  height={80}
                />
              )}
            </Space>
          </AntImage.PreviewGroup>
        );
      },
    },
    {
      width: "30%",
      title: "Product Name",
      dataIndex: "product",
      key: "id",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "id",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "id",
      render: (data) => {
        return (
          <Space>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteItem(data.id);
              }}
            >
              <DeleteOutlined style={{ color: "#f70202" }} />
            </a>
            {/* <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // handleEditItem(data.id, data.image);
              }}
            >
              <EditOutlined style={{ color: "#1dd3d5" }} />
            </a> */}
            <Tooltip placement="top" title="Add Images">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    openDrawer(
                      constnats.drawerType_AddImageToProperty,
                      executeFetch,
                      {
                        id: data.id,
                        productId: data.productID,
                        productName: data.name_EN,
                      },
                      true
                    )
                  );
                }}
              >
                <EditOutlined style={{ color: "#1dd3d5" }} />
              </a>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <Main>
      {/* <Link href="/product-management/product/add-product">
        <Button>Add New Product</Button>
      </Link> */}
      <h3>{name} product images</h3>
      <Table
        rowKey={"id"}
        loading={loading}
        columns={columns}
        dataSource={data?.description}
        size="small"
      />
    </Main>
  );
}

export default memo(ProductImagesPage);
