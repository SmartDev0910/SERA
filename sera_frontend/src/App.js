import React, { useEffect, useState } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import Router from "./routes";
import Menubar from "./layouts/Menubar";
import {
  Layout,
  Avatar,
  Row,
  Button,
  notification,
  Drawer,
  Dropdown,
  message,
  Badge,
  Tag,
} from "antd";
import {
  MenuOutlined,
  CaretDownOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./utils/connector";
import { ethers } from "ethers";
import axios from "axios";
import logo from "./logo.jpg";
import { SERVER_ERROR } from "./utils/messages";
import "./App.css";

const { Sider, Content } = Layout;

const siderStyle = {
  height: "calc(100vh - 94px)",
  position: "-webkit-sticky !important;",
  position: "sticky !important;",
  top: 0,
};

const contentStyle = {
  height: "calc(100vh - 94px)",
  backgroundColor: "#fff",
  color: "#000",
  padding: "20px",
  minHeight: 120,
  textAlign: "center",
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
  const [visible, setVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  const [notiCount, setNotiCount] = useState(0);
  const [notiData, setNotiData] = useState([]);
  const [trade_name, setTradeName] = useState("");

  async function connect(injected) {
    activate(injected);
  }

  async function disConnect(injected) {
    deactivate(injected);
  }

  const items = [
    {
      label: <Link to="/profile">My Account</Link>,
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: trade_name,
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
      label: "Disconnect",
      key: "3",
    },
    {
      label: <a href="/">Sign Out</a>,
      key: "4",
    },
  ];

  const onMenuClick = (e) => {
    if (e.key === "3") disConnect(injected);
  };

  const onNotiClick = async (e) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_IP_ADDRESS}/v1/updaterfqbystatus`,
        {
          MaterialId: Number(e.key),
          Status: 1,
        }
      );
      updateNotiData();
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const renderButton = (
    <>
      {active ? (
        <Dropdown
          menu={{
            items,
            onClick: onMenuClick,
          }}
          trigger={["click"]}
        >
          <Button
            className="btn btn-launch-app"
            onClick={(e) => e.preventDefault()}
          >
            {account.substring(0, 5) + " ... " + account.substring(38)}{" "}
            <CaretDownOutlined />
          </Button>
        </Dropdown>
      ) : (
        <Button
          className="btn btn-launch-app"
          onClick={() => connect(injected)}
        >
          CONNECT WALLET
        </Button>
      )}
    </>
  );

  const updateNotiData = async () => {
    const res = await axios.post(
      `${process.env.REACT_APP_IP_ADDRESS}/v1/getrfqbystatus`,
      {
        Status: 0,
      }
    );
    if (res.data.status_code === 200) {
      await setNotiCount(res.data.data.length);
      console.log(res.data.data);
      let tmp = [];
      res.data.data.map((item) => {
        tmp.push({
          label: item.Buspartner + " was added new RFQ." ,
          key: item.MaterialId,
        });
      });
      await setNotiData(tmp);
    } else {
      await setNotiCount(0);
      setNotiData([]);
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
          await updateNotiData();
          const res = await axios.post(
            `${process.env.REACT_APP_IP_ADDRESS}/v1/getuser`,
            {
              Wallet_address: account,
            }
          );

          if (res.data.status_code === 200) {
            setTradeName(res.data.data.Trade_name);
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
        <span className="float-right">
          <Dropdown
            menu={{
              items: notiData,
              onClick: onNotiClick,
            }}
            placement="bottomRight"
            arrow
            trigger={["click"]}
          >
            <Badge className="badge" size="small" count={notiCount}>
              <Button
                className="btn btn-bell"
                icon={<BellOutlined />}
                onClick={(e) => e.preventDefault()}
              />
            </Badge>
          </Dropdown>
          {renderButton}
        </span>

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
          theme="light"
          width={240}
          breakpoint={"lg"}
          collapsedWidth={0}
          trigger={null}
          style={siderStyle}
        >
          <Menubar />
        </Sider>
        <Content style={contentStyle}>
          <Router />
        </Content>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
