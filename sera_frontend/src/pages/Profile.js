import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import {
  Divider,
  Form,
  Input,
  Tag,
  Row,
  Col,
  Button,
  Upload,
  message,
  notification,
} from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { SERVER_ERROR } from "../utils/messages";
import provAbi from "../abis/provenanceAbi.json";

import "./page.css";

const Profile = () => {
  const { chainId, active, account } = useWeb3React();
  const [isEdited, setEdited] = useState(true);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    email: "",
    trade_name: "",
    legal_name: "",
    country: "",
    state_town: "",
    building_number: "",
    tax_number: "",
    registration_number: "",
    phone_number: "",
    description: "",
    material: [],
  });

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
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevProps) => ({
      ...prevProps,
      [name]: value,
    }));
  };

  const handleOk = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_IP_ADDRESS}/v1/updateuser`,
        {
          email: state.email,
          password: state.password,
          trade_name: state.trade_name,
          legal_name: state.legal_name,
          country: state.country,
          state_town: state.state_town,
          building_number: state.building_number,
          phone_number: state.phone_number,
          description: state.description,
          wallet_address: account,
        }
      );
      if (res.data.status_code === 200) {
        message.success("Profile is updated Successfully.");
        setEdited(true);
      }
    } catch (e) {
      message.error(SERVER_ERROR, 5);
      console.log(e);
    }
  };

  useEffect(() => {
    if (active) {
      if (chainId !== parseInt(process.env.REACT_APP_CHAIN_ID)) {
        notification.error({
          message:
            "You are on wrong network. Please switch to Binance testnet to continue",
        });
        return;
      }
      async function FetchData() {
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_IP_ADDRESS}/v1/getuser`,
            {
              Wallet_address: account,
            }
          );

          if (res.data.status_code === 200) {
            let {
              Email,
              Trade_name,
              Legal_name,
              Country,
              State_town,
              Building_number,
              Phone_number,
              Description,
            } = res.data.data;
            setState({
              email: Email,
              trade_name: Trade_name,
              legal_name: Legal_name,
              country: Country,
              state_town: State_town,
              building_number: Building_number,
              phone_number: Phone_number,
              description: Description,
            });

            form.setFieldsValue({
              Email: Email,
              Trade_name: Trade_name,
              Legal_name: Legal_name,
              Country: Country,
              State_town: State_town,
              Building_number: Building_number,
              Phone_number: Phone_number,
              Description: Description,
            });
            const myProvider = new ethers.providers.Web3Provider(
              window.ethereum
            );
            let ProvContract = new ethers.Contract(
              process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
              provAbi,
              myProvider.getSigner()
            );
            let tmp = [];
            let pro_count = await ProvContract.product_count();
            for (let i = 0; i < pro_count; i++) {
              let pro_pub_number = await ProvContract.product_list(i);
              let material = await ProvContract.products(pro_pub_number);
              if (material.producer_address === account) tmp.push(material);
              setState((prevProps) => ({
                ...prevProps,
                material: tmp,
              }));
            }
          }
        } catch (e) {
          message.error(SERVER_ERROR, 5);
          console.log(e);
        }
      }
      FetchData();
    }
  }, [chainId, active, account]);

  return (
    <Row justify="center">
      <span className="Modal-title">
        <span className="title-style"> My Account </span>
        <Button
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => setEdited(!isEdited)}
        />
      </span>
      <Divider />
      <Form
        form={form}
        className="width-80"
        layout="horizontal"
        validateMessages={validateMessages}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Trade Name"
              name="Trade_name"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
                align: "left",
              }}
              rules={[
                {
                  required: true,
                  message: "Please input your trade name!",
                },
              ]}
            >
              <Input
                placeholder="Company trade name"
                name="trade_name"
                disabled={isEdited}
                value={state.trade_name}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Legal Name"
              name="Legal_name"
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 18,
                align: "left",
              }}
              rules={[
                {
                  required: true,
                  message: "Please input your legal name!",
                },
              ]}
            >
              <Input
                placeholder="Company legal name"
                name="legal_name"
                disabled={isEdited}
                value={state.legal_name}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Country"
              name="Country"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
                align: "left",
              }}
              rules={[
                {
                  required: true,
                  message: "Please input your country!",
                },
              ]}
            >
              <Input
                placeholder="Country"
                name="country"
                disabled={isEdited}
                value={state.country}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="State/town"
              name="State_town"
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 18,
                align: "left",
              }}
              rules={[
                {
                  required: true,
                  message: "Please input your state/town!",
                },
              ]}
            >
              <Input
                placeholder="State town"
                name="state_town"
                disabled={isEdited}
                value={state.state_town}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Building Number"
              name="Building_number"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
                align: "left",
              }}
              rules={[
                {
                  required: true,
                  message: "Please input your building number!",
                },
              ]}
            >
              <Input
                placeholder="Building number"
                name="building_number"
                disabled={isEdited}
                value={state.building_number}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="Phone_number"
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 18,
                align: "left",
              }}
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
              ]}
            >
              <Input
                placeholder="Phone number"
                name="phone_number"
                disabled={isEdited}
                value={state.phone_number}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name={["Email"]}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
                align: "left",
              }}
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                placeholder="Email"
                name="email"
                disabled={isEdited}
                value={state.email}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tax Number"
              name={["tax_number"]}
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 18,
                align: "left",
              }}
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                placeholder="Tax Number"
                name="tax_number"
                disabled={isEdited}
                value={state.tax_number}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Registration Number"
              name={["registration_number"]}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
                align: "left",
              }}
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                placeholder="Registration Number"
                name="registration_number"
                disabled={isEdited}
                value={state.tax_number}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Meterials"
              className="margin-top-10"
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 18,
                align: "left",
              }}
            >
              {state.material &&
                state.material.map((item) => {
                  return <Tag color="#108ee9">{item.name}</Tag>;
                })}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Company Description"
              className="margin-top-10"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
                align: "left",
              }}
            >
              <Input.TextArea
                placeholder="Company Description"
                name="description"
                rows={4}
                value={state.description}
                disabled={isEdited}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider />

      <Button className="">Cancel</Button>
      <Button className="margin-left-8" onClick={handleOk}>
        Submit
      </Button>
      <Upload {...props} className="margin-left-8">
        <Button icon={<UploadOutlined />} type="primary">
          Click to Upload Document
        </Button>
      </Upload>
    </Row>
  );
};

export default Profile;
