import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Tag,
  Divider,
  Button,
  Input,
  Modal,
  Spin,
  Table,
  Select,
  message,
  Typography,
} from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import serafactoryAbi from "../abis/serafactoryAbi.json";
import trackAbi from "../abis/trackingAbi.json";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";

import "./page.css";
import { TRANSACTION_ERROR } from "../utils/messages";

const { Title } = Typography;

const Tokenization = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceOps, setInvoiceOps] = useState([]);
  const [invoiceID, setInvoiceID] = useState("");
  const [contractType, setContractType] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenCount, setTokenCount] = useState(0);
  const [data, setData] = useState([]);
  const { account } = useWeb3React();

  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "invoice_id",
      sorter: {
        compare: (a, b) => a.invoice_id - b.invoice_id,
        multiple: 1,
      },
    },
    {
      title: "Token Name",
      dataIndex: "token_name",
      sorter: {
        compare: (a, b) => a.token_name - b.token_name,
        multiple: 2,
      },
    },
    {
      title: "Token Symbol",
      dataIndex: "token_symbol",
    },
    {
      title: "Contract Type",
      dataIndex: "contract_type",
    },
    {
      title: "Token Address",
      dataIndex: "token_address",
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: {
        compare: (a, b) => a.status - b.status,
        multiple: 3,
      },
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (invoiceID === "") {
      message.error("Please select invoice id field.");
      return;
    }
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    let seraNFTFactoryContract = new ethers.Contract(
      process.env.REACT_APP_SERANFT_FACTORY_CONTRACT_ADDRESS,
      serafactoryAbi,
      myProvider.getSigner()
    );
    await seraNFTFactoryContract
      .createSeraNFT(invoiceID.toString(), tokenName, tokenSymbol, contractType)
      .then((tx) => {
        return tx.wait().then(
          async (receipt) => {
            // This is entered if the transaction receipt indicates success
            await updateData();
            message.success("Created a Sera NFT successfully.", 5);
            return true;
          },
          (error) => {
            message.error(TRANSACTION_ERROR, 5);
            console.log(error);
            setLoading(false);
          }
        );
      })
      .catch(async (error) => {
        message.error(TRANSACTION_ERROR, 5);
        console.log(error);
        setLoading(false);
      });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const updateData = async () => {
    try {
      const myProvider = new ethers.providers.Web3Provider(window.ethereum);
      let seraNFTFactoryContract = new ethers.Contract(
        process.env.REACT_APP_SERANFT_FACTORY_CONTRACT_ADDRESS,
        serafactoryAbi,
        myProvider.getSigner()
      );
      let count = await seraNFTFactoryContract.token_count();
      count = Number(count);
      if (count) {
        let tmp = [],
          cnt = 0;
        for (let i = 1; i <= count; i++) {
          let token = await seraNFTFactoryContract.token(i);
          if (token.owner === account) {
            tmp.push({
              invoice_id: token.invoice_id,
              token_name: token.token_name,
              token_symbol: token.token_symbol,
              contract_type: token.contract_type,
              token_address: token.token_address,
              status: <Tag color="magenta">Active</Tag>,
            });
            cnt++;
          }
        }
        await setTokenCount(cnt);
        await setData(tmp);
      }
    } catch (e) {
      console.log("error: ", e);
    }
    await setLoading(false);
  };

  useEffect(() => {
    let tmp = [];
    async function fetchData() {
      setLoading(true);
      const myProvider = new ethers.providers.Web3Provider(window.ethereum);
      let TrackContract = new ethers.Contract(
        process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
        trackAbi,
        myProvider.getSigner()
      );
      let invoice_id = await TrackContract.invoice_id();
      for (let i = 0; i < invoice_id; i++) {
        let shipment_id = await TrackContract.invoice_list(i);
        let contract = await TrackContract.shipments(shipment_id);
        if (contract.sender === account)
          tmp.push({
            key: i,
            label: i,
            value: i,
          });
      }
      await setInvoiceOps(tmp);
      await updateData();
    }
    fetchData();
  }, [account]);

  return (
    <Spin spinning={loading} tip="Loading...">
      <Row className="contract-header">
        <div className="float-left">
          <span className="title-style">Tokens</span>
          <br />
          <span style={{ color: "#9f9f9f", fontSize: "20px" }}>
            Total Contracts: {tokenCount}
          </span>
        </div>
        <Button
          className="contract-btn"
          icon={<FileAddOutlined />}
          onClick={showModal}
        >
          Deploy
        </Button>
      </Row>
      <Divider />
      {tokenCount === 0 ? (
        <Row justify="center" style={{ marginTop: "10%" }}>
          <div className="title-style width-100">Tokenization</div>
          <br />
          <div className="width-100 margin-top-20" style={{ fontSize: "18px" }}>
            Create fungible/non fungible tokens and manage them throughout their
            lifecycle.
          </div>
          <div
            className="width-100 margin-top-20"
            style={{ fontSize: "24px", fontWeight: "600" }}
          >
            Start now!
          </div>
          <Button
            className="contract-btn margin-top-20"
            icon={<FileAddOutlined />}
            onClick={showModal}
          >
            Deploy Token Contract
          </Button>
        </Row>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 2000 }}
        />
      )}

      <Modal
        title={<Title level={4}>Deploy Token Contract</Title>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Deploy"
        width={600}
        style={{
          top: "20%",
        }}
      >
        <Spin spinning={loading} tip="Loading...">
          <Divider />
          <Row className="width-100" gutter={15}>
            <Col span="16">
              <Input
                placeholder="Token Name"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
              />
            </Col>
            <Col span="8">
              <Input
                placeholder="Symbol"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
              />
            </Col>
          </Row>
          <Divider orientation="center"> Invoice ID </Divider>
          <Select
            className="width-100"
            placeholder="Invoice ID"
            value={invoiceID}
            options={invoiceOps}
            onChange={(value) => setInvoiceID(value)}
          />
          <Divider orientation="center"> Select Contract Type </Divider>
          <Select
            className="width-100"
            placeholder="Contract Type"
            value={contractType}
            onChange={(value) => setContractType(value)}
            options={[
              {
                label: "Fungible",
                value: "fungible",
              },
              {
                label: "Non Fungible",
                value: "nonfungible",
              },
              {
                label: "Semi Fungible",
                value: "semifungible",
              },
            ]}
          />
        </Spin>
      </Modal>
    </Spin>
  );
};

export default Tokenization;
