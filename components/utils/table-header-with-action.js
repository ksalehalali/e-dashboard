import { CloseCircleFilled } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useFetch from "utils/useFetch";

const CTableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const TableHeader = ({
  title,
  icon,
  isFilter,
  reqUrl,
  requiredTableAction,
}) => {
  const [selectedID, setSelectedID] = useState(null);

  const {
    data: list,
    error: listError,
    loading: listLoading,
    executeFetch: getList,
  } = useFetch(process.env.NEXT_PUBLIC_HOST_API + reqUrl, "get", {}, false);

  const actionHandler = (id) => {
    if (id === selectedID) {
      setSelectedID(null);
    } else {
      setSelectedID(id);
    }
  };

  const filterMenu = (
    <Menu
      style={{ maxHeight: "300px", overflowY: "auto", width: "200px" }}
      onChange={(value) => {
        console.log(value);
      }}
    >
      {listLoading ? (
        <div
          style={{
            width: "200px",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>Loading ...</span>
        </div>
      ) : (
        <>
          {list?.description?.map((item) => (
            <Menu.Item
              key={item.id}
              //   value={item.id}
              onClick={() => actionHandler(item.id)}
              style={
                selectedID === item.id
                  ? { backgroundColor: "rgba(0,0,0,0.1)" }
                  : { backgroundColor: "transparent" }
              }
            >
              {item.name_EN}
            </Menu.Item>
          ))}
        </>
      )}
    </Menu>
  );

  useEffect(() => {
    if (!selectedID) {
      requiredTableAction();
    } else {
      requiredTableAction({ CatID: selectedID });
    }
  }, [selectedID]);

  return (
    <CTableHeader>
      <span>{title}</span>
      <Space>
        <Dropdown
          overlayStyle={{
            maxHeight: "100px",
            background: "red",
          }}
          trigger={["click"]}
          placement="bottomRight"
          onVisibleChange={(visible) => {
            console.log("visible", visible);
            if (visible === true) {
              if (!list || list?.description?.length === 0) {
                getList();
              }
            }
          }}
          overlay={filterMenu}
        >
          <a
            href="#"
            style={{ fontWeight: 800, color: selectedID ? "#1890ff" : "" }}
          >
            {icon}
          </a>
        </Dropdown>
        {selectedID && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedID(null);
            }}
          >
            <CloseCircleFilled />
          </a>
        )}
      </Space>
    </CTableHeader>
  );
};

export default TableHeader;
