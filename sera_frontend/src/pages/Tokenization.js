import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Input,
  Modal,
  Spin,
  Select,
  message,
} from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import serafactoryAbi from "../abis/serafactoryAbi.json";
import trackAbi from "../abis/trackingAbi.json";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";

import "./page.css";

const { Title } = Typography;

const Tokenization = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceOps, setInvoiceOps] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    let seraNFTFactoryContract = new ethers.Contract(
      process.env.REACT_APP_SERANFT_FACTORY_CONTRACT_ADDRESS,
      serafactoryAbi,
      myProvider.getSigner()
    );
    await seraNFTFactoryContract
      .createSeraNFT()
      .then((tx) => {
        return tx.wait().then(
          async (receipt) => {
            // This is entered if the transaction receipt indicates success
            message.success("Created a Sera NFT successfully.", 5);
            await setLoading(false);
            return true;
          },
          (error) => {
            message.error(error.error.data.message, 5);
            setLoading(false);
          }
        );
      })
      .catch(async (error) => {
        message.error(error.error.data.message, 5);
        setLoading(false);
      });
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    let tmp = [];
    async function fetchData() {
      const myProvider = new ethers.providers.Web3Provider(window.ethereum);
      let TrackContract = new ethers.Contract(
        process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
        trackAbi,
        myProvider.getSigner()
      );
      let invoice_id = await TrackContract.invoice_id();
      for (let i = 0; i < invoice_id; i++)
        tmp.push({
          key: i,
          label: i,
          value: i,
        });
      await setInvoiceOps(tmp);
    }
    fetchData();
  }, []);
  return (
    <>
      <Row className="contract-header">
        <div className="float-left">
          <span className="title-style">Tokens</span>
          <br />
          <span style={{ color: "#9f9f9f", fontSize: "20px" }}>
            Total Contracts: 0
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
      <Modal
        title={<Title level={4}>Deploy Token Contract</Title>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Deploy"
        width={800}
        style={{
          top: "20%",
        }}
      >
        <Spin spinning={loading} tip="Loading...">
          <Divider />
          <Row className="width-100" gutter={15}>
            <Col span="16">
              <Input placeholder="Token Name" />
            </Col>
            <Col span="8">
              <Input placeholder="Symbol" />
            </Col>
          </Row>
          <Divider orientation="center"> Invoice ID </Divider>
          <Select
            className="width-100"
            placeholder="Invoice ID"
            options={invoiceOps}
          />
          <Divider orientation="center"> Select Contract Type </Divider>
          <Select
            className="width-100"
            placeholder="Organization Type"
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
    </>
  );
};

export default Tokenization;
