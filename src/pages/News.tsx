import { useGet } from "hooks";
import { get, truncate } from "lodash";
import { CSSProperties, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Modal,
  Form,
  Spin,
  Table,
  Input,
  Switch,
  Tooltip,
  Popconfirm,
} from "antd";

const News = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchCurrentParams, setSearchCurrentParams] = useSearchParams();

  const { data, isLoading } = useGet({
    path: "/news",
    queryKey: "news",
  });

  const editStyle: CSSProperties = {
    color: "green",
    cursor: "pointer",
    fontSize: "18px",
    marginLeft: "5px",
  };

  const deleteStyle: CSSProperties = {
    color: "red",
    fontSize: "18px",
    cursor: "pointer",
    marginLeft: "5px",
  };

  const deleteAction = (id: number) => {
    console.log(id);
  };

  const onFinish = () => {};

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

  const onCancel = () => setIsModalOpen(false);

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
              style={editStyle}
              onClick={() => setIsModalOpen(true)}
            />
          </Tooltip>
        );
      },
    },
    {
      key: "delete",
      title: "Delete",
      render: ({ id }: { id: number }) => {
        return (
          <Tooltip title="Delete">
            <Popconfirm
              okText="ok"
              title="Delete"
              cancelText="no"
              onConfirm={() => deleteAction(id)}
              placement="topLeft"
            >
              <DeleteOutlined style={deleteStyle} />
            </Popconfirm>
          </Tooltip>
        );
      },
    },
  ];

  const changePaginateCurrent = (params: {}) => {
    for (let param of Object.entries(params).reverse()) {
      setSearchCurrentParams((params) => {
        params.set(param[0], String(param[1]));
        return params;
      });
    }
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <Modal
          onOk={onOk}
          open={isModalOpen}
          onCancel={onCancel}
          title="Edit Category"
        >
          <Form
            fields={[
              {
                value: "Fruit",
                name: ["category"],
              },
            ]}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item label="Category" name="category">
              <Input />
            </Form.Item>
          </Form>
        </Modal>

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
    </>
  );
};

export default News;
