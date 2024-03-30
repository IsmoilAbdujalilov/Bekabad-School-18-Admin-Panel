import { useState } from "react";
import { styles } from "services";
import { get, truncate } from "lodash";
import { useDelete, useGet } from "hooks";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Spin,
  Form,
  Flex,
  Modal,
  Table,
  Input,
  Switch,
  Button,
  Tooltip,
  message,
  Popconfirm,
} from "antd";

const News = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchCurrentParams, setSearchCurrentParams] = useSearchParams();

  const onFinish = () => {};

  const onCancel = () => setIsModalOpen(false);

  const { data, isLoading } = useGet({
    path: "/news",
    queryKey: "news",
  });

  const changePaginateCurrent = (params: {}) => {
    for (let param of Object.entries(params).reverse()) {
      setSearchCurrentParams((params) => {
        params.set(param[0], String(param[1]));
        return params;
      });
    }
  };

  const { mutate } = useDelete({
    path: "/news",
    queryKey: "news",
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Success Delete Item",
      });
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Error No Delete Item",
      });
    },
  });

  const onOk = () => {
    const params = { limit: "1", page: "4" };
    console.log(searchParams.get("limit"));
    for (let param of Object.entries(params)) {
      setSearchParams((params) => {
        params.set(param[0], param[1]);
        return params;
      });
    }

    setIsModalOpen(false);
  };

  const columns = [
    {
      key: "title",
      title: "Title",
      render: ({ title }: { title: string }) => {
        return (
          <Tooltip title={title}>
            {truncate(title, {
              length: 15,
              omission: "...",
            })}
          </Tooltip>
        );
      },
    },
    {
      key: "text",
      title: "Text",
      render: ({ text }: { text: string }) => {
        return (
          <Tooltip title={text}>
            {truncate(text, {
              length: 30,
              omission: "...",
            })}
          </Tooltip>
        );
      },
    },
    {
      key: "description",
      title: "Description",
      render: ({ description }: { description: string }) => {
        return (
          <Tooltip title={description}>
            {truncate(description, {
              length: 30,
              omission: "...",
            })}
          </Tooltip>
        );
      },
    },
    {
      key: "switch",
      title: "Active",
      render: ({ isPublic }: { isPublic: boolean }) => {
        return <Switch checked={isPublic} />;
      },
    },
    {
      key: "edit",
      title: "Edit",
      render: () => {
        return (
          <Tooltip title="Edit">
            <EditOutlined
              style={styles.editStyle}
              onClick={() => setIsModalOpen(true)}
            />
          </Tooltip>
        );
      },
    },
    {
      key: "delete",
      title: "Delete",
      render: ({ _id }: { _id: string }) => {
        return (
          <Tooltip title="Delete">
            <Popconfirm
              okText="ok"
              title="Delete"
              cancelText="no"
              onConfirm={() => mutate(_id)}
              placement="topLeft"
            >
              <DeleteOutlined style={styles.deleteStyle} />
            </Popconfirm>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Spin spinning={isLoading}>
      {contextHolder}
      <Modal
        onOk={onOk}
        open={isModalOpen}
        onCancel={onCancel}
        title="Edit Category"
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Category" name="category">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Flex align="center" justify="flex-end">
        <Button className="login-form__flex" type="primary">
          Create
        </Button>
      </Flex>
      <Table
        columns={columns}
        scroll={{ x: 1050 }}
        dataSource={get(data, "data", [])}
        onChange={(value) => changePaginateCurrent(value)}
        pagination={{
          pageSize: 6,
          current: Number(searchCurrentParams.get("current")) || 1,
        }}
      />
    </Spin>
  );
};

export default News;
