import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Select,
  Typography,
  Divider,
  Button,
  message,
  Descriptions,
} from "antd";
import { CaretLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import trackAbi from "../abis/trackingAbi.json";

const { Text, Title } = Typography;
const CreateShipment = () => {
  const [pur_id, setPurId] = useState("");
  const [tracing_mtd, setTracingMtd] = useState("");
  const [purOrderOp, setPurOrderOp] = useState([]);
  const [shipment_details, setShipmentDetails] = useState(null);
  const { account } = useWeb3React();

  useEffect(() => {
    async function fetchData() {
      const myProvider = new ethers.providers.Web3Provider(window.ethereum);
      let TrackContract = new ethers.Contract(
        process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
        trackAbi,
        myProvider.getSigner()
      );
      try {
        let shipment_id = await TrackContract.purchase_list(pur_id);
        let shipment = await TrackContract.shipments(shipment_id);
        setShipmentDetails(
          <>
            <Row className="margin-top-20">
              <Descriptions
                title="Shipment Details"
                column={2}
                size="small"
                bordered
              >
                <Descriptions.Item label="Importer">
                  {shipment.recipient}
                </Descriptions.Item>
                <Descriptions.Item label="Purchase Order ID">
                  {pur_id}
                </Descriptions.Item>
                <Descriptions.Item label="Material" span={2}>
                  Quantity
                </Descriptions.Item>
                <Descriptions.Item label={shipment.item1} span={2}>
                  {Number(shipment.quantity1)}
                </Descriptions.Item>
                <Descriptions.Item label={shipment.item2}>
                  {Number(shipment.quantity2)}
                </Descriptions.Item>
              </Descriptions>
            </Row>
          </>
        );
      } catch (e) {
        console.log("Error: ", e);
      }
    }
    fetchData();
  }, [pur_id]);

  useEffect(() => {
    let tmp = [];
    async function fetchData() {
      const myProvider = new ethers.providers.Web3Provider(window.ethereum);
      let TrackContract = new ethers.Contract(
        process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
        trackAbi,
        myProvider.getSigner()
      );
      let purchase_id = await TrackContract.purchase_id();
      for (let i = 0; i < purchase_id; i++) {
        let shipment_id = await TrackContract.purchase_list(i);
        let contract = await TrackContract.shipments(shipment_id);
        if (contract.sender === account)
          tmp.push({
            key: i,
            label: i,
            value: i,
          });
      }
      await setPurOrderOp(tmp);
    }
    fetchData();
  }, []);

  return (
    <>
      <Row>
        <Link to="/shipment-management">
          <Button>
            <CaretLeftOutlined /> Back
          </Button>
        </Link>
      </Row>
      <Row className="margin-top-20">
        <Title level={3}>Create Shipment</Title>
      </Row>
      <Divider />
      <Row>
        <Text strong className="float-left">
          Purchase Order ID
        </Text>
      </Row>
      <Row>
        <Select
          className="contract-select"
          placeholder="Select the purchase order"
          value={pur_id}
          onChange={(value) => {
            setPurId(value);
          }}
          options={purOrderOp}
        />
      </Row>
      <Row>
        <Text strong className="float-left">
          Tracking method
        </Text>
      </Row>
      <Row>
        <Select
          className="contract-select"
          placeholder="Select the tracing method"
          value={tracing_mtd}
          onChange={(value) => {
            setTracingMtd(value);
          }}
          options={[
            { label: "RFID", value: "RFID" },
            { label: "IoT Device", value: "iot-device" },
          ]}
        />
      </Row>
      {shipment_details}
      <Divider />
      <Row className="panelFooter">
        <Button shape="round" size="large" className="float-left ">
          Cancel
        </Button>
        <Button
          type="primary"
          shape="round"
          size="large"
          className="float-left margin-left-8"
        >
          Submit
        </Button>
      </Row>
    </>
  );
};

export default CreateShipment;
