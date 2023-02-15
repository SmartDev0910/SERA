import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import {
  Row,
  Button,
  Typography,
  Divider,
  Table,
  Pagination,
  Modal,
  Select,
  Spin,
  Input,
  Descriptions,
  message,
} from "antd";
import provAbi from "../abis/provenanceAbi.json";
import "./page.css";

import { SERVER_ERROR, TRANSACTION_ERROR } from "../utils/messages";

const { Title } = Typography;
const { Search } = Input;

const AuthParties = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busPartnerOp, setBusPartnerOp] = useState([]);
  const [isWalletIntalled, setIsWalletInstalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [search_text, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [state, setState] = useState({
    email: "",
    trade_name: "",
    legal_name: "",
    country: "",
    state_town: "",
    building_number: "",
    phone_number: "",
  });
  const [wallet_address, setWalletAddress] = useState("");
  const { chainId, active, account } = useWeb3React();
  let ProvContract = null;
  const validNetwork =
    chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? true : false;

  const columns = [
    {
      title: "Party",
      dataIndex: "party",
      sorter: {
        compare: (a, b) => a.party - b.party,
        multiple: 1,
      },
    },
    {
      title: "Party Wallet Address",
      dataIndex: "org_wallet_address",
      sorter: {
        compare: (a, b) => a.org_wallet_address - b.org_wallet_address,
        multiple: 3,
      },
    },
  ];

  const updateOrganizations = async () => {
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    ProvContract = new ethers.Contract(
      process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
      provAbi,
      myProvider.getSigner()
    );

    let tmp = [];
    let pro_count = await ProvContract.producer_count();

    for (let i = 0; i < pro_count; i++) {
      let pro_address = await ProvContract.producer_list(i);
      let producer = await ProvContract.producers(pro_address);
      if (producer.autherized_by === account)
        tmp.push({
          party: producer.name,
          org_wallet_address: pro_address,
        });
    }

    await setData(tmp);
    setLoading(false);
  };

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
    setLoading1(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    ProvContract = new ethers.Contract(
      process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
      provAbi,
      myProvider.getSigner()
    );
    await ProvContract.addProducer(
      wallet_address,
      state.email,
      state.trade_name,
      state.legal_name,
      state.country,
      state.state_town,
      state.building_number,
      state.phone_number
    )
      .then((tx) => {
        return tx.wait().then(
          async (receipt) => {
            // This is entered if the transaction receipt indicates success
            message.success("Added new producer successfully.", 5);
            setLoading1(false);
            updateOrganizations();
            return true;
          },
          (error) => {
            message.error(TRANSACTION_ERROR, 5);
            console.log(error);
            setLoading1(false);
          }
        );
      })
      .catch((error) => {
        message.error(TRANSACTION_ERROR, 5);
        console.log(error);
        setLoading1(false);
      });

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}/v1/getuser`,
          {
            Wallet_address: wallet_address,
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
        console.log(e);
      }
    }
    fetchData();
  }, [wallet_address]);

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
    async function fetchData() {
      try {
        let tmp = [];
        const res = await axios.get(
          `${process.env.REACT_APP_IP_ADDRESS}/v1/getlist`
        );
        res.data.data.map((item) => {
          if (item.Wallet_address !== account)
            tmp.push({
              label: item.Wallet_address,
              value: item.Wallet_address,
            });
        });
        setBusPartnerOp(tmp);
      } catch (e) {
        message.error(SERVER_ERROR, 5);
        console.log(e);
      }
    }
    fetchData();

    updateOrganizations();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (validNetwork && active && window.ethereum) {
        const myProvider = new ethers.providers.Web3Provider(window.ethereum);
        function getProvContract() {
          ProvContract = new ethers.Contract(
            process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
            provAbi,
            myProvider.getSigner()
          );
        }
        await getProvContract();
        updateOrganizations();
      }
    }
    fetchData();
  }, [validNetwork, active]);

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Row className="margin-top-20">
          <span className="title-style">Authorized Parties</span>
        </Row>
        <Divider />
        <Row justify="space-between">
          <Button className="black-button" onClick={showModal}>
            Add Party
          </Button>
          <Search
            placeholder="Search Party"
            className="search-input"
            onSearch={onSearch}
          />
        </Row>
        <Table
          className="margin-top-20"
          columns={columns}
          scroll={{ x: true }}
          dataSource={data}
          onChange={onChange}
          pagination={false}
        />
        {/* <Pagination
          total={30}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          defaultPageSize={20}
          defaultCurrent={1}
          className="margin-top-20"
        /> */}
        <Modal
          title={<Title level={4}>Add Party</Title>}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Add party"
          width={800}
        >
          <Spin spinning={loading1} tip="Loading...">
            <Divider orientation="center">
              Authorized party's wallet address
            </Divider>
            <Select
              className="producer-select"
              value={wallet_address}
              onChange={(value) => {
                setWalletAddress(value);
              }}
              placeholder="Party Wallet Address"
              options={busPartnerOp}
            />
            <Divider />
            <Descriptions title="Party Info">
              <Descriptions.Item label="Email">{state.email}</Descriptions.Item>
              <Descriptions.Item label="Trade Name">
                {state.trade_name}
              </Descriptions.Item>
              <Descriptions.Item label="Legal Name">
                {state.legal_name}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {state.country}
              </Descriptions.Item>
              <Descriptions.Item label="State/town">
                {state.state_town}
              </Descriptions.Item>
              <Descriptions.Item label="Building Number">
                {state.building_number}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                {state.phone_number}
              </Descriptions.Item>
            </Descriptions>
          </Spin>
        </Modal>
      </Spin>
    </>
  );
};

export default AuthParties;
