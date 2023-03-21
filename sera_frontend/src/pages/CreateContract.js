import React, { useState, useEffect } from "react";
import { Link, useFetcher } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Typography,
  Divider,
  Select,
  DatePicker,
  Collapse,
  Input,
  Spin,
  message,
  Radio,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import trackAbi from "../abis/trackingAbi.json";
import provAbi from "../abis/provenanceAbi.json";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import "./page.css";
import { SERVER_ERROR, TRANSACTION_ERROR } from "../utils/messages";
const { Title, Text } = Typography;
const { Panel } = Collapse;
var materialID = 0;

const CreateContract = () => {
  const [rfqOp, setRFQOp] = useState([]);
  const [materialOp, setMaterialOp] = useState([]);
  const [materialItems, setMaterialItems] = useState([]);
  const [buspartner, setbuspartner] = useState("");
  const [wallet_address, setWalletAddress] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [rfqId, setRfqId] = useState("");
  const [mode, setMode] = useState("RFQ");
  const { account } = useWeb3React();

  let TrackContract = null;

  const navigate = useNavigate();

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const handleSubmitRFQ = async () => {
    setLoading(true);
    try {
      const res1 = await axios.post(
        `${process.env.REACT_APP_IP_ADDRESS}/v1/getuser`,
        {
          Wallet_address: account,
        }
      );
      if (res1.data.status_code === 200) {
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}/v1/addrfq`,
          {
            materialItems: JSON.stringify(materialItems),
            buspartner: res1.data.data.Trade_name,
            wallet_address: account,
            status: 0,
          }
        );
        if (res.data.status_code === 200) {
          message.success("Requested for quotation successfully.", 5);
          await setLoading(false);
          navigate("/contracts");
        }
      }
    } catch (e) {
      message.error(SERVER_ERROR, 5);
      console.log(e);
      setLoading(false);
    }
  };

  const handleSubmitProposal = async () => {
    if (rfqId === "") {
      message.error("Please select RFQ Id.");
      return;
    }
    setLoading(true);
    console.log(
      "---------",
      buspartner,
      materialItems[0].material,
      materialItems[0].quantity,
      materialItems[0].price,
      materialItems[1].material,
      materialItems[1].quantity,
      materialItems[1].price
    );
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    TrackContract = new ethers.Contract(
      process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
      trackAbi,
      myProvider.getSigner()
    );
    await TrackContract.createContract(
      wallet_address,
      materialItems[0].material,
      materialItems[0].quantity,
      materialItems[0].price,
      materialItems[1].material,
      materialItems[1].quantity,
      materialItems[1].price
    )
      .then((tx) => {
        return tx.wait().then(
          async (receipt) => {
            // This is entered if the transaction receipt indicates success
            message.success("Created a new contract successfully.", 5);
            await setLoading(false);
            navigate("/contracts");
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
  };

  const onAddMaterial = () => {
    let tmp = [
      ...materialItems,
      {
        id: materialID++,
        material: "",
        material_description: "",
      },
    ];
    setMaterialItems([...tmp]);
  };

  const onRemoveMaterial = (matId) => {
    setMaterialItems([...materialItems.filter((item) => item.id !== matId)]);
  };

  useEffect(() => {
    if (mode === "proposal") {
      setRfqId("");
      async function fetchData() {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_IP_ADDRESS}/v1/getlistrfq`
          );
          if (res.data.status_code === 200) {
            let tmp = [];
            for (let item of res.data.data) {
              tmp.push({
                label: item.MaterialId,
                value: item.MaterialId,
              });
            }
            setRFQOp(tmp);
          }
        } catch (e) {
          message.error(SERVER_ERROR, 5);
          console.log(e);
        }
      }
      fetchData();
      setMaterialItems([]);
    }
  }, [mode]);

  const onChangeRFQ = (value) => {
    async function fetchData() {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}/v1/getrfq`,
          { MaterialId: value }
        );
        if (res.data.status_code === 200) {
          setbuspartner(res.data.data.Buspartner);
          setWalletAddress(res.data.data.Wallet_address);
          setMaterialItems(JSON.parse(res.data.data.MaterialItems));
        }
      } catch (e) {
        message.error(SERVER_ERROR, 5);
        console.log(e);
      }
    }
    fetchData();
    setRfqId(value);
  };

  useEffect(() => {
    let tmp = [];
    let ProvContract = null;
    async function fetchData() {
      const myProvider = new ethers.providers.Web3Provider(window.ethereum);
      ProvContract = new ethers.Contract(
        process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
        provAbi,
        myProvider.getSigner()
      );
      let product_count = await ProvContract.product_count();
      for (let i = 0; i < product_count; i++) {
        let pro_pub_number = await ProvContract.product_list(i);
        let mat = await ProvContract.products(pro_pub_number);
        if (mat.producer_address === account)
          tmp.push({
            key: mat.pub_number,
            label: mat.pub_number,
            value: mat.name,
          });
      }
      await setMaterialOp(tmp);
    }
    fetchData();
  }, []);

  return (
    <>
      <Row>
        <Link to="/contracts">
          <Button>
            <CaretLeftOutlined /> Back
          </Button>
        </Link>
      </Row>
      <Divider />
      <Row>
        <Radio.Group
          onChange={handleModeChange}
          value={mode}
          buttonStyle="solid"
          style={{
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          <Radio.Button value="RFQ">RFQ</Radio.Button>
          <Radio.Button value="proposal">Proposal</Radio.Button>
        </Radio.Group>
      </Row>
      <Spin spinning={loading} tip="Loading...">
        {mode === "proposal" ? (
          <>
            <Row className="margin-top-20">
              <Title level={3}>Create Proposal</Title>
            </Row>
            <Divider />
            <Row>
              <Col xs={24} sm={16} ls={10} md={10} lg={7}>
                <Row>
                  <Text strong className="float-left">
                    RFQ
                  </Text>
                </Row>
                <Row>
                  <Select
                    className="contract-select"
                    value={rfqId}
                    onChange={(value) => onChangeRFQ(value)}
                    placeholder="RFQ ID"
                    options={rfqOp}
                  />
                </Row>
                <Row className="margin-top-10">
                  <Text strong className="float-left">
                    Business Partner
                  </Text>
                </Row>
                <Row className="margin-top-10">
                  <Input value={buspartner} disabled />
                </Row>
                <Row className="margin-top-10">
                  <Text strong className="float-left">
                    Validity Period
                  </Text>
                </Row>
                <Row className="margin-top-10 validityperiod">
                  <Col span={11}>
                    <DatePicker
                      className="datepicker"
                      placeholder="Start Date"
                      format="YYYY/MM/DD"
                      onChange={(date, dateString) => {
                        setStartDate(dateString);
                      }}
                    />
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <DatePicker
                      className="datepicker"
                      placeholder="End Date"
                      format="YYYY/MM/DD"
                      onChange={(date, dateString) => {
                        setEndDate(dateString);
                      }}
                    />
                  </Col>
                </Row>
                <Row className="margin-top-10">
                  <Text strong className="float-left">
                    Materials
                  </Text>
                </Row>
                {materialItems &&
                  materialItems.map((item, index) => (
                    <Row className="margin-top-10" key={index} justify="center">
                      <Col span={8} justify="center" align="middle">
                        {item.material} :
                      </Col>
                      <Col span={16}>
                        <Input
                          placeholder="Price"
                          value={item.price}
                          onChange={(event) => {
                            setMaterialItems(
                              materialItems.map((it) =>
                                it.id !== item.id
                                  ? it
                                  : {
                                    ...it,
                                    price: event.target.value,
                                  }
                              )
                            );
                          }}
                        />{" "}
                        <Input
                          placeholder="Quantity"
                          value={item.quantity}
                          className="margin-top-10"
                          onChange={(event) => {
                            setMaterialItems(
                              materialItems.map((it) =>
                                it.id !== item.id
                                  ? it
                                  : {
                                    ...it,
                                    quantity: event.target.value,
                                  }
                              )
                            );
                          }}
                        />
                      </Col>
                    </Row>
                  ))}
              </Col>
            </Row>
            <Divider />
            <Button className="float-left">Cancel</Button>
            <Button
              className="float-left margin-left-8"
              onClick={handleSubmitProposal}
            >
              Sign and submit proposal
            </Button>
          </>
        ) : (
          <>
            <Row>
              <Col xs={24} sm={16} ls={10} md={10} lg={7}>
                <Collapse
                  className="text-align-left margin-top-20"
                  defaultActiveKey={["1"]}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  ghost
                >
                  {materialItems.map((matItem, index) => (
                    <Panel
                      header={
                        <Row className="inline-block width-100">
                          <Text strong className="float-left">
                            Material {index + 1}
                          </Text>
                          <Button
                            className="float-right"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveMaterial(matItem.id);
                            }}
                          >
                            Remove
                          </Button>
                        </Row>
                      }
                      key={matItem.id}
                    >
                      <Row>
                        <Select
                          className="contract-select"
                          placeholder="Material"
                          value={matItem.material}
                          onChange={(value) => {
                            setMaterialItems(
                              materialItems.map((it) =>
                                it.id !== matItem.id
                                  ? it
                                  : {
                                    ...it,
                                    material: value,
                                  }
                              )
                            );
                          }}
                          options={materialOp}
                        />
                      </Row>
                    </Panel>
                  ))}
                </Collapse>
              </Col>
            </Row>
            <Button
              className="black-button float-left margin-bottom-20"
              onClick={onAddMaterial}
            >
              Add Material
            </Button>
            <Divider />

            <Button shape="round" size="large" className="float-left ">
              Cancel
            </Button>
            <Button
              type="primary"
              shape="round"
              size="large"
              className="float-left margin-left-8"
              onClick={handleSubmitRFQ}
            >
              Submit RFQ.
            </Button>
          </>
        )}
      </Spin>
    </>
  );
};

export default CreateContract;
