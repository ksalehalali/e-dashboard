import { useState, useEffect } from "react";
// components
import { Table, column, Button } from "antd";
// layout
import Main from "../../components/layout/main";
// hooks
import useFetch from "../../utils/useFetch";
// redux
import { useDispatch, useSelector } from "react-redux";
// actions
import { testRedux } from "../../redux/test/actions";
import * as constants from "../../redux/modal/constants";

import { openModal } from "../../redux/modal/action";
function TablePage() {
  // const {} = useSelector((state) => state.modal);
  const dispacth = useDispatch();

  // const {
  //   data = [],
  //   error,
  //   loading,
  //   executeFetch,
  // } = useFetch("https://dashcommerce.click68.com/api/ListCategory", "get");

  const columns = [
    {
      title: "Name",
      dataIndex: "name_AR",
      key: "name_AR",
    },
  ];
  return (
    <Main>
      <h2>
        Hello Tables
        {/* <Table columns={columns} dataSource={data?.description} /> */}
      </h2>

      <Button onClick={() => dispacth(openModal(constants.modalType_AddRole))}>
        Change Text
      </Button>
    </Main>
  );
}

export default TablePage;
