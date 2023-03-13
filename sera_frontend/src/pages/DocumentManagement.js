import React, { useState, useEffect } from "react";
import {
  Row,
  Button,
  Divider,
  Avatar,
  List,
  Skeleton,
  Modal,
  Input,
  Upload,
  message,
} from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  MailOutlined,
  SendOutlined,
  SafetyOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import "./page.css";

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const DocumentManagement = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const props = {
    name: "document_account",
    action: `${process.env.REACT_APP_IP_ADDRESS}/v1/uploaddocument`,
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setData(res.results);
        setList(res.results);
      });
  }, []);
  const onLoadMore = () => {
    setLoading(true);
    setList(
      data.concat(
        [...new Array(count)].map(() => ({
          loading: true,
          name: {},
          picture: {},
        }))
      )
    );
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        const newData = data.concat(res.results);
        setData(newData);
        setList(newData);
        setLoading(false);
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event("resize"));
      });
  };
  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;
  return (
    <>
      <Row className="margin-top-20">
        <span className="title-style">Document Management</span>
      </Row>
      <Divider />
      <Row justify="left">
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          size="large"
          className="margin-left-8"
          onClick={showModal}
        >
          Compose
        </Button>
        <Button
          type="primary"
          shape="round"
          icon={<InboxOutlined />}
          size="large"
          className="margin-left-8"
        >
          Inbox
        </Button>
        <Button
          type="primary"
          shape="round"
          icon={<MailOutlined />}
          size="large"
          className="margin-left-8"
        >
          Drafts
        </Button>
        <Button
          type="primary"
          shape="round"
          icon={<SendOutlined />}
          size="large"
          className="margin-left-8"
        >
          Sent
        </Button>
        <Button
          type="primary"
          shape="round"
          icon={<SafetyOutlined />}
          size="large"
          className="margin-left-8"
        >
          Archive
        </Button>
        <List
          className="margin-top-20 width-100"
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a key="list-loadmore-edit">edit</a>,
                <a key="list-loadmore-more">more</a>,
              ]}
            >
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={<Avatar src={item.picture.large} />}
                  title={<a href="https://ant.design">{item.name?.last}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
                <div>content</div>
              </Skeleton>
            </List.Item>
          )}
        />
      </Row>
      <Modal
        title="Compose new Document"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input placeholder="Input ACID number" className="margin-top-20" />
        <Upload {...props}>
          <Button
            icon={<UploadOutlined />}
            type="primary"
            shape="round"
            size="large"
            className="float-left margin-left-8 margin-top-20"
          >
            Click to Upload Document
          </Button>
        </Upload>
      </Modal>
    </>
  );
};

export default DocumentManagement;
