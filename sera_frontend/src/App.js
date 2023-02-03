import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import Menubar from "./layouts/Menubar";
import { Layout, Avatar, Row, Button, notification } from "antd";
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
      <Layout>
        <Row className="App-header" align="middle">
          <Avatar shape="square" src={logo} style={logoStyle} />
          {renderButton}
        </Row>
        <Layout>
          <Sider theme="light" width={240}>
            <Menubar />
          </Sider>
          <Content style={contentStyle}>
            <Router />
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
