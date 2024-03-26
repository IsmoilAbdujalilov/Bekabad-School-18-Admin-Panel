import { get } from "lodash";
import { usePost } from "hooks";
import { getToken } from "store/register";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Form, Input, message } from "antd";
import {
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  type loginValueTypes = {
    username: string;
    password: string;
  };

  const { mutate } = usePost({
    queryKey: "auth",
    path: "/auth/login",
    onSuccess: (data) => {
      dispatch(
        getToken({
          username: get(data, "data.username"),
          token: get(data, "token"),
        })
      );
      messageApi.open({
        type: "loading",
        key: "updatable",
        content: "Loading...",
      });
      setTimeout(() => {
        message.open({
          duration: 2,
          type: "success",
          key: "updatetable",
          content: "Loaded",
        });
        navigate("/");
      }, 1000);
    },
    onError: () => {
      messageApi.open({
        type: "loading",
        key: "updatable",
        content: "Loading...",
      });
      setTimeout(() => {
        message.open({
          duration: 2,
          type: "error",
          key: "updatetable",
          content: "Loaded",
        });
      }, 1000);
    },
  });

  return (
    <section className="registration">
      {contextHolder}
      <div className="container">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={(values: loginValueTypes) => mutate(values)}
        >
          <div className="login-form-avatar">
            <Avatar icon={<UserOutlined />} size={60} />
          </div>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              placeholder="Username"
              prefix={<UserOutlined className="site-form-item-icon" />}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              iconRender={(visible: boolean) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Button
            block
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Sign in
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default Login;
