import React, { useState, useEffect } from "react";
import { Layout, Row, Tabs, Button, Input, message, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../utils/connector";
import { useDispatch } from "react-redux";
import { ADD_PRODUCER } from "../utils/constants";
import axios from "axios";
import "./page.css";
import logo from "./logo.jpg";

const Login = () => {
  const [activeKey, setActiveKey] = useState("tab_signin");
  const [state, setState] = useState({
    email: "",
    password: "",
    trade_name: "",
    legal_name: "",
    country: "",
    state_town: "",
    building_number: "",
    phone_number: "",
    wallet_address: "",
  });
  const { chainId, active, activate, deactivate, account } = useWeb3React();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function connect(injected) {
    activate(injected);
  }

  async function disConnect(injected) {
    deactivate(injected);
  }

  const onChange = (key) => {
    setActiveKey(key);
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

  const handleSubmit = async () => {
    if (activeKey === "tab_signin") {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}/v1/signin`,
          {
            email: state.email,
            password: state.password,
          }
        );
        if (res.data.status_code === 200) {
          message.success("Login successfully.");
          navigate("/business-ecosystem");
        } else {
          message.error(res.data.msg);
        }
      } catch (e) {
        message.error(e.response.data.msg);
      }
    } else if (activeKey === "tab_signup") {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}/v1/signup`,
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
          message.success("Sign Up successfully.");
        } else {
          message.error(res.data.msg);
        }
      } catch (e) {
        message.error(e.response.data.msg);
      }
      dispatch({
        type: ADD_PRODUCER,
        payload: state,
      });

      setActiveKey("tab_signin");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevProps) => ({
      ...prevProps,
      [name]: value,
    }));
  };

  const renderButton = (
    <>
      {active ? (
        <Button
          className="auth-wallet-button"
          onClick={() => disConnect(injected)}
        >
          {account.substring(0, 5) + " ... " + account.substring(38)} /
          Disconnect
        </Button>
      ) : (
        <Button
          className="auth-wallet-button"
          onClick={() => connect(injected)}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );

  const items = [
    {
      key: "tab_signin",
      label: `Sign In`,
      children: (
        <Form validateMessages={validateMessages}>
          <Form.Item
            name={["Email"]}
            rules={[
              {
                type: "email",
              },
            ]}
            style={{ marginBottom: "0px" }}
          >
            <Input
              placeholder="Email"
              className="auth-input-style"
              name="email"
              value={state.email}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Input.Password
            placeholder="input password"
            className="auth-input-style"
            name="password"
            value={state.password}
            onChange={handleInputChange}
          />
          {renderButton}
        </Form>
      ),
    },
    {
      key: "tab_signup",
      label: `Create an account`,
      children: (
        <Form validateMessages={validateMessages}>
          {renderButton}
          <Input
            placeholder="Company trade name"
            className="auth-input-style"
            name="trade_name"
            value={state.trade_name}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Company legal name"
            className="auth-input-style"
            name="legal_name"
            value={state.legal_name}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Country"
            className="auth-input-style"
            name="country"
            value={state.country}
            onChange={handleInputChange}
          />
          <Input
            placeholder="State town"
            className="auth-input-style"
            name="state_town"
            value={state.state_town}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Building number"
            className="auth-input-style"
            name="building_number"
            value={state.building_number}
            onChange={handleInputChange}
          />
          <Input
            placeholder="Phone number"
            className="auth-input-style"
            name="phone_number"
            value={state.phone_number}
            onChange={handleInputChange}
          />
          <Form.Item
            name={["Email"]}
            rules={[
              {
                type: "email",
              },
            ]}
            style={{ marginBottom: "0px" }}
          >
            <Input
              placeholder="Email"
              className="auth-input-style"
              name="email"
              value={state.email}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Input.Password
            placeholder="input password"
            className="auth-input-style"
            style={{ marginTop: "0px; !important" }}
            name="password"
            value={state.password}
            onChange={handleInputChange}
          />
        </Form>
      ),
    },
  ];

  useEffect(() => {
    if (active) {
      if (chainId !== parseInt(process.env.REACT_APP_CHAIN_ID)) {
        message.error(
          "You are on wrong network. Please switch to Ethereum Mainnet to continue"
        );
      }
    }
  }, [chainId, active]);

  return (
    <Layout className="auth-page-background auth-lock-default">
      <Row justify="center" className="auth-lock-content">
        <Row justify="center" className="auth-pane">
          <Row className="auth0-lock-header">
            <div className="auth0-lock-header-welcome">
              <img alt="" className="auth0-lock-header-logo" src={logo} />
              <div
                className="auth0-lock-name"
                title={
                  activeKey === "tab_signin"
                    ? "Sign in to SERA Blockchain"
                    : "Ready for the next move?"
                }
              >
                {activeKey === "tab_signin"
                  ? "Sign in to SERA Blockchain"
                  : "Ready for the next move?"}
              </div>
            </div>
          </Row>
          <Row className="auth0-lock-content" justify="center">
            <Tabs
              className="tab-style"
              centered
              items={items}
              size="large"
              onChange={onChange}
              activeKey={activeKey}
            />
          </Row>
          <Button className="auth0-lock-footer" onClick={handleSubmit}>
            {activeKey === "tab_signin" ? "Sign In" : "Get started"}
          </Button>
        </Row>
      </Row>
    </Layout>
  );
};

export default Login;
