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
  Table,
  Spin,
} from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  MailOutlined,
  SendOutlined,
  SafetyOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ipfs from "../ipfs";

import "./page.css";

const DocumentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buffer, setBuffer] = useState("");
  const [ipfsHash, setIpfsHash] = useState(null);

  const columns = [
    {
      title: "Purchase Order ID",
      dataIndex: "pur_order_id",
      sorter: {
        compare: (a, b) => a.pur_order_id - b.pur_order_id,
        multiple: 1,
      },
    },
    {
      title: "Importer",
      dataIndex: "importer",
      sorter: {
        compare: (a, b) => a.importer - b.importer,
        multiple: 4,
      },
    },
    {
      title: "Delivery term",
      dataIndex: "delivery_term",
    },
    {
      title: "Payment term",
      dataIndex: "payment_term",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const uploadFile = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => convertToBuffer(reader);
  };

  const convertToBuffer = async (reader) => {
    //file is converted to a buffer to prepare for uploading to IPFS
    const buff = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    setBuffer({ buff });
  };

  const onUploadDoc = async (e) => {
    e.preventDefault();

    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
    await ipfs.add(buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash);
      //setState by setting ipfsHash to ipfsHash[0].hash
      setIpfsHash({ ipfsHash: ipfsHash[0].hash });
    }); //await ipfs.add
  }; //onSubmit

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
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
        </Row>
        <Table
          className="margin-top-20"
          columns={columns}
          dataSource={data}
          pagination={false}
        />
        <Modal
          title="Compose new Document"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Input placeholder="Input ACID number" className="margin-top-20" />
          <form onSubmit={onUploadDoc}>
            <input type="file" onChange={uploadFile} />
            <Button
              icon={<UploadOutlined />}
              type="primary"
              shape="round"
              size="large"
              className="float-left margin-left-8 margin-top-20"
            >
              Click to Upload Document
            </Button>
          </form>
        </Modal>
      </Spin>
    </>
  );
};

export default DocumentManagement;
