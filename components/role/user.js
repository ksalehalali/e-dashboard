import { useDispatch } from "react-redux";
//components
import { Modal, Form,  Space } from "antd";
import { Table } from "ant-table-extensions";

import {
  DeleteOutlined,
  EditOutlined,

} from "@ant-design/icons";
// redux
// hooks
import useFetch from "../../utils/useFetch";
// layout
import Main from "../layout/main";

//style
function User() {

  //list role data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch("https://dashcommerce.click68.com/api/ListUser", "post",{PageSize:1000});

  // table column
  const columns = [
    {
      title: "First Name ",
      dataIndex: "firstName",
      key: "id",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "id",
    },
    {
      title: "phoneNumber",
      dataIndex: "phoneNumber",
      key: "id",
    },

    {
        title: "Actions",
        dataIndex: "",
        key: "id",
        render: (data) => {
          return (
              <a
                href={`/details?UserID=${data.id}`}
              >
        Details
              </a>
          );
        },
      },
  ];
  return (
    <Main>
     

      <Table columns={columns} dataSource={data?.description} size="small"  exportable   />
    </Main>
  );
}
export default User;
