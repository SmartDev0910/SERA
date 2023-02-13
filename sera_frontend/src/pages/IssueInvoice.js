import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Typography,
  Divider,
  Select,
  DatePicker,
  Collapse,
  Spin,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import trackAbi from "../abis/trackingAbi.json";
import provAbi from "../abis/provenanceAbi.json";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import "./page.css";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const IssueInvoice = () => {
  const [busPartnerOp, setBusPartnerOp] = useState([]);
  const [purOrderOp, setPurOrderOp] = useState([]);
  const [buspartner, setBusPartner] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [pur_id, setPurId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWalletIntalled, setIsWalletInstalled] = useState(false);
  const [provider, setProvider] = useState();
  let TrackContract = null;
  const { chainId, active, account } = useWeb3React();
  const validNetwork =
    chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? true : false;

  const navigate = useNavigate();

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    TrackContract = new ethers.Contract(
      process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
      trackAbi,
      myProvider.getSigner()
    );
    await TrackContract.issueInvoice(pur_id)
      .then((tx) => {
        return tx.wait().then(
          async (receipt) => {
            // This is entered if the transaction receipt indicates success
            message.success("Issued a invoice successfully.", 5);
            await setLoading(false);
            navigate("/invoices");
            return true;
          },
          (error) => {
            message.error("Server had some errors.", 5);
            console.log(error);
            setLoading(false);
          }
        );
      })
      .catch((error) => {
        message.error("Server had some errors.", 5);
        console.log(error);
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
      <Spin spinning={loading} tip="Loading...">
        <Row>
          <Link to="/invoices">
            <Button> {"<"} Back</Button>
          </Link>
        </Row>
        <Row className="margin-top-20">
          <Title level={3}>Issue Invoice</Title>
        </Row>
        <Divider />
        <Row>
          <Col xs={24} sm={16} ls={10} md={10} lg={7}>
            <Row>
              <Text strong className="float-left">
                Purchase Order
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

            <Row className="margin-top-10">
              <Col span="11">
                <DatePicker
                  className="datepicker"
                  placeholder="Invoice Date"
                  format="YYYY/MM/DD"
                  onChange={(date, dateString) => {
                    setStartDate(dateString);
                  }}
                />
              </Col>
              <Col span="2"></Col>
              <Col span="11">
                <DatePicker
                  className="datepicker"
                  placeholder="Due Date"
                  format="YYYY/MM/DD"
                  onChange={(date, dateString) => {
                    setEndDate(dateString);
                  }}
                />
              </Col>
            </Row>
            <Divider />
            <Row className="panelFooter">
              <Button className="float-left">Cancel</Button>
              <Button
                className="float-left margin-left-8"
                onClick={handleSubmit}
              >
                Issue Invoice
              </Button>
            </Row>
          </Col>
        </Row>
      </Spin>
    </>
  );
};

export default IssueInvoice;
