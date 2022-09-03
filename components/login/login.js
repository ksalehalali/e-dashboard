import Link from "next/link";

// components
import {
  Layout,
  Menu,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Switch,
  Alert,
} from "antd";

import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

// services
import axios from "axios";
import { useEffect, useState } from "react";

const { Title } = Typography;
const { Content } = Layout;

function LoginPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [cookies, setCookie] = useCookies(["user"]);

  // check if logged in already
  useEffect(() => {
    const user = cookies.user;
    if (user?.token) router.push("/");
  }, [cookies]);

  const onFinish = async (values) => {
    const url =
      process.env.NEXT_PUBLIC_HOST_API + process.env.NEXT_PUBLIC_LOGIN;

    setLoading(true);
    setError(null);
    const { data: res } = await axios.post(url, {
      ...values,
    });

    setLoading(false);
    if (res?.status === true) {
      setCookie(
        "user",
        {
          token: res.description.token,
          userName: res.description.userName,
          email: res.description.email,
          id: res.description.id,
        },
        {
          path: "/",
        }
      );

      router.push("/");
    } else {
      setError(res?.description?.message ?? "Something went wrong.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Content className="signin">
      <Row gutter={[24, 0]} justify="center" align="center">
        <Col xs={{ span: 24 }} lg={{ span: 6 }} md={{ span: 12 }}>
          <Title className="mb-15">Login</Title>
          {error && <Alert description={error} showIcon type="error" />}
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            className="row-col"
          >
            <Form.Item
              label="Email"
              name="UserName"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                loading={loading}
              >
                SIGN IN
              </Button>
            </Form.Item>
            <p className="font-semibold text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-dark font-bold">
                Sign Up
              </Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default LoginPage;
