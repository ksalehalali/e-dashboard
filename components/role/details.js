import { useDispatch } from "react-redux";
//components
import { Modal, Form,  Space } from "antd";
import { Table } from "ant-table-extensions";
import { useRouter } from "next/router";


// hooks
import useFetch from "../../utils/useFetch";
// layout
import Main from "../layout/main";

//style
function Details() {
    const router=useRouter();
const {UserID}=router.query;
  //list role data
  const {
    data = [],
    error,
    loading,
    executeFetch,
  } = useFetch("https://dashcommerce.click68.com/api/DetalByUser", "post",{UserID,PageSize:1000});

  // table column
  const columns = [
    {
      title: "First Name ",
      dataIndex: "firstName",
      key: "name",
    },
    // {
    //   title: "Last Name",
    //   dataIndex: "lastName",
    //   key: "id",
    // },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "id",
    // },
    // {
    //   title: "phoneNumber",
    //   dataIndex: "phoneNumber",
    //   key: "id",
    // },

 
  ];
  return (
    <Main>
     

      <Table columns={columns} dataSource={data?.description} size="small"     />
    </Main>
  );
}
export default Details;
