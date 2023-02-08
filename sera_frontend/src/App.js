import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import Menubar from "./layouts/Menubar";
import { Layout, Avatar, Row, Button, notification, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./utils/connector";

import logo from "./logo.jpg";
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
  const [visible, setVisible] = useState(false);
  async function connect(injected) {
    activate(injected);
  }

  async function disConnect(injected) {
    deactivate(injected);
  }
  const renderButton = (
    <>
      {active ? (
        <Button
          className="btn btn-green btn-launch-app"
          onClick={() => disConnect(injected)}
        >
          {account.substring(0, 5) + " ... " + account.substring(38)} /
          DISCONNECT
        </Button>
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
            "You are on wrong network. Please switch to Ethereum Mainnet to continue",
        });
      }
    }
  }, [chainId, active]);

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
          visible={visible}
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
    </BrowserRouter>
  );
};

export default App;
