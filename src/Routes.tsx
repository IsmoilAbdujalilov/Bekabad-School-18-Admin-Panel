import { useEffect } from "react";
import { storage } from "services";
import type { MenuProps } from "antd";
import { useState, CSSProperties } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Flex, Layout, Menu, Button, theme, Avatar, Dropdown } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  BookOutlined,
  StarOutlined,
  GroupOutlined,
  LogoutOutlined,
  SettingOutlined,
  ProductOutlined,
  SnippetsOutlined,
  MenuFoldOutlined,
  BarChartOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const Routes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/");
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (!storage.get("token")) {
      navigate("/pages/login");
      return;
    }
  }, []);

  const { Header, Sider, Content } = Layout;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const headerStyle: CSSProperties = {
    top: 0,
    padding: 0,
    position: "sticky",
    paddingRight: "25px",
    background: colorBgContainer,
  };

  const buttonStyle: CSSProperties = {
    width: 64,
    height: 64,
    fontSize: "16px",
  };

  const contentStyle: CSSProperties = {
    padding: 24,
    height: "100vh",
    overflow: "initial",
    margin: "24px 16px",
    background: colorBgContainer,
    borderRadius: borderRadiusLG,
  };

  const siderStyle: CSSProperties = {
    top: 0,
    left: 0,
    bottom: 0,
    height: "100vh",
    overflow: "auto",
    position: "sticky",
  };

  type itemsType = {
    key: string;
    label: string;
    icon: React.ReactNode;
  };

  const pages: itemsType[] = [
    {
      key: "",
      label: "Home",
      icon: <HomeOutlined />,
    },
    {
      key: "news",
      label: "News",
      icon: <GroupOutlined />,
    },
    {
      key: "course",
      label: "Course",
      icon: <SnippetsOutlined />,
    },
    {
      key: "event",
      label: "Events",
      icon: <BarChartOutlined />,
    },
    {
      key: "teacher",
      label: "Teacher",
      icon: <StarOutlined />,
    },
    {
      key: "library",
      label: "Library",
      icon: <BookOutlined />,
    },
  ];

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link to="/pages/settings">
          <Flex gap="15px">
            <SettingOutlined />
            <span>Settings</span>
          </Flex>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to="/pages/login">
          <Flex gap="15px">
            <LogoutOutlined />
            <span>Exit</span>
          </Flex>
        </Link>
      ),
    },
  ];

  const avatarStyle: CSSProperties = {
    cursor: "pointer",
  };

  const getRoute = (path: string) => {
    if (path.split("").length > 0) navigate(`/pages/${path}`);
    else navigate(path);
  };

  const renderUserName = () => {
    if (storage.get("token")) {
      return (storage.get("username") as string).split("").slice(0, 1);
    } else {
      return <UserOutlined />;
    }
  };

  return (
    <Layout>
      <Sider
        collapsible
        trigger={null}
        style={siderStyle}
        collapsed={collapsed}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          items={pages}
          onClick={(item) => getRoute(item.key)}
          defaultOpenKeys={[path[path.length - 1]]}
          defaultSelectedKeys={[path[path.length - 1]]}
        />
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <Flex justify="space-between" align="center">
            <Button
              type="text"
              style={buttonStyle}
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
            <Dropdown menu={{ items }} placement="bottomLeft">
              <Avatar size={48} style={avatarStyle} icon={renderUserName()} />
            </Dropdown>
          </Flex>
        </Header>
        <Content style={contentStyle}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Routes;
