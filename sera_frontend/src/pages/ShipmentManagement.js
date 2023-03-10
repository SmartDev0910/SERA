import React, { useState, useEffect } from "react";
import { Row, Button, Divider, Avatar, List, Skeleton, Modal } from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  MailOutlined,
  SendOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import "./page.css";

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const ShipmentManagement = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <span className="title-style">Shipment Management</span>
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
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default ShipmentManagement;
