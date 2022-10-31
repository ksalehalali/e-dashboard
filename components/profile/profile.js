import Main from "../layout/main";
import {Row,Col ,Avatar} from "antd";
import { UserOutlined } from '@ant-design/icons';

function ProfilePage(){
return(<Main>
   <Row>
    <Col span={24} >
<Row style={{ display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  backgroundColor: "#fff",
  boxShadow:" 0 20px 27px rgb(0 0 0 / 5%)",
  margin: "20px",
  padding: "20px",}}>
    <Col span={12}>
    <Avatar size={104} icon={<UserOutlined />} />

    </Col>
    <Col span={12}>Company Name</Col>
</Row>
    </Col>
    <Col span={24} style={{ display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  backgroundColor: "#fff",
  boxShadow:" 0 20px 27px rgb(0 0 0 / 5%)",
  margin: "20px",
  padding: "20px",}}>Products</Col>
  
   </Row>
    
    </Main>);
}
export default ProfilePage;