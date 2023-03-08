import React, { useState, useEffect } from "react";
import {
  Divider,
  Form,
  Input,
  message,
  notification,
  Row,
  Button,
  Tag,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import axios from "axios";
import { SERVER_ERROR } from "../utils/messages";
import provAbi from "../abis/provenanceAbi.json";

import "./page.css";

const Profile = () => {
  const { chainId, active, account } = useWeb3React();
  const [isEdited, setEdited] = useState(true);
  const [balance, setBalance] = useState(0);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    email: "",
    trade_name: "",
    legal_name: "",
    country: "",
    state_town: "",
    building_number: "",
    phone_number: "",
    description: "",
    material: [],
  });

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
      const myProvider = new ethers.providers.Web3Provider(window.ethereum);
      myProvider.getBalance(account).then((balance) => {
        // convert a currency unit from wei to ether
        const balanceInEth = ethers.utils.formatEther(balance);
        setBalance(balanceInEth);
      });
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
        My account{" "}
        <Button
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => setEdited(!isEdited)}
        />
      </span>
      <Divider />
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
          align: "left",
        }}
        form={form}
        className="width-100"
        layout="horizontal"
        validateMessages={validateMessages}
      >
        <Form.Item
          label="Trade Name"
          name="Trade_name"
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
        <Form.Item
          label="Legal Name"
          name="Legal_name"
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
        <Form.Item
          label="Country"
          name="Country"
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
        <Form.Item
          label="State/town"
          name="State_town"
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
        <Form.Item
          label="Building Number"
          name="Building_number"
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
        <Form.Item
          label="Phone Number"
          name="Phone_number"
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
        <Form.Item
          label="Email"
          name={["Email"]}
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
        <Form.Item label="Meterials" className="margin-top-10">
          {state.material &&
            state.material.map((item) => {
              return <Tag>{item.name}</Tag>;
            })}
        </Form.Item>
        <Form.Item label="Company Description" className="margin-top-10">
          <Input.TextArea
            placeholder="Company Description"
            name="description"
            rows={4}
            value={state.description}
            disabled={isEdited}
            onChange={handleInputChange}
          />
        </Form.Item>
      </Form>
      <Divider />
      <Button className="">Cancel</Button>
      <Button type="primary" className="margin-left-8" onClick={handleOk}>
        Submit
      </Button>
    </Row>
  );
};

export default Profile;
