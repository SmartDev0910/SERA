import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { Multicall } from "ethereum-multicall";
import { useWeb3React } from "@web3-react/core";
import {
  Row,
  Button,
  Divider,
  Modal,
  Input,
  Upload,
  message,
  Table,
  Tag,
  Badge,
  Typography,
  Spin,
  Select,
  Steps,
  Card,
  Descriptions,
  Col
} from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  MailOutlined,
  SendOutlined,
  UploadOutlined,
  DownloadOutlined,
  CloseOutlined,
  FileAddOutlined,
  StepBackwardOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import _default from "antd/es/time-picker";
import provAbi from "../abis/provenanceAbi.json";
import trackAbi from "../abis/trackingAbi.json";
import { SERVER_ERROR, TRANSACTION_ERROR } from "../utils/messages";
import "./page.css";

let doc_id = 0;

const DocumentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [acid, setAcid] = useState("");
  const [upload_id, setUploadID] = useState("");
  const [seal_msg, setSealMsg] = useState("");
  const [seal_ipfs, setSealIpfs] = useState("");
  const [doc_cid, setDocCid] = useState("");
  const [doc_partner, setDocPartner] = useState("");
  const [busPartner, setBusPartner] = useState("")
  const [busPartnerOp, setBusPartnerOp] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownModalOpen, setIsDownModalOpen] = useState(false);
  const [documentItems, setDocumentItems] = useState([{ doc_id: doc_id++ }]);
  const [document, setDocument] = useState(null);
  const { account } = useWeb3React();
  let ProvContract = null;
  const steps = [
    {
      title: 'Envelope',
    },
    {
      title: 'Seal',
    },
    {
      title: 'Transfer',
    },
  ];

  const docTypeOp = [
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
  ];

  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle = {
    textAlign: 'center',
    marginTop: 16,
  };

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
        setDocumentItems(
          documentItems.map((it) =>
            it.doc_id !== upload_id
              ? it
              : {
                ...it,
                doc_cid: info.file.response.data[0],
                doc_file_name: info.file.name
              }
          ))
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const columns = [
    {
      title: "Partner",
      dataIndex: "partner",
      sorter: {
        compare: (a, b) => a.partner - b.partner,
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
      dataIndex: "cid",
      sorter: {
        compare: (a, b) => a.cid - b.cid,
        multiple: 3,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSeal = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_IP_ADDRESS}/v1/composedoc`,
        {
          Message: seal_msg,
          Document: JSON.stringify(documentItems),
          From: account,
          Status: 0,
        }
      );

      if (res.data.status_code === 200) {
        message.success("Sealed the document successfully", 5);
        setSealIpfs(res.data.data)
        next();
      }
    } catch (e) {
      message.error(SERVER_ERROR, 5);
      console.log(e);
      setLoading(false)
    }
    setLoading(false)
  };

  const handleTransfer = async () => {
    setLoading(true)
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    let TraContract = new ethers.Contract(
      process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
      trackAbi,
      myProvider.getSigner()
    );
    await TraContract.transferDocument(busPartner, seal_ipfs)
      .then((tx) => {
        return tx.wait().then(
          async (receipt) => {
            // This is entered if the transaction receipt indicates success
            message.success("Transfered a new document successfully.", 5);
            await setLoading(false);
            setIsModalOpen(false);
            updateData("inbox");
            return true;
          },
          (error) => {
            message.error(TRANSACTION_ERROR, 5);
            console.log(error);
          }
        );
      })
      .catch((error) => {
        message.error(TRANSACTION_ERROR, 5);
        console.log(error);
        setLoading(false);
      });
    setLoading(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const addDocument = () => {
    let tmp = [
      ...documentItems,
      {
        doc_id: doc_id++,
        doc_cid: "",
        doc_file_name: "",
        doc_blnum: "",
        doc_name: "",
        doc_type: []
      },
    ];
    setDocumentItems([...tmp]);
  };

  const removeDocument = (docId) => {
    setDocumentItems([...documentItems.filter((item) => item.doc_id !== docId)]);
  };

  const convertColor = (type) => {
    switch (type) {
      case "INV":
        return "magenta";
      case "MATS":
        return "red";
      case "CINS":
        return "volcano";
      case "AWBC":
        return "geekblue";
      default:
        return "geekblue";
    }
  }

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
        color={convertColor(value)}
      >
        {label}
      </Tag>
    );
  };

  const updateData = async (type) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_IP_ADDRESS}/v1/getlistdocument`
      );

      let tmp = [];
      for (let item of res.data.data) {
        if (type === "inbox") {
          let document = JSON.parse(item.Document);
          tmp.push({
            cid: item.Cid,
            partner: item.From,
            message: item.Message,
            document:
              document.map((it, index) => {
                return (
                  <span key={index}>
                    {it.doc_type && it.doc_type.map((doc_t, indexDocT) => <Tag key={indexDocT} color={convertColor(doc_t)}>{doc_t}</Tag>)}
                    <Typography.Text strong>{it.doc_name}</Typography.Text> {" "}
                    <Typography.Text type="secondary">{it.doc_file_name}</Typography.Text>
                    {"  "}
                  </span>
                )
              })
            ,
            status: item.From !== account ? <Badge status="processing" text="Received" /> : <Badge status="success" text="Sent" />,
          });
        }
        else if (type === "sent") {
          if (item.From === account) {
            let document = JSON.parse(item.Document);
            tmp.push({
              cid: item.Cid,
              partner: item.From,
              message: item.Message,
              document:
                document.map((it, index) => {
                  return (
                    <span key={index}>
                      {it.doc_type && it.doc_type.map((doc_t, indexDocT) => <Tag key={indexDocT} color={convertColor(doc_t)}>{doc_t}</Tag>)}
                      <Typography.Text strong>{it.doc_name}</Typography.Text> {" "}
                      <Typography.Text type="secondary">{it.doc_file_name}</Typography.Text>
                    </span>
                  )
                })
              ,
              status: <Badge status="success" text="Sent" />,
            });
          }
        }
      }
      setData(tmp);
      setLoading(false);
    } catch (e) {
      // message.error(SERVER_ERROR, 5);
      console.log(e);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function fectchBusParters() {
      setLoading(true);
      const myProvider = new ethers.providers.Web3Provider(window.ethereum);
      ProvContract = new ethers.Contract(
        process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
        provAbi,
        myProvider.getSigner()
      );

      const multicall = new Multicall({
        ethersProvider: myProvider,
        tryAggregate: true,
      });

      let tmp = [];

      let producer_count = await ProvContract.producer_count();
      if (producer_count > 0)
        for (let i = 1; i <= producer_count; i++) {
          tmp.push({
            reference: "producer_list",
            methodName: "producer_list",
            methodParameters: [i],
          });
        }

      const contractCallContext = [
        {
          reference: "Provenance",
          contractAddress: process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
          abi: provAbi,
          calls: tmp,
        },
      ];

      const results = await multicall.call(contractCallContext);

      const len = results.results.Provenance.callsReturnContext.length;

      tmp = [];
      for (let i = 0; i < len; i++) {
        let producer_address =
          results.results.Provenance.callsReturnContext[i].returnValues[0];
        let is_auth_producer = false;
        is_auth_producer = await ProvContract.auth_producer(
          producer_address > account ? producer_address : account,
          producer_address > account ? account : producer_address
        );
        if (is_auth_producer) {
          try {
            const res = await axios.post(
              `${process.env.REACT_APP_IP_ADDRESS}/v1/getuser`,
              {
                Wallet_address: producer_address,
              }
            );
            if (res.data.status_code === 200) {
              tmp.push({
                label: res.data.data.Trade_name,
                value: producer_address
              });
            }
          } catch (e) {
            message.error(SERVER_ERROR, 5);
            console.log(e);
          }
        }
      }
      await setBusPartnerOp(tmp);
    }
    fectchBusParters();
    updateData("inbox");
  }, [account]);

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
            onClick={() => updateData("inbox")}
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
            onClick={() => updateData("sent")}
          >
            Sent
          </Button>
        </Row>
        <Table
          className="margin-top-20"
          columns={columns}
          dataSource={data}
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                setDocCid(record.cid)
                setDocPartner(record.partner)
                setDocument(record.document)
                setSealMsg(record.message)
                setIsDownModalOpen(true);
              }, // click row
            };
          }}
        />
        <Modal
          title="Compose new Document"
          open={isModalOpen}
          width={1000}
          onCancel={handleCancel}
          footer={
            <div
              style={{
                marginTop: 24,
              }}
            >
              {current === 0 && (
                <>
                  <Button
                    icon={<FileAddOutlined />}
                    type="primary"
                    shape="round"
                    size="large"
                    className="margin-left-8 margin-top-20" onClick={() => addDocument()}>
                    Add Document
                  </Button>
                  <Button
                    icon={<FileDoneOutlined />}
                    type="primary"
                    shape="round"
                    size="large"
                    className="margin-left-8 margin-top-20" onClick={() => next()}>
                    Envelope
                  </Button>
                </>
              )}
              {current === 1 && (
                <>
                  <Button
                    style={{
                      margin: '0 8px',
                    }}
                    icon={<StepBackwardOutlined />}
                    onClick={() => prev()}
                    shape="round"
                    size="large"
                    className="margin-top-20"
                  >
                    Previous
                  </Button>
                  <Button
                    icon={<MailOutlined />}
                    type="primary"
                    shape="round"
                    size="large"
                    className="margin-top-20" onClick={() => handleSeal()}>
                    Seal
                  </Button>
                </>
              )}
              {current === 2 &&
                (<>
                  <Button
                    style={{
                      margin: '0 8px',
                    }}
                    icon={<StepBackwardOutlined />}
                    onClick={() => prev()}
                    shape="round"
                    size="large"
                    className="margin-top-20"
                  >
                    Previous
                  </Button>
                  <Button
                    icon={<SendOutlined />}
                    type="primary"
                    shape="round"
                    size="large"
                    className="margin-left-8 margin-top-20" onClick={() => handleTransfer()}>
                    Transfer
                  </Button>
                </>
                )}
            </div>
          }
        >
          <Steps current={current} items={items} className="margin-top-20" />

          <div style={contentStyle}>
            <Spin spinning={loading} tip="Loading...">
              {current === 0 ?
                <Row className="width-100" gutter={12}>
                  {documentItems && documentItems.map((item, index) => {
                    return (
                      <Col span={12} key={index} className="margin-top-10">
                        <Card>
                          <Button shape="circle" icon={<CloseOutlined />} className="float-right" onClick={() => removeDocument(item.doc_id)} />
                          <Input
                            className="margin-top-10"
                            placeholder="Please input B/L number."
                            value={item.doc_blnum}
                            onChange={(event) => {
                              setDocumentItems(
                                documentItems.map((it) =>
                                  it.doc_id !== item.doc_id
                                    ? it
                                    : {
                                      ...it,
                                      doc_blnum: event.target.value,
                                    }
                                ))
                            }
                            }
                          />
                          <Input
                            className="margin-top-10"
                            placeholder="Please input document name."
                            value={item.doc_name}
                            onChange={(event) => {
                              setDocumentItems(
                                documentItems.map((it) =>
                                  it.doc_id !== item.doc_id
                                    ? it
                                    : {
                                      ...it,
                                      doc_name: event.target.value,
                                    }
                                ))
                            }
                            }
                          />
                          <Select
                            mode="multiple"
                            tagRender={tagRender}
                            value={item.doc_type}
                            onChange={(value) => {
                              setDocumentItems(
                                documentItems.map((it) =>
                                  it.doc_id !== item.doc_id
                                    ? it
                                    : {
                                      ...it,
                                      doc_type: value,
                                    }
                                ))
                            }
                            }
                            className="producer-select margin-top-20"
                            options={docTypeOp}
                          />
                          <Upload {...props}>
                            <Button
                              icon={<UploadOutlined />}
                              shape="round"
                              size="large"
                              className="margin-left-8 margin-top-20"
                              onClick={() => setUploadID(item.doc_id)}
                            >
                              Click to Upload Document
                            </Button>
                          </Upload>
                        </Card>
                      </Col>
                    )
                  })}

                </Row> : ""}
              {current === 1 ?
                <Row className="width-100" gutter={12}>
                  <Col span={24}>
                    <Row className="margin-top-20">
                      <span style={{ fontSize: "18px" }}>Message</span>
                    </Row>
                    <Input.TextArea
                      rows={3}
                      text={seal_msg}
                      onChange={(e) => setSealMsg(e.target.value)}
                      className="margin-top-10 width-100"
                    />
                  </Col>
                  <Divider />
                  {documentItems && documentItems.map((item, index) => {
                    return (
                      <Col span={12} key={index} className="margin-top-10">
                        <Badge.Ribbon text="New">
                          <Card>
                            <span>{item.doc_file_name}</span>
                            <Button shape="circle" icon={<CloseOutlined />} className="float-left" onClick={() => removeDocument(item.doc_id)} />
                            <Input
                              className="margin-top-10"
                              placeholder="Please input B/L number."
                              value={item.doc_blnum}
                              onChange={(event) => {
                                setDocumentItems(
                                  documentItems.map((it) =>
                                    it.doc_id !== item.doc_id
                                      ? it
                                      : {
                                        ...it,
                                        doc_blnum: event.target.value,
                                      }
                                  ))
                              }
                              }
                            />
                            <Input
                              className="margin-top-10"
                              placeholder="Please input document name."
                              value={item.doc_name}
                              onChange={(event) => {
                                setDocumentItems(
                                  documentItems.map((it) =>
                                    it.doc_id !== item.doc_id
                                      ? it
                                      : {
                                        ...it,
                                        doc_name: event.target.value,
                                      }
                                  ))
                              }
                              }
                            />
                            <Select
                              mode="multiple"
                              tagRender={tagRender}
                              value={item.doc_type}
                              onChange={(value) => {
                                setDocumentItems(
                                  documentItems.map((it) =>
                                    it.doc_id !== item.doc_id
                                      ? it
                                      : {
                                        ...it,
                                        doc_type: value,
                                      }
                                  ))
                              }
                              }
                              className="producer-select margin-top-20"
                              options={docTypeOp}
                            />
                          </Card>
                        </Badge.Ribbon>
                      </Col>
                    )
                  })}

                </Row> : ""}
              {current === 2 ?
                <Row className="width-100" gutter={12}>
                  <Col span={24}>
                    <Row className="margin-top-20">
                      <span style={{ fontSize: "18px" }}>Authorized Parties</span>
                    </Row>
                    <Select
                      className="producer-select"
                      value={busPartner}
                      options={busPartnerOp}
                      onChange={(value) => setBusPartner(value)}
                    />
                  </Col>
                  <Divider />
                  {documentItems && documentItems.map((item, index) => {
                    return (
                      <Col span={12} key={index} className="margin-top-10">
                        <Badge.Ribbon text="New">
                          <Card>
                            <span>{item.doc_file_name}</span>
                            <Input
                              className="margin-top-10"
                              value={item.doc_blnum}
                              disabled
                            />
                            <Input
                              className="margin-top-10"
                              value={item.doc_name}
                              disabled
                            />
                            <Select
                              mode="multiple"
                              tagRender={tagRender}
                              value={item.doc_type}
                              className="producer-select margin-top-20"
                              options={docTypeOp}
                              disabled
                            />
                          </Card>
                        </Badge.Ribbon>
                      </Col>
                    )
                  })}

                </Row> : ""}
            </Spin>
          </div>
        </Modal>
        <Modal
          title="Document"
          open={isDownModalOpen}
          onCancel={() => setIsDownModalOpen(false)}
          width={1000}
          footer={
            <a href={doc_cid} className="margin-left-8 margin-top-20" target={_default}>
              <Button
                icon={<DownloadOutlined />}
                type="primary"
                shape="round"
                size="large"
                className="margin-left-8 margin-top-20"
              >
                Download
              </Button>
            </a>
          }
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Partner">{doc_partner}</Descriptions.Item>
            <Descriptions.Item label="Message">{seal_msg}</Descriptions.Item>
            <Descriptions.Item label="Document">{document}</Descriptions.Item>
            <Descriptions.Item label="IPFS">{doc_cid}</Descriptions.Item>
          </Descriptions>
        </Modal>
      </Spin>
    </>
  );
};

export default DocumentManagement;
