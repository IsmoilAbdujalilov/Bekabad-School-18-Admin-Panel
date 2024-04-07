import { useState } from "react";
import { styles } from "services";
import { get, truncate } from "lodash";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDelete, useGet, usePost, useUploadImage } from "hooks";
import {
  EditOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import {
  Form,
  Flex,
  Modal,
  Table,
  Input,
  Switch,
  Upload,
  Button,
  Avatar,
  Tooltip,
  message,
  Popconfirm,
} from "antd";

const News = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [_, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchCurrentParams, setSearchCurrentParams] = useSearchParams();
  const [inputImageFile, setInputImageFile] = useState<File | undefined>();

  type newsTypes = {
    image: File;
    text: string;
    title: string;
    views: string;
    isPublic: boolean;
    description: string;
    _id: number | string;
  };

  const newsPost = usePost({
    path: "/news",
    queryKey: "news",
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Success Create Item",
      });
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["news"] });
      form.resetFields();
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Error No Create Item",
      });
    },
  });

  const onFinish = (values: newsTypes) => {
    const formData = new FormData();
    formData.append("text", values.text);
    formData.append("title", values.title);
    formData.append("image", `${inputImageFile}`);
    formData.append("isPublic", `${values.isPublic}`);
    formData.append("description", values.description);

    newsPost.mutate(formData);
  };

  const onCancel = () => setIsModalOpen(false);

  const { data, isLoading } = useGet({
    path: "/news",
    queryKey: "news",
  });

  const renderData = () => {
    if (data?.data?.length > 0) {
      return get(data, "data", []);
    } else {
      return [{}];
    }
  };

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
      key: "image",
      title: "Avatar",
      render: ({ image }: { image: string }) => {
        return (
          <>
            <Avatar src={image} />
          </>
        );
      },
    },
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
        return (
          <>
            <Switch checked={isPublic} />
          </>
        );
      },
    },
    {
      key: "edit",
      title: "Edit",
      render: ({ _id }: { _id: string }) => {
        return (
          <Tooltip title="Edit">
            <EditOutlined
              style={styles.editStyle}
              onClick={() => navigate(`/pages/news/${_id}`)}
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

  const sendUploadImage = useUploadImage({
    path: "/upload/image",
    queryKey: "upload-image",
    onSuccess: ({ url }: any) => {
      setInputImageFile(url);
      messageApi.open({
        type: "success",
        content: "Success create upload image",
      });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Error no upload image",
      });
    },
  });

  const uploadImage = (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    sendUploadImage.mutate(formData);
  };

  return (
    <>
      {contextHolder}
      <Modal
        onOk={onOk}
        open={isModalOpen}
        onCancel={onCancel}
        title="Create category"
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values: newsTypes) => onFinish(values)}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              {
                type: "string",
                required: true,
                message: "Please input your Title!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                type: "string",
                required: true,
                message: "Please input your Description!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="text"
            label="Text"
            rules={[
              {
                type: "string",
                required: true,
                message: "Please input your Text!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Public"
            name="isPublic"
            rules={[
              {
                required: true,
                type: "boolean",
                message: "Please switch your Active",
              },
            ]}
          >
            <Switch defaultValue={false} />
          </Form.Item>
          <Form.Item
            name="image"
            label="Upload"
            rules={[
              {
                type: "object",
                required: true,
                message: "Please upload your image",
              },
            ]}
          >
            <Upload
              multiple={false}
              listType="picture-card"
              beforeUpload={(file: File) => {
                uploadImage(file);
                return false;
              }}
            >
              <CloudUploadOutlined style={{ fontSize: "25px" }} />
            </Upload>
          </Form.Item>
          <Flex align="center" justify="flex-end">
            <Button type="primary" htmlType="submit">
              Send your news
            </Button>
          </Flex>
        </Form>
      </Modal>
      <Flex align="center" justify="flex-end">
        <Button
          type="primary"
          className="login-form__flex"
          onClick={() => setIsModalOpen(true)}
        >
          Create
        </Button>
      </Flex>
      <Table
        columns={columns}
        loading={isLoading}
        scroll={{ x: 1050 }}
        dataSource={renderData()}
        onChange={(value) => changePaginateCurrent(value)}
        pagination={{
          pageSize: 5,
          current: Number(searchCurrentParams.get("current")) || 1,
        }}
      />
    </>
  );
};

export default News;
