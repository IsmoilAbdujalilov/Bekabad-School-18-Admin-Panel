import { get } from "lodash";
import { api } from "services";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGet, usePut, useUploadImage } from "hooks";
import { CloudUploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Spin, Switch, Upload, message } from "antd";

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
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

  // const { data, isLoading } = useGet({
  //   queryKey: "news",
  //   path: `/news/${id}`,
  // });

  useEffect(() => {
    api.get(`/news/${id}`).then((res) => {
      return setData({ ...get(res, "data.data", {}) });
    });
  }, []);

  const newsPost = usePut({
    queryKey: "news",
    path: `/news/${id}`,
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Success update Item",
      });
      navigate("/pages/news");
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Error no update Item",
      });
    },
  });

  const onFinish = (values: newsTypes) => {
    const newsData = {
      text: values.text || get(data, "text"),
      title: values.title || get(data, "title"),
      image: inputImageFile || get(data, "image"),
      isPublic: values.isPublic || get(data, "isPublic"),
      description: values.description || get(data, "description"),
    };

    newsPost.mutate(newsData);
  };

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
    <Form
      layout="vertical"
      className="login-form"
      onFinish={(values: newsTypes) => onFinish(values)}
    >
      <Spin spinning={false}>
        {contextHolder}
        <Form.Item style={{ margin: 0 }}>
          <Form.Item
            name="title"
            label="Title"
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
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
            style={{
              margin: "0 8px",
              display: "inline-block",
              width: "calc(50% - 8px)",
            }}
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
            <Input defaultValue={get(data, "data.description")} />
          </Form.Item>
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
          <Input.TextArea defaultValue={get(data, "data.text")} />
        </Form.Item>
        <Form.Item
          label="Public"
          name="isPublic"
          rules={[
            {
              type: "boolean",
              message: "Please switch your Active",
            },
          ]}
        >
          <Switch defaultValue={get(data, "data.isPublic")} />
        </Form.Item>
        <Form.Item
          name="image"
          label="Upload"
          rules={[
            {
              type: "object",
              message: "Please upload your image",
            },
          ]}
        >
          <Upload
            multiple={false}
            isImageUrl={get(data, "data.image")}
            listType="picture-card"
            beforeUpload={(file: File) => {
              uploadImage(file);
              return false;
            }}
          >
            <CloudUploadOutlined style={{ fontSize: "25px" }} />
          </Upload>
        </Form.Item>
        <Button block type="primary" htmlType="submit">
          Send your news
        </Button>
      </Spin>
    </Form>
  );
};

export default EditNews;
