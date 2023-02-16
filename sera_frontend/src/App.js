import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import Menubar from "./layouts/Menubar";
import {
  Layout,
  Avatar,
  Row,
  Col,
  Input,
  Divider,
  Modal,
  Button,
  notification,
  Drawer,
  Dropdown,
  message,
} from "antd";
import { MenuOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./utils/connector";
import { ethers } from "ethers";
import axios from "axios";
import logo from "./logo.jpg";
import { SERVER_ERROR } from "./utils/messages";
import "./App.css";
const { Sider, Content } = Layout;

const contentStyle = {
  minHeight: 120,
  textAlign: "center",
  color: "#000",
  padding: "20px",
  backgroundColor: "#fff",
};

const logoStyle = {
  float: "left",
  width: "60px",
  height: "auto",
};

const logoTitleStyle = {
  float: "left",
  paddingTop: "10px",
  color: "white",
};

const App = () => {
  const { chainId, active, activate, deactivate, account } = useWeb3React();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEdited, setEdited] = useState(true);
  const [visible, setVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  const [state, setState] = useState({
    email: "",
    trade_name: "",
    legal_name: "",
    country: "",
    state_town: "",
    building_number: "",
    phone_number: "",
  });
  async function connect(injected) {
    activate(injected);
  }

  async function disConnect(injected) {
    deactivate(injected);
  }

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
    setModalOpen(false);
  };

  const items = [
    {
      label: <span onClick={() => setModalOpen(true)}>Your Profile</span>,
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: state.trade_name,
      key: "1",
    },
    {
      label: balance.toString().substring(0, 5) + " BNB",
      key: "2",
    },
    {
      type: "divider",
    },
    {
      label: <span onClick={() => disConnect(injected)}>Disconnect</span>,
      key: "3",
    },
    {
      label: <a href="/">Sign Out</a>,
      key: "4",
    },
  ];

  const renderButton = (
    <>
      {active ? (
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
        >
          <Button
            className="btn btn-green btn-launch-app"
            onClick={(e) => e.preventDefault()}
          >
            {account.substring(0, 5) + " ... " + account.substring(38)}{" "}
            <DownOutlined />
          </Button>
        </Dropdown>
      ) : (
        <Button
          className="btn btn-green btn-launch-app"
          onClick={() => connect(injected)}
        >
          CONNECT WALLET
        </Button>
      )}
    </>
  );

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
            } = res.data.data;
            setState({
              email: Email,
              trade_name: Trade_name,
              legal_name: Legal_name,
              country: Country,
              state_town: State_town,
              building_number: Building_number,
              phone_number: Phone_number,
            });
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
    <BrowserRouter>
      <Row className="App-header" align="middle">
        <Button
          className="menu"
          type="primary"
          icon={<MenuOutlined />}
          onClick={() => setVisible(true)}
        />
        <Avatar shape="square" src={logo} style={logoStyle} />
        {renderButton}
        <Drawer
          title="Menu"
          placement="left"
          onClick={() => setVisible(false)}
          onClose={() => setVisible(false)}
          open={visible}
        >
          <Menubar clickEvent={() => setVisible(false)} />
        </Drawer>
      </Row>
      <Layout>
        <Sider
          className="sidebar"
          theme="light"
          width={240}
          breakpoint={"lg"}
          collapsedWidth={0}
          trigger={null}
        >
          <Menubar />
        </Sider>
        <Content style={contentStyle}>
          <Router />
        </Content>
      </Layout>
      <Modal
        title={
          <span className="Modal-title">
            Profile{" "}
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => setEdited(!isEdited)}
            />
          </span>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        width={800}
        style={{
          top: "20%",
        }}
      >
        <Divider />
        <Row className="width-100" gutter={15}>
          <Col span="12">
            <Input
              placeholder="Email"
              name="email"
              value={state.email}
              disabled={isEdited}
              onChange={handleInputChange}
            />
          </Col>
          <Col span="12">
            <Input
              placeholder="Trade Name"
              name="trade_name"
              value={state.trade_name}
              disabled={isEdited}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Row className="width-100 margin-top-20" gutter={15}>
          <Col span="12">
            <Input
              placeholder="Legal Name"
              name="legal_name"
              value={state.legal_name}
              disabled={isEdited}
              onChange={handleInputChange}
            />
          </Col>
          <Col span="12">
            <Input
              placeholder="Country"
              name="country"
              value={state.country}
              disabled={isEdited}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Row className="width-100 margin-top-20" gutter={15}>
          <Col span="12">
            <Input
              placeholder="State/town"
              name="state_town"
              value={state.state_town}
              disabled={isEdited}
              onChange={handleInputChange}
            />
          </Col>
          <Col span="12">
            <Input
              placeholder="Building Number"
              name="building_number"
              value={state.building_number}
              disabled={isEdited}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Row className="width-100 margin-top-20" gutter={15}>
          <Col span="12">
            <Input
              placeholder="Phone Number"
              name="phone_number"
              value={state.phone_number}
              disabled={isEdited}
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Divider />
      </Modal>
    </BrowserRouter>
  );
};

export default App;
