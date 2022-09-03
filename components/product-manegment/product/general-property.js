import { useRouter } from "next/router";
import { useEffect } from "react";
// layout
import Main from "../../layout/main";
// components
import { Button, message, Modal, Space, Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
} from "@ant-design/icons";
// redux
import { useDispatch } from "react-redux";
// redux actions
import { openModal } from "@/redux/modal/action";
// constants
import * as constants from "@/redux/modal/constants";
// hooks
import useFetch from "utils/useFetch";

function GeneralPropertiesPage() {
  const dispatch = useDispatch();

  const router = useRouter();

  const { id, name: attributeName } = router.query;

  // list general properties
  const { data, error, loading, executeFetch } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_LIST_GENERAL_PROPERTY,
    "post",
    { id },
    true
  );

  // useFetch for delete item
  const {
    data: deleteData = {},
    error: deleteError,
    loading: deleteLoading,
    executeFetch: deleteExecuteFetch,
  } = useFetch(
    process.env.NEXT_PUBLIC_HOST_API +
      process.env.NEXT_PUBLIC_DELETE_GENERAL_PROPERTY,
    "post",
    {},
    false
  );

  // delete item
  const handleDeleteItem = (id, name) => {
    Modal.confirm({
      title: "Are you sure about delete this General Property",
      content: <div>this General Property will be deleted forever.....!</div>,
      onOk() {
        deleteExecuteFetch({ id });
      },
    });
  };

  // edit item
  const handleEditItem = (id, attributeName, pId) => {
    dispatch(
      openModal(
        constants.modalType_AddGeneralProperty,
        executeFetch,
        { id, attributeName, pId },
        true
      )
    );
  };

  //useEffect for delete item
  useEffect(() => {
    if (deleteData?.status === true) {
      //refresh the table ....
      message.success("General property been deleted succeeefully !");
      executeFetch();
    } else if (deleteData?.status === false || deleteError) {
      Modal.info({
        title: "Something went wrong !",
        content: (
          <p>
            Some error happend while trying to delete this General Property.
            Please try again later.
          </p>
        ),
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  }, [deleteData, deleteError, deleteLoading]);

  // table column
  const columns = [
    {
      title: "Arabic Name",
      dataIndex: "name_AR",
      key: "id",
    },
    {
      title: "English Name",
      dataIndex: "name_EN",
      key: "id",
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
                handleEditItem(data.id, data.name_EN, data.propertyID);
              }}
            >
              <EditOutlined style={{ color: "#1dd3d5" }} />
            </a>
          </Space>
        );
      },
    },
  ];
  return (
    <Main>
      <div className="content_header">
        <Space split={<span> | </span>}>
          <h3>
            General Properties for{" "}
            <span style={{ textDecoration: "underline" }}>{attributeName}</span>{" "}
            Attribute
          </h3>
          <Button
            onClick={() =>
              dispatch(
                openModal(
                  constants.modalType_AddGeneralProperty,
                  executeFetch,
                  { attributeName, id },
                  false
                )
              )
            }
          >
            Add New General Property For {` ${attributeName}`} Attribute
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        rowKey={"id"}
        dataSource={data?.description}
        size="small"
        loading={loading}
      />
    </Main>
  );
}

export default GeneralPropertiesPage;
