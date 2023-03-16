import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Row,
  Button,
  Divider,
  Modal,
  Input,
  Upload,
  message,
  Table,
  Spin,
  Select,
} from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  MailOutlined,
  SendOutlined,
  SafetyOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import { SERVER_ERROR } from "../utils/messages";
import "./page.css";

const DocumentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [acid, setAcid] = useState("");
  const [doc_cid, setDocCid] = useState("");
  const [doc_name, setDocName] = useState("");
  const [doc_type, setDocType] = useState("");
  const [doc_file_name, setDocFileName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { account } = useWeb3React();

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
        setDocCid(info.file.response.data[0]);
        setDocFileName(info.file.name);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const columns = [
    {
      title: "ACID",
      dataIndex: "acid",
      sorter: {
        compare: (a, b) => a.acid - b.acid,
        multiple: 1,
      },
    },

    {
      title: "Document",
      dataIndex: "document",
      sorter: {
        compare: (a, b) => a.document - b.document,
        multiple: 2,
      },
    },
    {
      title: "Document Hash",
      dataIndex: "document_hash",
      sorter: {
        compare: (a, b) => a.document_hash - b.document_hash,
        multiple: 3,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_IP_ADDRESS}/v1/composedoc`,
        {
          Acid: acid,
          DocumentCid: doc_cid,
          DocumentName: doc_name,
          DocumentType: doc_type,
          DocumentFileName: doc_file_name,
          From: account,
          Status: 0,
        }
      );

      if (res.data.status_code === 200) {
        message.success(res.data.msg, 5);
        updateData();
      }
    } catch (e) {
      message.error(SERVER_ERROR, 5);
      console.log(e);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const updateData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_IP_ADDRESS}/v1/getlistdocument`
      );
      let tmp = [];

      console.log("------------", res.data.data);

      for (let item of res.data.data) {
        tmp.push({
          acid: item.Acid,
          document:
            item.DocumentType +
            "+" +
            item.DocumentFileName +
            "+" +
            item.DocumentName,
          document_hash: item.DocumentCid,
          status: "inbox",
        });
      }
      setData(tmp);
      setLoading(false);
    } catch (e) {
      message.error(SERVER_ERROR, 5);
      console.log(e);
    }
  };
  useEffect(() => {
    updateData();
  }, []);

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
          <Input
            className="margin-top-20"
            placeholder="Please acid number."
            value={acid}
            onChange={(e) => setAcid(e.target.value)}
          />
          <Input
            className="margin-top-10"
            placeholder="Please document name."
            value={doc_name}
            onChange={(e) => setDocName(e.target.value)}
          />
          <Select
            className="producer-select margin-top-20"
            value={doc_type}
            onChange={(value) => {
              setDocType(value);
            }}
            options={[
              {
                label: "INV",
                value: "INV",
              },
              {
                label: "MATS",
                value: "MATS",
              },
              {
                label: "CINS",
                value: "CINS",
              },
              {
                label: "AWBC",
                value: "AWBC",
              },
            ]}
          />
          <Upload {...props}>
            <Button
              icon={<UploadOutlined />}
              type="primary"
              shape="round"
              size="large"
              className="margin-left-8 margin-top-20"
            >
              Click to Upload Document
            </Button>
          </Upload>
        </Modal>
      </Spin>
    </>
  );
};

export default DocumentManagement;
