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
  Input,
  Spin,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import trackAbi from "../abis/trackingAbi.json";
import provAbi from "../abis/provenanceAbi.json";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import "./page.css";
import { TRANSACTION_ERROR } from "../utils/messages";

const { Title, Text } = Typography;
const { Panel } = Collapse;
var materialID = 0;

const CreateContract = () => {
  const [orgOp, setOrgOp] = useState([]);
  const [materialOp, setMaterialOp] = useState([]);
  const [materialItems, setMaterialItems] = useState([]);
  const [buspartner, setbuspartner] = useState("");
  const [contract_type, setContractType] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWalletIntalled, setIsWalletInstalled] = useState(false);
  const [provider, setProvider] = useState();
  const { chainId, active, account } = useWeb3React();
  const validNetwork =
    chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? true : false;
  let TrackContract = null;

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    const contract = {
      buspartner: buspartner,
      contract_type: contract_type,
      start_date: start_date,
      end_date: end_date,
      materials: materialItems,
    };
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    TrackContract = new ethers.Contract(
      process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
      trackAbi,
      myProvider.getSigner()
    );
    await TrackContract.createContract(
      buspartner,
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
        quantity: 0,
        price: 0,
      },
    ];
    setMaterialItems([...tmp]);
  };

  const onRemoveMaterial = (matId) => {
    setMaterialItems([...materialItems.filter((item) => item.id !== matId)]);
  };

  useEffect(() => {
    let tmp = [],
      tmp1 = [];
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
          tmp1.push({
            key: mat.pub_number,
            label: mat.pub_number,
            value: mat.name,
          });
      }
      await setMaterialOp(tmp1);

      let producer_count = await ProvContract.producer_count();
      if (producer_count > 0)
        for (let i = 1; i <= producer_count; i++) {
          let producer_address = await ProvContract.producer_list(i);
          let is_auth_producer = false;
          if (producer_address > account)
            is_auth_producer = await ProvContract.auth_producer(
              producer_address,
              account
            );
          else
            is_auth_producer = await ProvContract.auth_producer(
              account,
              producer_address
            );
          if (is_auth_producer) {
            let producer = await ProvContract.producers(producer_address);
            tmp.push({
              key: producer_address,
              label: producer.trade_name,
              value: producer_address,
            });
          }
        }

      await setOrgOp(tmp);
    }
    fetchData();
  }, []);

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Row>
          <Link to="/contracts">
            <Button> {"<"} Back</Button>
          </Link>
        </Row>
        <Row className="margin-top-20">
          <Title level={3}>Create Contract</Title>
        </Row>
        <Text type="danger" strong className="float-left">
          Please add a business partner to proceed.
        </Text>
        <Divider />
        <Row>
          <Col xs={24} sm={16} ls={10} md={10} lg={7}>
            <Row>
              <Text strong className="float-left">
                Business Partner
              </Text>
            </Row>
            <Row>
              <Select
                className="contract-select"
                value={buspartner}
                onChange={(value) => setbuspartner(value)}
                placeholder="Business Partner"
                options={orgOp}
              />
            </Row>
            <Row>
              <Text strong className="float-left">
                Contract Type
              </Text>
            </Row>
            <Row>
              <Select
                className="contract-select"
                value={contract_type}
                onChange={(value) => setContractType(value)}
                placeholder="Volume-based tiered pricing"
                options={[
                  {
                    label: "Smart Contract",
                    value: "Smart Contract",
                  },
                ]}
              />
            </Row>
            <Row>
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
          </Col>
        </Row>
        <Divider />
        <Row>
          <Text strong className="float-left">
            Materials
          </Text>
        </Row>

        <Row>
          <Col xs={24} sm={16} ls={10} md={10} lg={7}>
            <Collapse
              className="text-align-left margin-top-20"
              defaultActiveKey={["1"]}
              ghost
            >
              {materialItems.map((matItem, index) => (
                <Panel
                  header={
                    <Row className="inline-block">
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
                  <Row>
                    <Input
                      className="margin-top-10"
                      value={matItem.material_description}
                      onChange={(event) => {
                        setMaterialItems(
                          materialItems.map((it) =>
                            it.id !== matItem.id
                              ? it
                              : {
                                  ...it,
                                  material_description: event.target.value,
                                }
                          )
                        );
                      }}
                      placeholder="Material Description"
                    />
                  </Row>
                  <Row>
                    <Text strong className="float-left margin-top-10">
                      Material1 tier prices
                    </Text>
                  </Row>
                  <Row>
                    <Row className="margin-top-20 width-100">
                      <Col span="12">
                        <Text strong className="float-left">
                          Quantity
                        </Text>
                      </Col>
                      <Col span="12">
                        <Text strong className="float-left">
                          Pricing
                        </Text>
                      </Col>
                    </Row>
                    <Row className="margin-top-20 width-100" gutter={12}>
                      <Col span="12">
                        <Input
                          className="contract-material-select"
                          value={matItem.quantity}
                          onChange={(event) => {
                            setMaterialItems(
                              materialItems.map((it) =>
                                it.id !== matItem.id
                                  ? it
                                  : {
                                      ...it,
                                      quantity: event.target.value,
                                    }
                              )
                            );
                          }}
                          placeholder="Qty & above"
                        />
                      </Col>
                      <Col span="12">
                        <Input
                          className="contract-material-select"
                          value={matItem.price}
                          onChange={(event) => {
                            setMaterialItems(
                              materialItems.map((it) =>
                                it.id !== matItem.id
                                  ? it
                                  : {
                                      ...it,
                                      price: event.target.value,
                                    }
                              )
                            );
                          }}
                          placeholder="Price"
                        />
                      </Col>
                    </Row>
                  </Row>
                </Panel>
              ))}
            </Collapse>
          </Col>
        </Row>
        <Divider />
        <Button
          className="black-button float-left margin-bottom-20"
          onClick={onAddMaterial}
        >
          Add Material
        </Button>
        <Divider />
        <Button className="float-left">Cancel</Button>
        <Button className="float-left margin-left-8" onClick={handleSubmit}>
          Sign and submit contract
        </Button>
      </Spin>
    </>
  );
};

export default CreateContract;
