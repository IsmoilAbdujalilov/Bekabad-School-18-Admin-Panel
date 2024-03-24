import { CSSProperties, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal, Table, Tooltip, Popconfirm, Form, Input, Spin } from "antd";

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
      key: "id",
      title: "ID",
      dataIndex: "id",
    },
    {
      key: "category",
      title: "Category",
      dataIndex: "category",
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

  const data = [
    {
      id: 1,
      key: "1",
      category: "Fruit",
    },
    {
      id: 2,
      key: "2",
      category: "Vegetable",
    },
  ];

  return (
    <>
      <Spin spinning={false}>
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

        <Table scroll={{ x: 1050 }} columns={columns} dataSource={data} />
      </Spin>
    </>
  );
};

export default Categories;
