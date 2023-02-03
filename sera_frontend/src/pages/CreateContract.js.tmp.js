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
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ADD_CONTRACT } from "../utils/constants";
import "./page.css";

const { Title, Text } = Typography;
const { Panel } = Collapse;
var tierID = 0;
var materialID = 0;

const CreateContract = () => {
  const [busPartnerOp, setBusPartnerOp] = useState([]);
  const [materialOp, setMaterialOp] = useState([]);
  const [materialItems, setMaterialItems] = useState([]);
  const [buspartner, setbuspartner] = useState("");
  const [contract_type, setContractType] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { organizations } = useSelector((state) => state.orgList);
  const { materials } = useSelector((state) => state.materialList);

  const handleSubmit = () => {
    const contract = {
      buspartner: buspartner,
      contract_type: contract_type,
      start_date: start_date,
      end_date: end_date,
      materials: materialItems,
    };

    dispatch({
      type: ADD_CONTRACT,
      payload: contract,
    });

    navigate("/contracts");

    console.log("-------------", contract);
  };

  const onAddMaterial = () => {
    let tmp = [
      ...materialItems,
      {
        id: materialID++,
        material: "",
        material_description: "",
        tiers: [],
      },
    ];
    setMaterialItems([...tmp]);
  };

  const onAddTier = (matId) => {
    setMaterialItems(
      materialItems.map((item) =>
        item.id !== matId
          ? item
          : {
              ...item,
              tiers: [
                ...item.tiers,
                {
                  id: tierID++,
                  quantity: "",
                  price: "",
                },
              ],
            }
      )
    );
  };

  const onRemoveMaterial = (matId) => {
    setMaterialItems([...materialItems.filter((item) => item.id !== matId)]);
  };

  const onRemoveTier = (matId, tierId) => {
    setMaterialItems(
      materialItems.map((item) =>
        item.id !== matId
          ? item
          : {
              ...item,
              tiers: item.tiers.filter((it) => it.id !== tierId),
            }
      )
    );
  };

  useEffect(() => {
    let tmp = [],
      tmp1 = [];
    organizations.map((org) => {
      tmp = [
        ...tmp,
        {
          label: org.org_wallet_address,
          value: org.org_wallet_address,
        },
      ];
    });
    materials.map((material) => {
      tmp1 = [
        ...tmp1,
        {
          label: material.material,
          value: material.material,
        },
      ];
    });
    setBusPartnerOp(tmp);
    setMaterialOp(tmp1);
  }, []);

  return (
    <>
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
          options={busPartnerOp}
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
      <Row className="margin-top-10 width-60">
        <Col span="12" align="left">
          <DatePicker
            className="datepicker"
            placeholder="Start Date"
            format="YYYY/MM/DD"
            onChange={(date, dateString) => {
              setStartDate(dateString);
            }}
          />
        </Col>
        <Col span="12" align="left">
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
      <Divider />
      <Row>
        <Text strong className="float-left">
          Materials
        </Text>
      </Row>
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
                  Remove Material
                </Button>
              </Row>
            }
            key={matItem.id}
          >
            <Row>
              <Select
                className="width-60"
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
                className="width-60 margin-top-10"
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
            <Row className="width-60">
              <Row className="margin-top-20 width-100">
                <Col span="10">
                  <Text strong className="float-left">
                    Quantity
                  </Text>
                </Col>
                <Col span="10">
                  <Text strong className="float-left">
                    Pricing
                  </Text>
                </Col>
              </Row>
              {matItem.tiers &&
                matItem.tiers.map((tierItem) => (
                  <Row
                    className="margin-top-20 width-100"
                    gutter={12}
                    key={tierItem.id}
                  >
                    <Col span="10">
                      <Input
                        className="contract-material-select"
                        value={tierItem.quantity}
                        onChange={(event) => {
                          setMaterialItems(
                            materialItems.map((item) =>
                              item.id !== matItem.id
                                ? item
                                : {
                                    ...item,
                                    tiers: item.tiers.map((tier) =>
                                      tier.id !== tierItem.id
                                        ? tier
                                        : {
                                            ...tier,
                                            quantity: event.target.value,
                                          }
                                    ),
                                  }
                            )
                          );
                        }}
                        placeholder="Qty & above"
                      />
                    </Col>
                    <Col span="10">
                      <Input
                        className="contract-material-select"
                        value={tierItem.price}
                        onChange={(event) => {
                          setMaterialItems(
                            materialItems.map((item) =>
                              item.id !== matItem.id
                                ? item
                                : {
                                    ...item,
                                    tiers: item.tiers.map((tier) =>
                                      tier.id !== tierItem.id
                                        ? tier
                                        : {
                                            ...tier,
                                            price: event.target.value,
                                          }
                                    ),
                                  }
                            )
                          );
                        }}
                        placeholder="Price"
                      />
                    </Col>
                    <Col span="4">
                      <Button
                        className="float-right"
                        onClick={() => onRemoveTier(matItem.id, tierItem.id)}
                      >
                        Remove Tier
                      </Button>
                    </Col>
                  </Row>
                ))}
              <Button
                className="black-button float-left margin-top-20 margin-bottom-20"
                onClick={() => onAddTier(matItem.id)}
              >
                Add tier
              </Button>
            </Row>
          </Panel>
        ))}
      </Collapse>
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
    </>
  );
};

export default CreateContract;
