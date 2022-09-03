// components
import { PlusOutlined } from "@ant-design/icons";

function UploadFileComponent({ text }) {
  return (
    <div
      style={{
        textAlign: "center",
        border: "1px solid rgba(0, 0, 0, 0.5)",
        width: 200,
        height: 200,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PlusOutlined />
      <div style={{ marginTop: 9 }}>{text}</div>
    </div>
  );
}

export default UploadFileComponent;
