import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import provAbi from "../abis/provenanceAbi.json";
import trackAbi from "../abis/trackingAbi.json";
import usdcAbi from "../abis/usdcAbi.json";
import {
  Row,
  Col,
  Button,
  Typography,
  Divider,
  Select,
  Collapse,
  Spin,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";

import "./page.css";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const CreateContract = () => {
  const [contractOp, setContractOp] = useState([]);
  const [buspartner, setBusPartner] = useState("");
  const [contract_id, setContractId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isApproved, setApproved] = useState(true);

  const navigate = useNavigate();
  let TrackContract = null;

  const handleSubmit = async () => {
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    TrackContract = new ethers.Contract(
      process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
      trackAbi,
      myProvider.getSigner()
    );
    await TrackContract.purchaseOrder(contract_id)
      .then((tx) => {
        return tx.wait().then(
          async (receipt) => {
            // This is entered if the transaction receipt indicates success
            message.success("Created a purchase order successfully.", 5);
            setLoading(false);
            navigate("/purchase-orders");
            return true;
          },
          (error) => {
            console.log("```````````", error);
            // message.error(error.message, 5);
            setLoading(false);
          }
        );
      })
      .catch(async (error) => {
        console.log("------", error);
        let msg = error.error !== undefined ? error.error.data.message : "";
        if (msg.includes("allowance")) {
          let contract = await TrackContract.shipments(contract_id);
          let net_value =
            contract.quantity1 * contract.price1 +
            contract.quantity2 * contract.price2;
          message.error(
            "You need to approve " +
              Number(net_value) +
              " amounts of USDC first.",
            5
          );
          setApproved(false);
        } else if (msg.includes("This account is not buyer.")) {
          message.error("This account is not buyer.", 5);
        } else if (msg.includes("You do not have enough tokens.")) {
          message.error("You do not have enough tokens.", 5);
        } else {
          message.error("You rejected transaction", 5);
        }
        setLoading(false);
      });
  };

  const handleApprove = async () => {
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    let USDCContract = new ethers.Contract(
      process.env.REACT_APP_USDC_CONTRACT_ADDRESS,
      usdcAbi,
      myProvider.getSigner()
    );
    let TrackContract = new ethers.Contract(
      process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
      trackAbi,
      myProvider.getSigner()
    );
    let contract = await TrackContract.shipments(contract_id);
    let net_value =
      contract.quantity1 * contract.price1 +
      contract.quantity2 * contract.price2;
    await USDCContract.approve(
      process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
      net_value
    )
      .then((tx) => {
        return tx.wait().then(
          async (receipt) => {
            // This is entered if the transaction receipt indicates success
            message.success("Successfully approved.", 3);
            setApproved(true);
            await setLoading(false);
            return true;
          },
          (error) => {
            message.error(error.message, 5);
            setLoading(false);
          }
        );
      })
      .catch((error) => {
        message.error(error.message, 5);
        setLoading(false);
      });
  };

  useEffect(() => {
    let tmp = [];
    async function fetchData() {
      const myProvider = new ethers.providers.Web3Provider(window.ethereum);
      TrackContract = new ethers.Contract(
        process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
        trackAbi,
        myProvider.getSigner()
      );
      let shipment_id = await TrackContract.shipment_id();
      for (let i = 0; i < shipment_id; i++)
        tmp.push({
          key: i,
          label: i,
          value: i,
        });
      await setContractOp(tmp);
    }
    fetchData();
  }, []);

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Row>
          <Link to="/purchase-orders">
            <Button> {"<"} Back</Button>
          </Link>
        </Row>
        <Row className="margin-top-20">
          <Title level={3}>Create Purchase Order</Title>
        </Row>
        <Divider />

        <Row className="margin-top-10 width-60" gutter={12}>
          <Col span="12" align="left">
            <Row>
              <Text strong className="float-left margin-bottom-20">
                Contract ID
              </Text>
            </Row>
            <Select
              className="width-100"
              placeholder="Contract ID"
              name="contract_id"
              value={contract_id}
              onChange={(value) => {
                setContractId(value);
              }}
              options={contractOp}
            />
          </Col>
        </Row>
        <Divider />
        <Button className="float-left">Cancel</Button>
        <Button
          className="float-left margin-left-8 yellow-btn"
          onClick={handleSubmit}
        >
          Submit PO
        </Button>
        <Button
          type="primary"
          disabled={isApproved}
          className="float-left margin-left-8"
          onClick={handleApprove}
        >
          Approve
        </Button>
      </Spin>
    </>
  );
};

export default CreateContract;
