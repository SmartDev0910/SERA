import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import {
  Row,
  Button,
  Typography,
  Divider,
  Input,
  Table,
  Pagination,
  Modal,
  Tag,
  message,
  Spin,
  Rate,
  Form,
  Descriptions,
} from "antd";
import provenanceAbi from "../abis/provenanceAbi";
import trackAbi from "../abis/trackingAbi.json";
import { SERVER_ERROR, TRANSACTION_ERROR } from "../utils/messages";
import "./page.css";

const { Title } = Typography;
const { Search } = Input;

const BusinessEcosystem = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [from_email, setFromEmail] = useState("");
  const [to_email, setToEmail] = useState("");
  const [wallet_address, setWalletAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isWalletIntalled, setIsWalletInstalled] = useState(false);
  const [search_text, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const { chainId, active, account } = useWeb3React();
  const validNetwork =
    chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? true : false;
  let ProvenanceContract = null;

  const calculateRate = (val) => {
    if (val % 10 >= 5) {
      return val / 10 + 0.5;
    } else {
      return val / 10;
    }
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

  const columns = [
    {
      title: "Trade Name",
      dataIndex: "t_name",
      sorter: {
        compare: (a, b) => a.t_name - b.t_name,
        multiple: 1,
      },
    },
    {
      title: "Legal Name",
      dataIndex: "l_name",
      sorter: {
        compare: (a, b) => a.l_name - b.l_name,
        multiple: 2,
      },
    },
    {
      title: "Country",
      dataIndex: "country",
      sorter: {
        compare: (a, b) => a.country - b.country,
        multiple: 3,
      },
    },
    {
      title: "State/town",
      dataIndex: "state_town",
      sorter: {
        compare: (a, b) => a.state_town - b.state_town,
        multiple: 4,
      },
    },
    {
      title: "Building Number",
      dataIndex: "b_number",
      sorter: {
        compare: (a, b) => a.b_number - b.b_number,
        multiple: 5,
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
    },
    {
      title: "Wallet Address",
      dataIndex: "w_address",
    },
    {
      title: "Reputation",
      dataIndex: "reputation",
      render: (data) => <Rate allowHalf disabled value={calculateRate(data)} />,
      sorter: {
        compare: (a, b) => a.reputation - b.reputation,
        multiple: 6,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: {
        compare: (a, b) => a.status - b.status,
        multiple: 7,
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onSearch = (value) => {
    setSearchText(value);
  };
  const handleOk = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_IP_ADDRESS}/v1/sendmail`,
        {
          from: from_email,
          to: to_email,
          password: password,
        }
      );

      if (res.data.status_code === 200) {
        message.success(res.data.msg, 5);
      }
    } catch (e) {
      message.error(SERVER_ERROR, 5);
      console.log(e);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChangeWalletAddress = (e) => {
    setWalletAddress(e.target.value);
  };

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);

    async function fetchData() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_IP_ADDRESS}/v1/getlist`
        );
        let tmp = [];

        let TrackContract = new ethers.Contract(
          process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
          trackAbi,
          myProvider.getSigner()
        );
        for (let item of res.data.data) {
          if (item.Wallet_address !== account) {
            let reputation = await TrackContract.calculateReputation(
              item.Wallet_address
            );
            tmp.push({
              t_name: item.Trade_name,
              l_name: item.Legal_name,
              country: item.Country,
              state_town: item.State_town,
              b_number: item.Building_number,
              email: item.Email,
              phone: item.Phone_number,
              w_address: item.Wallet_address,
              reputation: reputation,
              status: <Tag color="magenta">Active</Tag>,
            });
          }
        }
        setData(tmp);
        setLoading(false);
      } catch (e) {
        message.error(TRANSACTION_ERROR, 5);
        console.log(e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (validNetwork && active && window.ethereum) {
      const myProvider = new ethers.providers.Web3Provider(window.ethereum);
      ProvenanceContract = new ethers.Contract(
        process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
        provenanceAbi,
        myProvider.getSigner()
      );
    }
  }, [validNetwork, active]);

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Row className="margin-top-20">
          <span className="title-style">Business Ecosystem</span>
        </Row>
        <Divider />
        <Row>
          <Title level={4}>Business Partner</Title>
        </Row>
        <Row justify="space-between">
          <Button className="black-button" onClick={showModal}>
            Add Business Partner
          </Button>
          <Search
            placeholder="Search By Wallet Address"
            className="search-input"
            onSearch={onSearch}
          />
        </Row>
        <Table
          className="margin-top-20"
          columns={columns}
          scroll={{ x: 2000 }}
          dataSource={
            data &&
            (search_text === ""
              ? data
              : data.filter((i) => i.w_address.includes(search_text)))
          }
          onChange={onChange}
          pagination={false}
        />
        {/* <Pagination
        total={85}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        defaultPageSize={20}
        defaultCurrent={1}
        className="margin-top-20"
      /> */}
        <Modal
          title={<Title level={4}>Add Business Partner</Title>}
          open={isModalOpen}
          okText="Send invitation"
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Input
            className="margin-top-20"
            placeholder="Wallet Address"
            value={wallet_address}
            onChange={handleChangeWalletAddress}
            maxLength={42}
          />
          {data.filter((i) => i.w_address.includes(wallet_address)).length ? (
            <>
              <Divider />
              <Descriptions title="Party Info" column={1} bordered>
                <Descriptions.Item label="Wallet Address">
                  {data
                    .filter((i) => i.w_address.includes(wallet_address))[0]
                    .w_address.substring(0, 8) +
                    " ... " +
                    data
                      .filter((i) => i.w_address.includes(wallet_address))[0]
                      .w_address.substring(35)}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {
                    data.filter((i) => i.w_address.includes(wallet_address))[0]
                      .email
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Trade Name">
                  {
                    data.filter((i) => i.w_address.includes(wallet_address))[0]
                      .t_name
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Legal Name">
                  {
                    data.filter((i) => i.w_address.includes(wallet_address))[0]
                      .l_name
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                  {
                    data.filter((i) => i.w_address.includes(wallet_address))[0]
                      .country
                  }
                </Descriptions.Item>
                <Descriptions.Item label="State/town">
                  {
                    data.filter((i) => i.w_address.includes(wallet_address))[0]
                      .state_town
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Building Number">
                  {
                    data.filter((i) => i.w_address.includes(wallet_address))[0]
                      .b_number
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Phone Number">
                  {
                    data.filter((i) => i.w_address.includes(wallet_address))[0]
                      .phone
                  }
                </Descriptions.Item>
              </Descriptions>
            </>
          ) : (
            <Form validateMessages={validateMessages}>
              <Divider orientation="left"> Invitation Info </Divider>
              <Form.Item
                name={"Email_To"}
                rules={[
                  {
                    type: "email",
                  },
                ]}
                style={{ marginBottom: "0px" }}
              >
                <Input
                  className="margin-top-20"
                  placeholder="Business Partner Email"
                  value={to_email}
                  onChange={(e) => {
                    setToEmail(e.target.value);
                  }}
                  maxLength={42}
                />
              </Form.Item>
              <Form.Item
                name={"Email"}
                rules={[
                  {
                    type: "email",
                  },
                ]}
                style={{ marginBottom: "0px" }}
              >
                <Input
                  className="margin-top-20"
                  placeholder="Your Email"
                  value={from_email}
                  onChange={(e) => {
                    setFromEmail(e.target.value);
                  }}
                  maxLength={42}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  className="margin-top-20"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Form.Item>
            </Form>
          )}
        </Modal>
      </Spin>
    </>
  );
};

export default BusinessEcosystem;
